"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPin, Search, Filter } from "lucide-react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RequireAuth from "@/features/auth/components/RequireAuth";

const categorias = [
  "Todos",
  "Música",
  "Cine",
  "Arte",
  "Deportes",
  "Teatro",
  "Gastronomía",
  "Conferencias",
];

const eventosProximos = [
  {
    id: "4",
    titulo: "Conferencia Tech",
    fecha: "2024-05-01",
    ubicacion: "Centro de Convenciones",
    precio: "30.00",
    categoria: "Conferencias",
    imagen: "/eventos/tech.jpg",
  },
  {
    id: "5",
    titulo: "Festival de Música",
    fecha: "2024-04-25",
    ubicacion: "Parque Central",
    precio: "45.00",
    categoria: "Música",
    imagen: "/eventos/festival.jpg",
  },
  {
    id: "6",
    titulo: "Feria Gastronómica",
    fecha: "2024-04-05",
    ubicacion: "Plaza Mayor",
    precio: "20.00",
    categoria: "Gastronomía",
    imagen: "/eventos/gastronomia.jpg",
  },
];

export default function UserDashboardPage() {
  return (
    <RequireAuth>
      <div className="container mx-auto py-10 px-4 space-y-8">
        {/* Hero Section */}
        <div className="relative h-[400px] rounded-lg overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative h-full flex flex-col items-center justify-center text-white p-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Descubre los Mejores Eventos</h1>
            <p className="text-lg mb-8 max-w-2xl">
              Encuentra y compra entradas para los eventos más emocionantes de la
              ciudad
            </p>
            <div className="flex gap-4 w-full max-w-2xl">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar eventos..."
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
              <Select defaultValue="todos">
                <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria.toLowerCase()}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="bg-white text-purple-600 hover:bg-white/90">
                Buscar
              </Button>
            </div>
          </div>
        </div>

        {/* Eventos Destacados */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Eventos Destacados</h2>
            <Button variant="ghost" asChild>
              <Link href="/eventos">Ver todos</Link>
            </Button>
          </div>
        </section>

        {/* Próximos Eventos */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Próximos Eventos</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/eventos">Ver todos</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {eventosProximos.map((evento) => (
              <Card key={evento.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={evento.imagen}
                    alt={evento.titulo}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2">
                    {evento.categoria}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{evento.titulo}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {new Date(evento.fecha).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {evento.ubicacion}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Desde €{evento.precio}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="cursor-pointer">
                        <Link href={`/eventos/${evento.id}`}>Ver detalles</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Categorías Populares */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Explora por Categoría</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categorias.slice(1).map((categoria) => (
              <Card
                key={categoria}
                className="group cursor-pointer hover:border-primary transition-colors">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <h3 className="font-semibold text-lg mb-2">{categoria}</h3>
                  <p className="text-sm text-muted-foreground">
                    Descubre los mejores eventos de {categoria.toLowerCase()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </RequireAuth>
  );
}
