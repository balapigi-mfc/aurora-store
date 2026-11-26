import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";
import { readDb, updateDb } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { name?: string; email?: string; password?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (name.length < 2) {
    return NextResponse.json(
      { message: "Please tell us your name." },
      { status: 422 },
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json(
      { message: "That email address doesn't look right." },
      { status: 422 },
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { message: "Passwords need at least 8 characters." },
      { status: 422 },
    );
  }

  const db = await readDb();
  if (db.users.some((user) => user.email === email)) {
    return NextResponse.json(
      { message: "An account with that email already exists." },
      { status: 409 },
    );
  }

  const user = {
    id: `u_${Date.now().toString(36)}`,
    name,
    email,
    passwordHash: hashPassword(password),
    role: "customer" as const,
    createdAt: new Date().toISOString(),
  };

  await updateDb((next) => {
    next.users.push(user);
  });

  setSessionCookie(user);

  return NextResponse.json(
    {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    },
    { status: 201 },
  );
}
