// app/api/events/route.ts
import { NextResponse } from "next/server";
import type { Database } from "@/types/supabase.types";
import { getAllEvents, createEvent } from "@/app/actions/db/events";

/**
 * GET /api/events
 * Lista todos los eventos ordenados por fecha
 */
export async function GET(): Promise<
  NextResponse<Database["public"]["Tables"]["eventos"]["Row"][]>
> {
  // Internamente getAllEvents usa getSupabaseServerClient()
  const events = await getAllEvents();
  return NextResponse.json(events);
}

/**
 * POST /api/events
 * Crea un nuevo evento. Body debe cumplir CreateEventPayload
 */
export async function POST(
  request: Request,
): Promise<NextResponse<Database["public"]["Tables"]["eventos"]["Row"]>> {
  const payload = (await request.json()) as Omit<
    Database["public"]["Tables"]["eventos"]["Insert"],
    "id" | "created_at" | "status"
  >;
  const newEvent = await createEvent(payload);
  return NextResponse.json(newEvent, { status: 201 });
}
