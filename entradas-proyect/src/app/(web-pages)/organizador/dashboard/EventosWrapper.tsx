"use server";

import { getSessionData } from "@/features/auth/lib/getSessionData";
import EventosClient from "./EventosClient";
import { EventoEstadisticas, EventoStatus } from "@/features/eventos/services/types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

function calcularEstadisticas(eventosList: Evento[]): EventoEstadisticas {
  // Calcular estadísticas
  const totalEventos = eventosList.length;
  const eventosAprobados = eventosList.filter(
    (evento) => evento.status === EventoStatus.APROBADO,
  ).length;
  const eventosPendientes = eventosList.filter(
    (evento) => evento.status === EventoStatus.PENDIENTE,
  ).length;
  // Próximos eventos (los primeros 5 con fecha futura)
  const today = new Date();
  const proximosEventos = eventosList
    .filter((evento) => new Date(evento.fecha) >= today)
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .slice(0, 5);

  console.log("[DEBUG] Estadísticas calculadas:", {
    totalEventos,
    eventosAprobados,
    eventosPendientes,
    proximosEventos,
  });
  return {
    totalEventos,
    eventosAprobados,
    eventosPendientes,
    proximosEventos,
  };
}

export default async function EventosWrapper() {
  let eventosList: Evento[] = [];

  try {
    const sessionData = await getSessionData();

    if (!sessionData) {
      return <p>Debes iniciar sesión para ver los eventos. ¿Eres un organizador?</p>;
    }

    const wallet = sessionData.address;

    const response = await fetch(`${baseUrl}/eventos/organizador/${wallet}`);

    if (!response.ok) {
      if (response.status === 404) {
        return <p>No tienes eventos creados aún.</p>;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    eventosList = await response.json();

    console.log("Eventos obtenidos:", eventosList);

    if (!eventosList || eventosList.length === 0) {
      return <p>No tienes eventos creados aún</p>;
    }
  } catch (error) {
    console.error("Error fetching eventos:", error);
    return <p>Error al cargar los eventos. Inténtalo de nuevo.</p>;
  }

  const estadisticas = calcularEstadisticas(eventosList);

  return <EventosClient eventos={eventosList} estadisticas={estadisticas} />;
}
