import { Suspense } from "react";
import { notFound } from "next/navigation";

import EventoDetalle from "./EventoDetalle";
import { EventoDetalleSkeleton } from "./EventoDetalleSkeleton";

interface EventoPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventoPage({ params }: EventoPageProps) {
  const { slug } = await params;

  try {
    // Extraer el ID del UUID completo al final del slug
    // Formato esperado: nombre-evento-UUIDV4 (con guiones incluidos)
    // Buscamos un patrón que coincida con un UUID de Supabase (formato v4 con guiones)
    const id = slug.match(
      /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i,
    );

    // Obtener los datos del evento por su ID
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/eventos/${id}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    // Si la respuesta no es correcta, mostrar 404
    if (!response.ok) {
      return notFound();
    }

    const evento = await response.json();

    // Si no se encuentra el evento, mostrar 404
    if (!evento) {
      return notFound();
    }

    return (
      <Suspense fallback={<EventoDetalleSkeleton />}>
        <EventoDetalle evento={evento} />
      </Suspense>
    );
  } catch (error: unknown) {
    // Si hay un error al obtener el evento, mostrar 404
    console.error(
      "Error al obtener el evento:",
      error instanceof Error ? error.message : error,
    );
    return notFound();
  }
}
