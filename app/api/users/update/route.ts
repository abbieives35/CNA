import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const user = await getUserFromToken(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bio, jobTitle, company, avatarUrl, name } = await req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        bio,
        jobTitle,
        company,
        avatarUrl,
        name,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        jobTitle: true,
        company: true,
        avatarUrl: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
