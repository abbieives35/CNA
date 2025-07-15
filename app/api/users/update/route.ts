import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  const user = await getUserFromToken(token);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bio, jobTitle, company } = await req.json();

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { bio, jobTitle, company, avatarUrl, },
  });

  return NextResponse.json({ user: updated });
}
