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
import { CheckCircle, XCircle } from "lucide-react";

import { useSolicitudesEventos } from "@/features/eventos/hooks/useSolicitudesEventos";
import { Skeleton } from "@/components/ui/skeleton";
import { actualizarEstadoEvento } from "@/app/actions/db/solicitudes_eventos";
import { EventoStatus } from "@/features/eventos/services/types";
import { useState } from "react";
import { showToastError, showToastSuccess } from "@/lib/utils/index";
import RequireAdmin from "@/features/auth/components/guards/RequireAdmin";

export default function SolicitudesPage() {
  const { solicitudes, isLoading, error, refetch } = useSolicitudesEventos();
  const [procesandoId, setProcesandoId] = useState<string | null>(null);

  const handleActualizarEstado = async (
    eventoId: string,
    nuevoEstado: EventoStatus,
  ) => {
    try {
      setProcesandoId(eventoId);
      await actualizarEstadoEvento(eventoId, nuevoEstado);
      showToastSuccess({
        title:
          nuevoEstado === EventoStatus.APROBADO
            ? "Evento aprobado correctamente"
            : "Evento rechazado correctamente",
      });
      refetch();
    } catch (error) {
      showToastError({
        title: "Error al actualizar el estado",
        description:
          error instanceof Error
            ? error.message
            : "Error al actualizar el estado del evento",
      });
    } finally {
      setProcesandoId(null);
    }
  };

  if (error) {
    return (
      <RequireAdmin>
        <div className="container mx-auto py-12 px-8 max-w-7xl">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4 text-xl">{error}</div>
          </div>
        </div>
      </RequireAdmin>
    );
  }

  return (
    <RequireAdmin>
      <div className="container mx-auto py-12 px-8 max-w-7xl">
        <div className="mb-12 mt-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Solicitudes de Eventos
          </h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes Pendientes</CardTitle>
            <CardDescription>
              Gestiona las solicitudes de eventos pendientes de aprobación
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Evento</TableHead>
                    <TableHead>Organizador</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: Math.max(solicitudes.length || 2, 2) }).map(
                    (_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-28" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            ) : solicitudes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay solicitudes pendientes
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Evento</TableHead>
                    <TableHead>Organizador</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {solicitudes.map((solicitud) => (
                    <TableRow key={solicitud.id}>
                      <TableCell className="font-medium">
                        {solicitud.titulo}
                      </TableCell>
                      <TableCell>
                        {solicitud.organizador.nombre || "Sin nombre"}
                      </TableCell>
                      <TableCell>
                        {new Date(solicitud.fecha_inicio).toLocaleDateString(
                          "es-ES",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </TableCell>
                      <TableCell>{solicitud.lugar}</TableCell>
                      <TableCell>{solicitud.categoria}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{solicitud.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-green-600 hover:bg-green-50 cursor-pointer"
                            onClick={() =>
                              handleActualizarEstado(
                                solicitud.id,
                                EventoStatus.APROBADO,
                              )
                            }
                            disabled={procesandoId === solicitud.id}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:bg-red-50 cursor-pointer"
                            onClick={() =>
                              handleActualizarEstado(
                                solicitud.id,
                                EventoStatus.RECHAZADO,
                              )
                            }
                            disabled={procesandoId === solicitud.id}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </RequireAdmin>
  );
}
