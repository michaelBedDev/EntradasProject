export enum EventoStatus {
  PENDIENTE = "PENDIENTE",
  APROBADO = "APROBADO",
  RECHAZADO = "RECHAZADO",
  CANCELADO = "CANCELADO",
}

export interface EventoEstadisticas {
  totalEventos: number;
  eventosAprobados: number;
  eventosPendientes: number;
  eventosProximos: number;
}
