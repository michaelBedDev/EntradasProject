"use client";
import { EventoPublico } from "@/types/global";
import { useEffect, useState } from "react";

interface UseFetchEventosProps {
  query?: string;
  categoria?: string;
}

export function useFetchEventos({
  query = "",
  categoria,
}: UseFetchEventosProps = {}) {
  const [eventos, setEventos] = useState<EventoPublico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (query) params.append("query", query);
        if (categoria) params.append("categoria", categoria);

        const url = `${process.env.NEXT_PUBLIC_API_URL}/eventos${
          params.toString() ? `?${params.toString()}` : ""
        }`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Error al obtener los eventos");
        }

        const data = await response.json();
        setEventos(data);
      } catch (err) {
        console.error("Error fetching eventos:", err);
        setError(err instanceof Error ? err : new Error("Error desconocido"));
        setEventos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, [query, categoria]);

  return { eventos, loading, error };
}
