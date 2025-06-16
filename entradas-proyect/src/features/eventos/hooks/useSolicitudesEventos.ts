"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getSolicitudesEventos } from "@/app/actions/db/solicitudes_eventos";
import { EventoPublico } from "@/types/global";

interface UseSolicitudesEventosReturn {
  solicitudes: EventoPublico[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSolicitudesEventos(): UseSolicitudesEventosReturn {
  const [solicitudes, setSolicitudes] = useState<EventoPublico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchSolicitudes = useCallback(async () => {
    if (!session) {
      setError("No hay sesión activa");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Iniciando fetch de solicitudes...");
      setIsLoading(true);
      setError(null);

      const data = await getSolicitudesEventos();
      console.log("Datos recibidos en el hook:", data);
      setSolicitudes(data);
    } catch (err) {
      console.error("Error en el hook:", err);
      setError(
        err instanceof Error ? err.message : "Error al cargar las solicitudes",
      );
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  return {
    solicitudes,
    isLoading,
    error,
    refetch: fetchSolicitudes,
  };
}
