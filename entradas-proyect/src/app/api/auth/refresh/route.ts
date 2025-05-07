import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { createSupabaseJwt } from "@/lib/supabase/jwt";

// getServerSession sin argumentos detecta la config de [...nextauth]
export async function GET() {
  const session = await getServerSession();

  if (!session?.address) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const access_token = createSupabaseJwt(session.address);
  return NextResponse.json({ access_token });
}
