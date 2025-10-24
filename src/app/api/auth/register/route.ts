// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/password-utils";
import prisma from "@/lib/prisma";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const data = RegisterSchema.parse(await req.json());
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 400 });

    const hashed = await hashPassword(data.password);
    await prisma.user.create({ data: { name: data.name, email: data.email, password: hashed } });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    const message = err.errors?.[0]?.message || err.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
