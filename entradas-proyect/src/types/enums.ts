export enum RolUsuario {
  USUARIO = "usuario",
  ADMINISTRADOR = "administrador",
  ORGANIZADOR = "organizador",
}

export enum Categorias {
  MUSICA = "Música",
  TEATRO = "Teatro",
  DEPORTES = "Deportes",
  GASTRONOMIA = "Gastronomía",
  ARTE = "Arte",
  CONFERENCIAS = "Conferencias",
  OTROS = "Otros",
}

// Constante para usar en los selects y otros componentes que necesiten id y label
export const CATEGORIAS_OPTIONS = Object.entries(Categorias).map(([id, label]) => ({
  id,
  label,
}));

export enum EstadoEntrada {
  ACTIVA = "ACTIVA",
  USADA = "USADA",
  CANCELADA = "CANCELADA",
  REEMBOLSADA = "REEMBOLSADA",
  PENDIENTE = "PENDIENTE",
}

// Constante para usar en los selects y otros componentes que necesiten id y label
export const ESTADO_ENTRADA_OPTIONS = Object.entries(EstadoEntrada).map(
  ([id, label]) => ({
    id,
    label,
  }),
);
