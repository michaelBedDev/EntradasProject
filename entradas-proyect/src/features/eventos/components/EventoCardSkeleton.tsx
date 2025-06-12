"use client";
import { Skeleton } from "@/components/ui/skeleton";

export function EventoCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl relative h-[400px]">
      {/* Imagen de fondo skeleton */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Overlay con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10">
        {/* Fecha destacada skeleton */}
        <div className="absolute top-4 left-4 shadow-lg">
          <Skeleton className="h-20 w-18 rounded-xl" />
        </div>

        {/* Contenido principal skeleton */}
        <div className="absolute inset-x-0 bottom-0 p-6 space-y-4">
          {/* Título y organizador skeleton */}
          <div>
            <Skeleton className="h-6 w-3/4 mb-1" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          {/* Badges skeleton */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-32" />
          </div>

          {/* Botones skeleton */}
          <div className="flex justify-between pt-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
