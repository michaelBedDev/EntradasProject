// app/api/auth/debug/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// app/api/auth/debug/route.ts
export async function GET(request: NextRequest) {
  const cookie = request.cookies.get("sb-access-token");

  // Devolver timestamp actual para evitar caché
  return NextResponse.json({
    timestamp: Date.now(),
    cookiePresent: !!cookie,
    rawCookie: cookie?.value || null,
  });
}
