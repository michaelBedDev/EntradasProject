import { EntradaCompletaPublica } from "@/types/global";
import { useState, useEffect } from "react";

export default function useFetchEntradas(wallet: string) {
  const [entradas, setEntradas] = useState<EntradaCompletaPublica[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntradas = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/entradas/user/${wallet}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Error fetching entradas: ${response.status}`);
        }

        const json = await response.json();
        setEntradas(json.data); // ✅ Aquí accedemos al campo "data"
      } catch (err) {
        console.error("Error fetching entradas:", err);
        console.error(
          "Error details:",
          err instanceof Error ? err.message : "Unknown error",
        );
        setEntradas([]);
      } finally {
        setLoading(false);
      }
    };

    if (wallet) fetchEntradas();
  }, [wallet]);

  return { entradas, loading, error };
}
