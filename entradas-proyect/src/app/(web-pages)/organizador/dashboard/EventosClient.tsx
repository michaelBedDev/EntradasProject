"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import {
  CalendarIcon,
  MapPin,
  Ticket,
  PlusCircleIcon,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EventoEstadisticas } from "@/features/eventos/services/types";
import { EventoPublicoWTipos } from "@/types/global";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Función para obtener el color del badge según el estado
const getBadgeVariant = (status: string) => {
  switch (status) {
    case "PENDIENTE":
      return "secondary";
    case "APROBADO":
      return "default";
    case "RECHAZADO":
      return "destructive";
    case "CANCELADO":
      return "outline";
    default:
      return "default";
  }
};

// Datos de ejemplo para las gráficas
const ventasPorMes = [
  { mes: "Ene", ventas: 1200 },
  { mes: "Feb", ventas: 1900 },
  { mes: "Mar", ventas: 1500 },
  { mes: "Abr", ventas: 2100 },
  { mes: "May", ventas: 1800 },
  { mes: "Jun", ventas: 2400 },
];

const eventosPorEstado = [
  { estado: "Pendiente", cantidad: 2 },
  { estado: "Aprobado", cantidad: 5 },
  { estado: "Rechazado", cantidad: 1 },
  { estado: "Cancelado", cantidad: 1 },
];

const ventasPorEntrada = [
  { nombre: "Entrada General", ventas: 45 },
  { nombre: "VIP", ventas: 20 },
  { nombre: "Early Bird", ventas: 35 },
  { nombre: "Grupo", ventas: 15 },
];

const tendenciaVentas = [
  { fecha: "01/01", ventas: 400 },
  { fecha: "02/01", ventas: 300 },
  { fecha: "03/01", ventas: 600 },
  { fecha: "04/01", ventas: 800 },
  { fecha: "05/01", ventas: 500 },
  { fecha: "06/01", ventas: 700 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Función para convertir el título en slug
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export default function EventosClient({
  eventos,
  estadisticas,
}: {
  eventos: EventoPublicoWTipos[];
  estadisticas: EventoEstadisticas;
}) {
  const session = useSession();

  if (!session) {
    redirect("/eventos");
  }

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

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="eventos">Mis Eventos</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Estadísticas Generales */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estadisticas.totalEventos}</div>
                <p className="text-xs text-muted-foreground">
                  {estadisticas.eventosAprobados} aprobados
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Eventos Pendientes
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {estadisticas.eventosPendientes}
                </div>
                <p className="text-xs text-muted-foreground">
                  En espera de aprobación
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Entradas Vendidas
                </CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {eventos.reduce(
                    (acc, evento) =>
                      acc +
                      evento.tipos_entrada.reduce(
                        (total, tipo) => total + (tipo.cantidad_disponible || 0),
                        0,
                      ),
                    0,
                  )}
                </div>
                <p className="text-xs text-muted-foreground">En todos los eventos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ingresos Totales
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€12,234</div>
                <p className="text-xs text-muted-foreground">
                  +15.3% desde el mes pasado
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Tendencia de Ventas</CardTitle>
                <CardDescription>
                  Evolución de las ventas en los últimos meses
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={tendenciaVentas}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="ventas"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Estado de Eventos</CardTitle>
                <CardDescription>Distribución de eventos por estado</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={eventosPorEstado}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="cantidad">
                      {eventosPorEstado.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="eventos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Todos mis eventos</CardTitle>
              <CardDescription>Lista completa de eventos creados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {eventos.map((evento) => (
                  <Card key={evento.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{evento.titulo}</CardTitle>
                        <Badge
                          variant={getBadgeVariant(evento.status || "PENDIENTE")}
                          className="capitalize">
                          {evento.status || "PENDIENTE"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarIcon className="h-4 w-4" />
                          {new Date(evento.fecha_inicio).toLocaleDateString(
                            "es-ES",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {evento.lugar}
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Entradas vendidas</span>
                            <span>
                              {evento.tipos_entrada.reduce(
                                (total, tipo) =>
                                  total + (tipo.cantidad_disponible || 0),
                                0,
                              )}{" "}
                              /{" "}
                              {evento.tipos_entrada.reduce(
                                (total, tipo) => total + tipo.cantidad_disponible,
                                0,
                              )}
                            </span>
                          </div>
                          <Progress
                            value={
                              (evento.tipos_entrada.reduce(
                                (total, tipo) =>
                                  total + (tipo.cantidad_disponible || 0),
                                0,
                              ) /
                                evento.tipos_entrada.reduce(
                                  (total, tipo) => total + tipo.cantidad_disponible,
                                  0,
                                )) *
                              100
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const tituloSlug = slugify(evento.titulo);
                          window.location.href = `/eventos/${tituloSlug}-${evento.id}`;
                        }}>
                        Ver detalles
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/organizador/mis-eventos/${evento.id}/editar`}>
                          Editar
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estadisticas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas Generales</CardTitle>
              <CardDescription>
                Resumen de la actividad de tus eventos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Ventas por Mes</CardTitle>
                    <CardDescription>
                      Distribución de ventas en los últimos meses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={ventasPorMes}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="ventas" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Distribución de Ventas por Tipo de Entrada</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ventasPorEntrada}>
                          <XAxis
                            dataKey="nombre"
                            tick={{ fontSize: 12 }}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="ventas" fill="hsl(var(--primary))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
