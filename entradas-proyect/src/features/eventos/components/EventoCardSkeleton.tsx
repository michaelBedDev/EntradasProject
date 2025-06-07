import { Skeleton } from "@/components/ui/skeleton";

export function EventoCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-lg relative h-[400px] bg-card">
      {/* Imagen skeleton con altura completa */}
      <Skeleton className="absolute inset-0 w-full h-full rounded-xl" />

      {/* Fecha skeleton */}
      <div className="absolute top-4 left-4 z-10">
        <Skeleton className="h-16 w-16 rounded-xl" />
      </div>

      {/* Overlay con efecto degradado para el contenido */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent rounded-xl">
        <div className="absolute inset-x-0 bottom-0 p-6 space-y-4">
          <Skeleton className="h-7 w-4/5 mb-2" />
          <Skeleton className="h-4 w-2/3 mb-3" />

          <div className="grid grid-cols-2 gap-2 mb-4">
            <Skeleton className="h-5 rounded-full" />
            <Skeleton className="h-5 rounded-full" />
          </div>

          <div className="flex justify-between">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
