import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const user = await getUserFromToken(token);

  if (!user) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  // Don't return password in response
  const { password, ...safeUser } = user;

  return NextResponse.json({ user: safeUser });
}
