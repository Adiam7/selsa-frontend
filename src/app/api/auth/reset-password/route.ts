// src/app/api/auth/reset-password/route.ts
import { sendResetEmail } from "@/lib/email/sendResetEmail";
import { getUserByEmail } from "@/lib/db/users";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();
  const user = await getUserByEmail(email);

  if (!user) {
    return NextResponse.json({ error: "No user with that email" }, { status: 404 });
  }

  await sendResetEmail(user); // generates token + sends email
  return NextResponse.json({ success: true });
}
