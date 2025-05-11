// app/api/events/[id]/route.ts
import { NextResponse } from "next/server";
import type { Database } from "@/types/supabase.types";
import { EventStatus } from "@/types/events.types";
import {
  getEventById,
  updateEventStatus,
  deleteEvent,
} from "@/app/actions/db/events";

/**
 * GET /api/events/:id
 * Detalle de un evento por ID
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse<Database["public"]["Tables"]["eventos"]["Row"]>> {
  const { id } = params;
  const event = await getEventById(id);
  return NextResponse.json(event);
}

/**
 * PATCH /api/events/:id
 * Actualiza el estado de un evento
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse<Database["public"]["Tables"]["eventos"]["Row"]>> {
  const { id } = params;
  // El cuerpo debe incluir { status: EventStatus | null }
  const { status } = (await request.json()) as { status: EventStatus | null };
  const updated = await updateEventStatus(id, status!); // status validado externamente
  return NextResponse.json(updated);
}

/**
 * DELETE /api/events/:id
 * Elimina un evento
 */
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse<null>> {
  const { id } = params;
  await deleteEvent(id);
  return NextResponse.json(null, { status: 204 });
}
