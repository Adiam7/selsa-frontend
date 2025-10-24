// src/app/api/auth/reset-password/route.ts
import { z } from "zod";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendResetEmail } from "@/lib/email/sendResetEmail";

export async function POST(req: Request) {
  const { email } = z.string().email().parse(await req.json());
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1h
  await prisma.verificationToken.create({ data: { identifier: email, token, expires } });

  await sendResetEmail({ email, token });
  return NextResponse.json({ success: true });
}
