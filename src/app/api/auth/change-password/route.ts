import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { hashPassword } from "@/lib/auth/hash";
import prisma from "@/lib/prisma";

// POST /api/auth/change-password
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as { user?: { email?: string } } | null;
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: "Both old and new passwords are required." }, { status: 400 });
    }

    // Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Verify old password
    const isValid = await hashPassword.verify(oldPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Old password is incorrect." }, { status: 400 });
    }

    // Hash new password and update
    const hashed = await hashPassword.hash(newPassword);
    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashed },
    });

    return NextResponse.json({ message: "Password changed successfully." }, { status: 200 });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }