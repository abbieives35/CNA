import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      comments: true,
    },
  });

  return NextResponse.json({ posts });
}
