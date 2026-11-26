import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { readDb } from "@/lib/db";
import type { SessionUser, User } from "@/lib/types";

export const SESSION_COOKIE = "aurora_session";
const MAX_AGE = 60 * 60 * 24 * 7;

function secret(): string {
  return process.env.AUTH_SECRET ?? "aurora-local-development-secret";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createToken(user: Pick<User, "id">): string {
  const payload = Buffer.from(
    JSON.stringify({ sub: user.id, exp: Date.now() + MAX_AGE * 1000 }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function readToken(token: string): string | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return typeof data.sub === "string" ? data.sub : null;
  } catch {
    return null;
  }
}

export function setSessionCookie(user: Pick<User, "id">): void {
  cookies().set(SESSION_COOKIE, createToken(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function clearSessionCookie(): void {
  cookies().set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const userId = readToken(token);
  if (!userId) return null;

  const db = await readDb();
  const user = db.users.find((entry) => entry.id === userId);
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function requireAdmin(): Promise<SessionUser | null> {
  const user = await getSessionUser();
  return user && user.role === "admin" ? user : null;
}
