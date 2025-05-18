import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getEventById } from "@/app/actions/db/events";
import EventoDetalle from "./EventoDetalle";
import { Skeleton } from "@/components/ui/skeleton";

interface EventoPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventoPage({ params }: EventoPageProps) {
  // En Next.js 15, los params son una promesa que debe ser "awaited"
  const { slug } = await params;

  try {
    // Extraer el ID del UUID completo al final del slug
    // Formato esperado: nombre-evento-UUIDV4 (con guiones incluidos)
    // Buscamos un patrón que coincida con un UUID de Supabase (formato v4 con guiones)
    const uuidMatch = slug.match(
      /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i,
    );

    // Si no encontramos un UUID válido, usamos el slug completo (aunque probablemente fallará)
    const id = uuidMatch ? uuidMatch[0] : slug;

    // Obtener los datos del evento por su ID
    const evento = await getEventById(id);

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

function EventoDetalleSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Esqueleto del encabezado */}
      <div className="mb-12">
        <Skeleton className="h-16 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-2" />
        <div className="flex gap-2 mb-8">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      {/* Esqueleto de la imagen principal */}
      <div className="rounded-2xl overflow-hidden mb-12 aspect-[21/9]">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Esqueleto del contenido principal en dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-4 mb-8">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-2 mb-8">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </div>

        {/* Esqueleto del panel de compra */}
        <div>
          <div className="bg-card rounded-2xl p-6 border sticky top-24">
            <Skeleton className="h-8 w-32 mb-6" />
            <div className="space-y-4 mb-6">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
            <Skeleton className="h-12 w-full rounded-lg mb-3" />
            <Skeleton className="h-4 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
