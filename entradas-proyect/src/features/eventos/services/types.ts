export enum EventoStatus {
  PENDIENTE = "pendiente",
  APROBADO = "aprobado",
  CANCELADO = "cancelado",
}

export type EventoEstadisticas = {
  totalEventos: number;
  eventosAprobados: number;
  eventosPendientes: number;
  proximosEventos: Evento[];
};
