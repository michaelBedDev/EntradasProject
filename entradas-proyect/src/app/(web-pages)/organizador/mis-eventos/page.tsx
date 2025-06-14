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
import { slugify } from "@/utils/slugify";
import RequireOrganizer from "@/features/auth/components/RequireOrganizer";
import { useSessionData } from "@/features/auth/hooks/useSessionData";
import { useEventosOrganizador } from "@/features/eventos/hooks/useEventosOrganizador";

export default function MisEventosPage() {
  const { wallet } = useSessionData();
  const { eventos, isLoading, error } = useEventosOrganizador(wallet);

  // Función para obtener el color del badge según el estado
  const getBadgeVariant = (
    status: string | null,
  ): "default" | "secondary" | "destructive" | "outline" => {
    if (!status) return "outline";

    const statusMap: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      [EventoStatus.APROBADO]: "default",
      [EventoStatus.PENDIENTE]: "secondary",
      [EventoStatus.CANCELADO]: "destructive",
    };

    return statusMap[status] || "outline";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-muted-foreground">Cargando eventos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <RequireOrganizer>
      <div className="container mx-auto py-12 px-8 max-w-6xl space-y-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mis Eventos</h1>
          <Button asChild>
            <Link href="/organizador/crear-evento">
              <PlusCircleIcon className="mr-2 h-4 w-4" /> Crear Nuevo Evento
            </Link>
          </Button>
        </div>

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
                    <TableCell>
                      <Badge variant={getBadgeVariant(evento.status)}>
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
                          asChild
                          title="Ver evento">
                          <Link
                            href={`/eventos/${slugify(evento.titulo)}-${evento.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                          title="Editar evento">
                          <Link
                            href={`/organizador/mis-eventos/${evento.id}/editar`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive"
                          title="Eliminar evento">
                          <Trash2 className="h-4 w-4" />
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
    </RequireOrganizer>
  );
}
