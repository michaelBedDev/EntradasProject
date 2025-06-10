"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, SearchIcon, XIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

const categorias = [
  "Música",
  "Deportes",
  "Arte",
  "Teatro",
  "Gastronomía",
  "Conferencias",
  "Otros",
];

const estados = [
  { value: "todos", label: "Todos los eventos" },
  { value: "proximos", label: "Próximos" },
  { value: "pasados", label: "Pasados" },
];

export function EventosFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [fechaInicio, setFechaInicio] = useState<Date | undefined>(
    searchParams.get("fecha_inicio")
      ? new Date(searchParams.get("fecha_inicio")!)
      : undefined,
  );
  const [fechaFin, setFechaFin] = useState<Date | undefined>(
    searchParams.get("fecha_fin")
      ? new Date(searchParams.get("fecha_fin")!)
      : undefined,
  );

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "todos") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/eventos?${params.toString()}`);
  };

  const handleDateChange = (date: Date | undefined, type: "inicio" | "fin") => {
    const params = new URLSearchParams(searchParams.toString());
    if (date) {
      params.set(
        type === "inicio" ? "fecha_inicio" : "fecha_fin",
        date.toISOString().split("T")[0],
      );
    } else {
      params.delete(type === "inicio" ? "fecha_inicio" : "fecha_fin");
    }
    router.push(`/eventos?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("busqueda", value);
    } else {
      params.delete("busqueda");
    }
    router.push(`/eventos?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/eventos");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Búsqueda */}
        <div className="flex-1">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar eventos..."
              className="pl-9"
              defaultValue={searchParams.get("busqueda") ?? ""}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Estado */}
        <Select
          defaultValue={searchParams.get("status") ?? "todos"}
          onValueChange={(value) => handleFilterChange("status", value)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            {estados.map((estado) => (
              <SelectItem key={estado.value} value={estado.value}>
                {estado.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Categoría */}
        <Select
          defaultValue={searchParams.get("categoria") ?? ""}
          onValueChange={(value) => handleFilterChange("categoria", value)}>
          <SelectTrigger className="w-full sm:w-[200px]">
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
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Fecha inicio */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-[200px] justify-start text-left font-normal",
                !fechaInicio && "text-muted-foreground",
              )}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fechaInicio ? (
                format(fechaInicio, "PPP", { locale: es })
              ) : (
                <span>Fecha inicio</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fechaInicio}
              onSelect={(date) => {
                setFechaInicio(date);
                handleDateChange(date, "inicio");
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Fecha fin */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-[200px] justify-start text-left font-normal",
                !fechaFin && "text-muted-foreground",
              )}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fechaFin ? (
                format(fechaFin, "PPP", { locale: es })
              ) : (
                <span>Fecha fin</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fechaFin}
              onSelect={(date) => {
                setFechaFin(date);
                handleDateChange(date, "fin");
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Limpiar filtros */}
        {(searchParams.has("status") ||
          searchParams.has("categoria") ||
          searchParams.has("fecha_inicio") ||
          searchParams.has("fecha_fin") ||
          searchParams.has("busqueda")) && (
          <Button
            variant="ghost"
            size="icon"
            className="w-full sm:w-auto"
            onClick={clearFilters}>
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Limpiar filtros</span>
          </Button>
        )}
      </div>
    </div>
  );
}
