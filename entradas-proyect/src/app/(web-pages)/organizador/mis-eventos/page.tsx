import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
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
// import { EventStatus } from "@/types/events.types";
import { Badge } from "@/components/ui/badge";
import { EventoStatus } from "@/features/eventos/services/types";

export default async function MisEventosPage() {
  // Verificar que el usuario esté autenticado
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/eventos");
  }

  // // Verificar que el usuario sea organizador
  // if (session.userRole !== "ORGANIZADOR") {
  //   redirect("/eventos");
  // }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const wallet = session.address;

  let eventos: Evento[] = [];

  try {
    const response = await fetch(`${baseUrl}/eventos/organizador/${wallet}`);

    if (!response.ok) {
      if (response.status === 404) {
        return (
          <div className="container mx-auto py-10">
            <p className="text-center text-muted-foreground">
              Aún no has creado ningún evento
            </p>
            <Button asChild>
              <Link href="/organizador/crear-evento">
                <PlusCircleIcon className="mr-2 h-4 w-4" /> Crear mi primer evento
              </Link>
            </Button>
          </div>
        );
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    eventos = await response.json();
  } catch (error) {
    console.error("Error fetching eventos:", error);
  }

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

  return (
    <div className="container mx-auto py-10">
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
          {eventos.length > 0 ? (
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
                      {new Date(evento.fecha).toLocaleDateString("es-ES")}
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
                          <Link href={`/eventos/${evento.id}`}>
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
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Aún no has creado ningún evento
              </p>
              <Button asChild>
                <Link href="/organizador/crear-evento">
                  <PlusCircleIcon className="mr-2 h-4 w-4" /> Crear mi primer evento
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
