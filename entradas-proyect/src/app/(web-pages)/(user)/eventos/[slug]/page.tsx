import { notFound } from "next/navigation";

import EventoDetalle from "./EventoDetalle";

import { extractID } from "@/features/eventos/lib/extractUUIDFromRoute";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/lib/auth";
import { EventoStatus } from "@/features/eventos/services/types";
import { getUserRole } from "@/features/auth/lib/getUserRole";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EventoPage({ params }: PageProps) {
  try {
    const resolvedParams = await params;
    //Se extrae el id de la URL recibida
    const id = extractID(resolvedParams.slug);
    console.log("Slug recibido:", resolvedParams.slug);
    console.log("ID extraído:", id);

    if (!id) {
      console.log("No se pudo extraer el ID del slug");
      return notFound();
    }

    // Obtener los datos del evento por su ID
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/eventos/${id}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    console.log("Status de la respuesta:", response.status);

    // Si la respuesta no es correcta, mostrar 404
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.log("Error de la API:", errorData);
      return notFound();
    }

    const evento = await response.json();
    console.log("Evento encontrado:", evento ? "Sí" : "No");

    // Si no se encuentra el evento, mostrar 404
    if (!evento) {
      console.log("No se encontró el evento en la respuesta");
      return notFound();
    }

    // Verificar permisos si el evento no está aprobado
    if (evento.status !== EventoStatus.APROBADO) {
      const session = await getServerSession(authOptions);
      const userRole = await getUserRole();

      // Si el usuario no está autenticado o es un usuario normal, no puede ver el evento
      if (!session || userRole === "usuario") {
        console.log("Usuario no autorizado para ver evento no aprobado");
        return notFound();
      }

      // Verificar si el usuario es el organizador o un administrador
      const isOrganizer =
        session.address?.toLowerCase() === evento.organizador.wallet.toLowerCase();
      const isAdmin = userRole === "admin";

      if (!isOrganizer && !isAdmin) {
        console.log("Usuario no es organizador ni admin");
        return notFound();
      }
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
