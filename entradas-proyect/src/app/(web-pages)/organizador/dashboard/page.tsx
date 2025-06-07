// import { getEventosByOrganizador } from "@/app/actions/db/events";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { CalendarIcon, Users, Ticket, PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EventoStatus } from "@/features/eventos/services/types";
// import { EventStatus } from "@/types/events.types";

export default async function OrganizerDashboardPage({
  eventos,
}: {
  eventos: Evento[];
}) {
  // Verificar que el usuario esté autenticado
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/eventos");
  }

  // Calcular estadísticas
  const totalEventos = eventos.length;
  const eventosAprobados = eventos.filter(
    (evento) => evento.status === EventoStatus.APROBADO,
  ).length;
  const eventosPendientes = eventos.filter(
    (evento) => evento.status === EventoStatus.PENDIENTE,
  ).length;

  // Próximos eventos (los primeros 5 con fecha futura)
  const today = new Date();
  const proximosEventos = eventos
    .filter((evento) => new Date(evento.fecha) >= today)
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .slice(0, 5);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Panel de Organizador</h1>
        <Button asChild>
          <Link href="/organizador/crear-evento">
            <PlusCircleIcon className="mr-2 h-4 w-4" /> Crear Nuevo Evento
          </Link>
        </Button>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEventos}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Eventos creados hasta la fecha
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Eventos Aprobados</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventosAprobados}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Eventos publicados y activos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventosPendientes}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Eventos en espera de aprobación
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Próximos eventos */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Eventos</CardTitle>
          <CardDescription>
            Tus eventos programados para las próximas fechas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {proximosEventos.length > 0 ? (
              proximosEventos.map((evento) => (
                <div
                  key={evento.id}
                  className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">{evento.titulo}</p>
                    <div className="flex gap-2 items-center text-sm text-muted-foreground">
                      <CalendarIcon className="h-3 w-3" />
                      <span>
                        {new Date(evento.fecha).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Button variant="outline" asChild size="sm">
                      <Link href={`/organizador/mis-eventos/${evento.id}`}>
                        Detalles
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-muted-foreground">
                No tienes eventos próximos programados.
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button variant="ghost" asChild className="w-full">
            <Link href="/organizador/mis-eventos">Ver todos mis eventos</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
