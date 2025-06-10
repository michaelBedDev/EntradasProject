"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EventoStatus } from "@/features/eventos/services/types";
import { CheckCircle, XCircle } from "lucide-react";

// Datos de ejemplo
const solicitudes = [
  {
    id: "1",
    titulo: "Concierto de Rock",
    organizador: "Rock Productions",
    fecha: "2024-03-15",
    estado: EventoStatus.PENDIENTE,
    descripcion: "Gran concierto de rock con bandas locales",
    ubicacion: "Sala Principal",
    capacidad: 500,
  },
  {
    id: "2",
    titulo: "Festival de Cine",
    organizador: "Cine Club",
    fecha: "2024-04-20",
    estado: EventoStatus.PENDIENTE,
    descripcion: "Festival de cine independiente",
    ubicacion: "Centro Cultural",
    capacidad: 200,
  },
  {
    id: "3",
    titulo: "Exposición de Arte",
    organizador: "Arte Moderno",
    fecha: "2024-03-10",
    estado: EventoStatus.PENDIENTE,
    descripcion: "Exposición de arte contemporáneo",
    ubicacion: "Galería Central",
    capacidad: 100,
  },
];

export default function SolicitudesPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Solicitudes de Eventos</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Pendientes</CardTitle>
          <CardDescription>
            Gestiona las solicitudes de eventos pendientes de aprobación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead>Organizador</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {solicitudes.map((solicitud) => (
                <TableRow key={solicitud.id}>
                  <TableCell className="font-medium">{solicitud.titulo}</TableCell>
                  <TableCell>{solicitud.organizador}</TableCell>
                  <TableCell>
                    {new Date(solicitud.fecha).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{solicitud.ubicacion}</TableCell>
                  <TableCell>{solicitud.capacidad}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{solicitud.estado}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-red-600">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
