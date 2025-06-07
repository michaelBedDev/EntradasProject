// app/user/explorar-eventos/page.tsx

import EventosList from "./EventosList";

interface Props {
  searchParams: Promise<{ query?: string }>;
}

export default async function EventosWrapper({ searchParams }: Props) {
  /* 1) Obtener parámetros de búsqueda */
  const params = await searchParams;
  const q = params.query?.trim() ?? "";

  /* 2) Fetch de eventos */
  let eventos = [];
  try {
    // Construir URL con el parámetro de búsqueda si existe
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    let apiUrl = `${baseUrl}/api/eventos`;

    // Añadir parámetro de búsqueda solo si hay texto
    if (q) {
      apiUrl += `?query=${encodeURIComponent(q)}`;
    }

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error fetching eventos: ${response.status}`);
    }

    const data = await response.json();
    eventos = data.eventos || [];
  } catch (error) {
    console.error("Error fetching eventos:", error);
    eventos = [];
  }

  /* 3) Renderizar componente cliente */
  return <EventosList eventos={eventos} query={q} />;
}
