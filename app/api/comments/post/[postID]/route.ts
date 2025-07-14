import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
  const { postId } = params;

  if (!postId) {
    return NextResponse.json({ error: "Missing postId" }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
    include: {
      author: {
        select: { id: true, name: true },
      },
    },
  });

  return NextResponse.json({ comments });
}
