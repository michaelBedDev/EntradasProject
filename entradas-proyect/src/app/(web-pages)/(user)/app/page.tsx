"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPin, Search, Filter } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Categorias } from "@/types/enums";
import { getEventosProximos } from "@/features/eventos/actions/getEventos";
import type { EventoPublico } from "@/types/global";

// Constante para usar en los selects y otros componentes que necesiten id y label
const CATEGORIAS_OPTIONS = Object.entries(Categorias).map(([id, label]) => ({
  id,
  label,
}));

export default function UserDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [eventos, setEventos] = useState<EventoPublico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const [selectedCategoria, setSelectedCategoria] = useState(
    searchParams.get("categoria") || "todos",
  );

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchEventos = useCallback(async () => {
    try {
      setIsLoading(true);
      const eventos = await getEventosProximos(
        selectedCategoria !== "todos" ? selectedCategoria : undefined,
        debouncedSearchTerm || undefined,
      );
      setEventos(eventos);
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategoria, debouncedSearchTerm]);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearchTerm) {
      params.set("query", debouncedSearchTerm);
    } else {
      params.delete("query");
    }
    if (selectedCategoria !== "todos") {
      params.set("categoria", selectedCategoria);
    } else {
      params.delete("categoria");
    }
    router.push(`/app?${params.toString()}`);
  }, [debouncedSearchTerm, selectedCategoria, router, searchParams]);

  const handleCategoriaClick = (categoria: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("categoria", categoria.toUpperCase());
    if (searchTerm) {
      params.set("query", searchTerm);
    }
    router.push(`/eventos?${params.toString()}`);
  };

  return (
    <div className="container mx-auto py-12 px-8 space-y-8 max-w-7xl">
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Select
              value={selectedCategoria}
              onValueChange={(value) => {
                setSelectedCategoria(value);
                handleSearch();
              }}>
              <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {CATEGORIAS_OPTIONS.map(({ id, label }) => (
                  <SelectItem key={id} value={id}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="bg-white text-purple-600 hover:bg-white/90" asChild>
              <Link
                href={`/eventos?${new URLSearchParams({
                  ...(debouncedSearchTerm && { query: debouncedSearchTerm }),
                  ...(selectedCategoria !== "todos" && {
                    categoria: selectedCategoria,
                  }),
                }).toString()}`}>
                Buscar
              </Link>
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
          {isLoading ? (
            // Placeholder cards while loading
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden p-0">
                <div className="w-full aspect-square bg-muted animate-pulse" />
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="h-6 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
                      <div className="h-8 bg-muted rounded w-24 animate-pulse" />
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : eventos.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-muted-foreground">
                No se encontraron eventos que coincidan con tu búsqueda
              </p>
            </div>
          ) : (
            eventos.map((evento) => (
              <Card key={evento.id} className="overflow-hidden p-0">
                <div className="w-full aspect-square relative bg-muted">
                  <img
                    src={evento.imagen_uri || "/placeholder-event.jpg"}
                    alt={evento.titulo}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <Badge className="absolute top-6 right-6 z-10">
                    {evento.categoria || "Sin categoría"}
                  </Badge>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg line-clamp-1">
                      {evento.titulo}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {new Date(evento.fecha_inicio).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {evento.lugar}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">
                        Organizado por {evento.organizador.nombre || "Anónimo"}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="cursor-pointer">
                        <Link href={`/eventos/${evento.id}`}>Ver detalles</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Categorías Populares */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Explora por Categoría</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIAS_OPTIONS.map(({ id, label }) => (
            <Card
              key={id}
              className="group cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleCategoriaClick(id)}>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <h3 className="font-semibold text-lg mb-2">{label}</h3>
                <p className="text-sm text-muted-foreground">
                  Descubre los mejores eventos de {label.toLowerCase()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
