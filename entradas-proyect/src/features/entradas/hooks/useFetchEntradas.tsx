import { EntradaCompletaPublica } from "@/types/global";
import { useState, useEffect } from "react";

export default function useFetchEntradas(wallet: string) {
  const [entradas, setEntradas] = useState<EntradaCompletaPublica[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const fetchEntradas = async () => {
      if (!isInitialLoad) {
        setLoading(true);
      }
      setError(null);

      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/entradas/user/${wallet}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Error fetching entradas: ${response.status}`);
        }

        const json = await response.json();
        setEntradas(json.data);
      } catch (err) {
        console.error("Error fetching entradas:", err);
        console.error(
          "Error details:",
          err instanceof Error ? err.message : "Unknown error",
        );
        setEntradas([]);
        setError(
          err instanceof Error ? err.message : "Error al cargar las entradas",
        );
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };

    if (wallet) fetchEntradas();
  }, [wallet]);

  return {
    entradas,
    loading: isInitialLoad ? false : loading,
    error,
  };
}
