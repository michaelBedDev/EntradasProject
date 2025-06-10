"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const data = {
  ventas: [
    { fecha: "2024-01", ventas: 4000, entradas: 2400 },
    { fecha: "2024-02", ventas: 3000, entradas: 1398 },
    { fecha: "2024-03", ventas: 2000, entradas: 9800 },
    { fecha: "2024-04", ventas: 2780, entradas: 3908 },
    { fecha: "2024-05", ventas: 1890, entradas: 4800 },
    { fecha: "2024-06", ventas: 2390, entradas: 3800 },
  ],
  eventos: [
    { fecha: "2024-01", creados: 40, aprobados: 30 },
    { fecha: "2024-02", creados: 30, aprobados: 25 },
    { fecha: "2024-03", creados: 20, aprobados: 15 },
    { fecha: "2024-04", creados: 27, aprobados: 20 },
    { fecha: "2024-05", creados: 18, aprobados: 15 },
    { fecha: "2024-06", creados: 23, aprobados: 18 },
  ],
  usuarios: [
    { fecha: "2024-01", nuevos: 100, activos: 80 },
    { fecha: "2024-02", nuevos: 80, activos: 70 },
    { fecha: "2024-03", nuevos: 60, activos: 50 },
    { fecha: "2024-04", nuevos: 70, activos: 60 },
    { fecha: "2024-05", nuevos: 50, activos: 45 },
    { fecha: "2024-06", nuevos: 65, activos: 55 },
  ],
};

const periodos = [
  { value: "7d", label: "Últimos 7 días" },
  { value: "30d", label: "Últimos 30 días" },
  { value: "90d", label: "Últimos 90 días" },
  { value: "1y", label: "Último año" },
];

export function AnalyticsOverview() {
  const [periodo, setPeriodo] = useState("30d");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Análisis Detallado</h3>
        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccionar período" />
          </SelectTrigger>
          <SelectContent>
            {periodos.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="ventas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ventas">Ventas</TabsTrigger>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
        </TabsList>

        <TabsContent value="ventas">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Ventas</CardTitle>
              <CardDescription>
                Tendencias de ventas y entradas vendidas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.ventas}>
                    <XAxis dataKey="fecha" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="ventas"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="entradas"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eventos">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Eventos</CardTitle>
              <CardDescription>
                Tendencias de eventos creados y aprobados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.eventos}>
                    <XAxis dataKey="fecha" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="creados"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="aprobados"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usuarios">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Usuarios</CardTitle>
              <CardDescription>
                Tendencias de usuarios nuevos y activos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.usuarios}>
                    <XAxis dataKey="fecha" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="nuevos"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="activos"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
