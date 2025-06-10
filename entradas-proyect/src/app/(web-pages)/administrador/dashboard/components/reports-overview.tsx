"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart2, TrendingUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const reportes = [
  {
    id: "1",
    titulo: "Reporte Mensual de Ventas",
    tipo: "ventas",
    fecha: "2024-03-01",
    estado: "completado",
    descripcion: "Análisis detallado de ventas del mes de marzo",
  },
  {
    id: "2",
    titulo: "Estadísticas de Eventos",
    tipo: "eventos",
    fecha: "2024-03-01",
    estado: "completado",
    descripcion: "Estadísticas de eventos creados y aprobados",
  },
  {
    id: "3",
    titulo: "Análisis de Usuarios",
    tipo: "usuarios",
    fecha: "2024-03-01",
    estado: "pendiente",
    descripcion: "Análisis de usuarios activos y nuevos registros",
  },
];

const metricas = [
  {
    titulo: "Ventas Totales",
    valor: "€45,231.89",
    cambio: "+20.1%",
    periodo: "vs mes anterior",
  },
  {
    titulo: "Entradas Vendidas",
    valor: "12,234",
    cambio: "+15%",
    periodo: "vs mes anterior",
  },
  {
    titulo: "Eventos Creados",
    valor: "156",
    cambio: "+8.2%",
    periodo: "vs mes anterior",
  },
  {
    titulo: "Usuarios Activos",
    valor: "573",
    cambio: "+12.3%",
    periodo: "vs mes anterior",
  },
];

export function ReportsOverview() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricas.map((metrica) => (
          <Card key={metrica.titulo}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metrica.titulo}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrica.valor}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{metrica.cambio}</span>{" "}
                {metrica.periodo}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="reportes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reportes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reportes
          </TabsTrigger>
          <TabsTrigger value="estadisticas" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Estadísticas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reportes">
          <Card>
            <CardHeader>
              <CardTitle>Reportes Disponibles</CardTitle>
              <CardDescription>
                Lista de reportes generados y disponibles para descarga
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportes.map((reporte) => (
                    <TableRow key={reporte.id}>
                      <TableCell className="font-medium">{reporte.titulo}</TableCell>
                      <TableCell className="capitalize">{reporte.tipo}</TableCell>
                      <TableCell>
                        {new Date(reporte.fecha).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            reporte.estado === "completado" ? "default" : "secondary"
                          }>
                          {reporte.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Descargar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estadisticas">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas Detalladas</CardTitle>
              <CardDescription>
                Análisis detallado de las métricas principales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportes.map((reporte) => (
                  <Card key={reporte.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{reporte.titulo}</CardTitle>
                      <CardDescription>{reporte.descripcion}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Descargar PDF
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
