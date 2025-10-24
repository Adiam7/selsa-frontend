// src/app/api/auth/change-password/route.ts
import { z } from "zod";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password-utils";

export async function POST(req: Request) {
  const { token, newPassword } = z.object({ token: z.string(), newPassword: z.string().min(8) }).parse(await req.json());

  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record || new Date() > record.expires) {
    return NextResponse.json({ error: "Token invalid or expired" }, { status: 400 });
  }

  await prisma.user.update({
    where: { email: record.identifier },
    data: { password: await hashPassword(newPassword) },
  });
  await prisma.verificationToken.delete({ where: { token } });

  return NextResponse.json({ success: true });
}
