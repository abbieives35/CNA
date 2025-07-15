import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserFromToken } from "./lib/auth";

// Public API routes that don't require auth
const PUBLIC_PATHS = [
  "/api/auth/login",
  "/api/auth/register",
];

// Middleware runs on all requests
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public endpoints
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for bearer token in Authorization header
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
  }

  const user = await getUserFromToken(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized: Invalid or expired token" }, { status: 401 });
  }

  // ✅ You can optionally attach role info for future use (e.g., with headers or cookies)
  // const response = NextResponse.next();
  // response.headers.set("x-user-role", user.role);
  // return response;

  return NextResponse.next();
}
