import { useState, useEffect } from "react";
import { EventoPublicoWTipos } from "@/types/global";

interface UseEventosOrganizadorReturn {
  eventos: EventoPublicoWTipos[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEventosOrganizador(
  wallet: string | null | undefined,
): UseEventosOrganizadorReturn {
  const [eventos, setEventos] = useState<EventoPublicoWTipos[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchEventos = async () => {
    if (!wallet) {
      setEventos([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/eventos/organizador/${wallet}`,
      );

      if (!response.ok) {
        if (response.status === 404) {
          setEventos([]);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEventos(data);
    } catch (error) {
      console.error("Error fetching eventos:", error);
      setError(
        error instanceof Error ? error.message : "Error al cargar los eventos",
      );
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    if (!isInitialLoad) {
      setIsLoading(true);
    }
    fetchEventos();
  }, [wallet]);

  return {
    eventos,
    isLoading: isInitialLoad ? false : isLoading,
    error,
    refetch: fetchEventos,
  };
}
