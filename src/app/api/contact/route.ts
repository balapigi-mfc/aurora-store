import { NextResponse } from "next/server";
import { updateDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { name?: string; email?: string; subject?: string; body?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const subject = body.subject?.trim() ?? "";
  const message = body.body?.trim() ?? "";

  if (!name || !subject || message.length < 10) {
    return NextResponse.json(
      { message: "Please add your name, a subject and a short message." },
      { status: 422 },
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json(
      { message: "That email address doesn't look right." },
      { status: 422 },
    );
  }

  await updateDb((db) => {
    db.messages.unshift({
      id: `msg_${Date.now().toString(36)}`,
      name,
      email,
      subject,
      body: message.slice(0, 2000),
      createdAt: new Date().toISOString(),
    });
  });

  return NextResponse.json({ ok: true });
}
