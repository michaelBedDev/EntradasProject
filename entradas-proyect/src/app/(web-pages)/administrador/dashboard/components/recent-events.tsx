"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventoStatus } from "@/features/eventos/services/types";

const eventos = [
  {
    id: "1",
    titulo: "Concierto de Rock",
    organizador: "Rock Productions",
    fecha: "2024-03-15",
    estado: EventoStatus.PENDIENTE,
  },
  {
    id: "2",
    titulo: "Festival de Cine",
    organizador: "Cine Club",
    fecha: "2024-04-20",
    estado: EventoStatus.APROBADO,
  },
  {
    id: "3",
    titulo: "Exposición de Arte",
    organizador: "Arte Moderno",
    fecha: "2024-03-10",
    estado: EventoStatus.CANCELADO,
  },
  {
    id: "4",
    titulo: "Conferencia Tech",
    organizador: "Tech Events",
    fecha: "2024-05-01",
    estado: EventoStatus.PENDIENTE,
  },
  {
    id: "5",
    titulo: "Feria Gastronómica",
    organizador: "Food Fest",
    fecha: "2024-04-05",
    estado: EventoStatus.APROBADO,
  },
];

const getBadgeVariant = (estado: string) => {
  switch (estado) {
    case EventoStatus.APROBADO:
      return "default";
    case EventoStatus.PENDIENTE:
      return "secondary";
    case EventoStatus.CANCELADO:
      return "destructive";
    default:
      return "outline";
  }
};

export function RecentEvents() {
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {eventos.map((evento) => (
          <div
            key={evento.id}
            className="flex items-center justify-between border-b pb-4 last:border-0">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{evento.titulo}</p>
              <p className="text-sm text-muted-foreground">{evento.organizador}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(evento.fecha).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <Badge variant={getBadgeVariant(evento.estado)}>{evento.estado}</Badge>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
