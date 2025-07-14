import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserFromToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const user = await getUserFromToken(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId, content, gifUrl } = await req.json();

  if (!postId || !content) {
    return NextResponse.json({ error: "postId and content are required" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      postId,
      content,
      gifUrl,
      authorId: user.id,
    },
  });

  return NextResponse.json({ comment });
}
