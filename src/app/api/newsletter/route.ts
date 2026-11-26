import { NextResponse } from "next/server";
import { updateDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json(
      { message: "Please enter a valid email address." },
      { status: 422 },
    );
  }

  await updateDb((db) => {
    if (!db.subscribers.includes(email)) db.subscribers.push(email);
  });

  return NextResponse.json({ ok: true, message: "You're on the list." });
}
