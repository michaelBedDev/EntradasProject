"use server";

export default async function EventosWrapper() {
  return <div>En construcción...</div>;
}

// import { getSessionData } from "@/features/auth/lib/getSessionData";
// import EventosClient from "./EventosClient";
// import { EventoEstadisticas, EventoStatus } from "@/features/eventos/services/types";

// const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// // Define the Evento interface to match expected structure
// interface Evento {
//   id: string;
//   titulo: string;
//   descripcion: string | null;
//   fecha_inicio: Date;
//   fecha_fin: Date | null;
//   lugar: string;
//   status: EventoStatus;
//   imagen_uri: string | null;
//   created_at: string | null;
//   organizador_id: string | null;
// }

// function calcularEstadisticas(eventosList: Evento[]): EventoEstadisticas {
//   // Calcular estadísticas
//   const totalEventos = eventosList.length;
//   const eventosAprobados = eventosList.filter(
//     (evento) => evento.status === EventoStatus.APROBADO,
//   ).length;
//   const eventosPendientes = eventosList.filter(
//     (evento) => evento.status === EventoStatus.PENDIENTE,
//   ).length;
//   // Próximos eventos (los primeros 5 con fecha futura)
//   const today = new Date();
//   const eventosProximosList = eventosList
//     .filter((evento) => new Date(evento.fecha_inicio) >= today)
//     .sort(
//       (a, b) =>
//         new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime(),
//     )
//     .slice(0, 5);
//   const eventosProximos = eventosProximosList.length;
//   console.log("[DEBUG] Estadísticas calculadas:", {
//     totalEventos,
//     eventosAprobados,
//     eventosPendientes,
//     eventosProximos,
//   });
//   return {
//     totalEventos,
//     eventosAprobados,
//     eventosPendientes,
//     eventosProximos,
//   };
// }

// export default async function EventosWrapper() {
//   let eventosList: Evento[] = [];

//   try {
//     const sessionData = await getSessionData();

//     if (!sessionData) {
//       return <p>Debes iniciar sesión para ver los eventos. ¿Eres un organizador?</p>;
//     }

//     const wallet = sessionData.address;

//     const response = await fetch(`${baseUrl}/eventos/organizador/${wallet}`);

//     eventosList = apiEventos.map((evento: any): Evento => ({
//       ...evento,
//       fecha_inicio: new Date(evento.fecha_inicio),
//       fecha_fin: evento.fecha_fin ? new Date(evento.fecha_fin) : null,
//     }));
//     }
//     const apiEventos = await response.json();

//     console.log("Eventos obtenidos:", apiEventos);

//     if (!apiEventos || apiEventos.length === 0) {
//       return <p>No tienes eventos creados aún</p>;
//     }

//     eventosList = apiEventos.map((evento: Evento[]) => ({
//       ...evento,
//       fecha_inicio: new Date(evento.fecha_inicio),
//       fecha_fin: evento.fecha_fin ? new Date(evento.fecha_fin) : null,
//     }));
//   } catch (error) {
//     console.error("Error fetching eventos:", error);
//     return <p>Error al cargar los eventos. Inténtalo de nuevo.</p>;
//   }

//   const estadisticas = calcularEstadisticas(eventosList);

//   return <EventosClient eventos={eventosList} estadisticas={estadisticas} />;
// }
