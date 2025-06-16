"use client";
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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircleIcon, Edit, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EventoStatus } from "@/features/eventos/services/types";
import RequireOrganizer from "@/features/auth/components/guards/RequireOrganizer";
import { useSessionData } from "@/features/auth/hooks/useSessionData";
import { useEventosOrganizador } from "@/features/eventos/hooks/useEventosOrganizador";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

import { deleteEvento } from "@/features/eventos/actions/deleteEvento";
import { MisEventosSkeleton } from "@/features/organizer/components/MisEventosSkeleton";
import { getBadgeVariant } from "@/lib/utils/getBadgeVariant";
import { showToastError, showToastSuccess } from "@/lib/utils/toast";
import { slugify } from "@/lib/utils/slugify";

export default function MisEventosPage() {
  const { wallet } = useSessionData();
  const { eventos, isLoading, error } = useEventosOrganizador(wallet);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedEventId, setDeletedEventId] = useState<string | null>(null);

  // Función para manejar la eliminación de un evento
  const handleDeleteEvento = async (eventoId: string) => {
    try {
      setIsDeleting(true);
      setDeletedEventId(eventoId);

      const result = await deleteEvento(eventoId);

      if (result.success) {
        showToastSuccess({
          title: "Evento eliminado",
          description: "El evento ha sido eliminado correctamente",
        });

        // Actualizar la lista localmente
        const updatedEventos = eventos.filter((evento) => evento.id !== eventoId);
        eventos.splice(0, eventos.length, ...updatedEventos);
      } else {
        showToastError({
          title: "Error al eliminar",
          description: result.error || "No se pudo eliminar el evento",
        });
      }
    } finally {
      setIsDeleting(false);
      setDeletedEventId(null);
    }
  };

  // Función para navegar al detalle del evento
  const handleViewEvento = (evento: { titulo: string; id: string }) => {
    const tituloSlug = slugify(evento.titulo);
    window.location.href = `/eventos/${tituloSlug}-${evento.id}`;
  };

  if (error) {
    return (
      <RequireOrganizer>
        <div className="container mx-auto py-12 px-8 max-w-7xl">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4 text-xl">{error}</div>
          </div>
        </div>
      </RequireOrganizer>
    );
  }

  return (
    <RequireOrganizer>
      <div className="container mx-auto py-12 px-8 max-w-7xl space-y-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mis Eventos</h1>
          <Button asChild>
            <Link href="/organizador/crear-evento">
              <PlusCircleIcon className="mr-2 h-4 w-4" /> Crear Nuevo Evento
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <MisEventosSkeleton />
        ) : eventos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 text-muted-foreground">
              No tienes eventos creados
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Listado de Eventos</CardTitle>
              <CardDescription>
                Gestiona todos los eventos que has creado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Lugar</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventos.map((evento) => (
                    <TableRow key={evento.id}>
                      <TableCell className="font-medium">{evento.titulo}</TableCell>
                      <TableCell>
                        {new Date(evento.fecha_inicio).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>{evento.lugar}</TableCell>
                      <TableCell>{evento.categoria}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getBadgeVariant(
                            evento.status || EventoStatus.PENDIENTE,
                          )}>
                          {evento.status === EventoStatus.APROBADO
                            ? "Aprobado"
                            : evento.status === EventoStatus.PENDIENTE
                            ? "Pendiente"
                            : "Cancelado"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleViewEvento(evento)}
                            title="Ver evento"
                            className="cursor-pointer">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            asChild
                            title="Editar evento"
                            className="cursor-pointer">
                            <Link
                              href={`/organizador/mis-eventos/${evento.id}/editar`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-destructive cursor-pointer"
                                title="Eliminar evento"
                                disabled={
                                  isDeleting && deletedEventId === evento.id
                                }>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Se eliminará
                                  permanentemente el evento &ldquo;{evento.titulo}
                                  &rdquo; y toda su información asociada.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteEvento(evento.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer">
                                  {isDeleting ? "Eliminando..." : "Eliminar"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </RequireOrganizer>
  );
}
