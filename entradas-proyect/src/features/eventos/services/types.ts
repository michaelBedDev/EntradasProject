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

export interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  fechaCreacion: string;
  ubicacion: string;
  estado: EventoStatus;
  entradasVendidas: number;
  entradasTotales: number;
  imagen_uri: string;
  organizador_id: string;
  created_at?: string | null;
  fecha_fin?: string;
  fecha_inicio?: string;
  lugar?: string;
  status?: string | null;
}
