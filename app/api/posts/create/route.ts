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

  const { content, imageUrl, link } = await req.json();

  if (!content && !imageUrl && !link) {
    return NextResponse.json(
      { error: "Post must include at least one of: content, imageUrl, or link" },
      { status: 400 }
    );
  }

  const post = await prisma.post.create({
    data: {
      content,
      imageUrl,
      link,
      authorId: user.id,
    },
  });

  return NextResponse.json({ post });
}
