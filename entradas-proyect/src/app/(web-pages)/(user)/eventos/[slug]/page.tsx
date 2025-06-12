import { notFound } from "next/navigation";

import EventoDetalle from "./EventoDetalle";

import { extractID } from "@/features/eventos/lib/extractUUIDFromRoute";

interface EventoPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventoPage({ params }: EventoPageProps) {
  const { slug } = await params;

  try {
    //Se extrae el id de la URL recibida
    const id = extractID(slug);

    if (!id) {
      return {
        notFound: true,
      };
    }

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

    return <EventoDetalle evento={evento} />;
  } catch (error: unknown) {
    // Si hay un error al obtener el evento, mostrar 404
    console.error(
      "Error al obtener el evento:",
      error instanceof Error ? error.message : error,
    );
    return notFound();
  }
}
