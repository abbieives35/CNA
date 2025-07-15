import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserFromToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  const sender = await getUserFromToken(token);
  if (!sender) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { recipientId, content } = await req.json();
  if (!recipientId || !content) {
    return NextResponse.json({ error: "Missing recipientId or content" }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      senderId: sender.id,
      recipientId,
      content,
    },
  });

  return NextResponse.json({ message });
}
