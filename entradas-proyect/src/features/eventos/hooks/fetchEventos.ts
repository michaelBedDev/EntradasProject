// hooks/useFetchEventos.ts
"use client";
import { EventoPublico } from "@/types/global";
import { useEffect, useState } from "react";

export function useFetchEventos(query: string) {
  const [eventos, setEventos] = useState<EventoPublico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventos = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/eventos${
          query ? `?busqueda=${encodeURIComponent(query)}` : ""
        }`;

        const response = await fetch(apiUrl, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`Error fetching eventos: ${response.status}`);
        }

        const data = await response.json();
        setEventos(data);
      } catch (error) {
        console.error("Error fetching eventos:", error);
        console.error("Error details:", error);
        setEventos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, [query]);

  return { eventos, loading, error };
}
