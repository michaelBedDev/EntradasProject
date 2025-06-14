"use client";
import { Skeleton } from "@/components/ui/skeleton";

export function EventoCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl bg-muted/50 h-[400px] relative">
      <Skeleton className="absolute top-4 left-4 h-[80px] w-[68px] rounded-xl bg-muted" />

      <div className="h-full flex flex-col justify-end p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full bg-muted" />
          <Skeleton className="h-4 w-32 bg-muted" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4 bg-muted" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full bg-muted" />
            <Skeleton className="h-4 w-24 bg-muted" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-20 bg-muted" />
          <Skeleton className="h-5 w-32 bg-muted" />
        </div>

        <div className="flex justify-between pt-2">
          <Skeleton className="h-9 w-24 bg-muted" />
          <Skeleton className="h-9 w-24 bg-muted" />
        </div>
      </div>
    </div>
  );
}
