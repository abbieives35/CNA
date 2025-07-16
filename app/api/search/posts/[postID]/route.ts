import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { postID: string } }
) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const user = await getUserFromToken(token);

  const post = await prisma.post.findUnique({ where: { id: params.postID } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  if (post.authorId !== user?.id && user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.post.delete({ where: { id: params.postID } });
  return NextResponse.json({ message: "Post deleted" });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { postID: string } }
) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const user = await getUserFromToken(token);
  const { content, gifUrl, title } = await req.json();

  const post = await prisma.post.findUnique({ where: { id: params.postID } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  if (post.authorId !== user?.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.post.update({
    where: { id: params.postID },
    data: { content, gifUrl, title },
  });

  return NextResponse.json({ post: updated });
}
