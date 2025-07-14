import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password, name, inviteCode } = await req.json();

  // Check if required fields are provided
  if (!email || !password || !name || !inviteCode) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Validate invite code
  const invite = await prisma.inviteCode.findUnique({
    where: { code: inviteCode },
  });

  if (!invite || invite.used) {
    return NextResponse.json({ error: "Invalid or used invite code" }, { status: 400 });
  }

  // Prevent duplicate users
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  // Mark invite code as used
  await prisma.inviteCode.update({
    where: { code: inviteCode },
    data: { used: true },
  });

  return NextResponse.json({ message: "User registered successfully" });
}
