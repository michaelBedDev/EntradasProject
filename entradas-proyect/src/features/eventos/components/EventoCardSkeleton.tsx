"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function EventoCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="group relative h-[450px] rounded-2xl overflow-hidden bg-card shadow-lg">
      {/* Imagen skeleton con efecto de pulso */}
      <div className="absolute inset-0 overflow-hidden">
        <Skeleton className="w-full h-full animate-pulse bg-gradient-to-br from-primary/10 to-secondary/10" />
      </div>

      {/* Overlay con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80" />

      {/* Fecha skeleton */}
      <div className="absolute top-6 left-6 z-20">
        <div className="bg-background/95 backdrop-blur-md rounded-xl overflow-hidden shadow-xl">
          <Skeleton className="h-8 w-24 bg-primary/20" />
          <Skeleton className="h-16 w-16 bg-background/80" />
        </div>
      </div>

      {/* Contenido principal skeleton */}
      <div className="absolute inset-x-0 bottom-0 p-8 space-y-4 z-20">
        {/* Título skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4 bg-white/20" />
          <Skeleton className="h-6 w-1/2 bg-white/20" />
        </div>

        {/* Organizador skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full bg-white/20" />
          <Skeleton className="h-4 w-32 bg-white/20" />
        </div>

        {/* Badges skeleton */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-24 rounded-full bg-white/20" />
          <Skeleton className="h-6 w-24 rounded-full bg-white/20" />
          <Skeleton className="h-6 w-32 rounded-full bg-white/20" />
        </div>

        {/* Botones skeleton */}
        <div className="flex justify-between items-center pt-4">
          <Skeleton className="h-9 w-24 rounded-lg bg-white/20" />
          <Skeleton className="h-9 w-28 rounded-lg bg-white/20" />
        </div>
      </div>
    </motion.div>
  );
}
