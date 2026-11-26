import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/password";
import { readDb } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { message: "Enter your email and password." },
      { status: 422 },
    );
  }

  const db = await readDb();
  const user = db.users.find((entry) => entry.email === email);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json(
      { message: "Those details don't match an account." },
      { status: 401 },
    );
  }

  setSessionCookie(user);

  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}
