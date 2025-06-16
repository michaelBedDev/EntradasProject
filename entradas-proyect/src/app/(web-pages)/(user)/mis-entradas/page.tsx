"use client";

import { Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import useFetchEntradas from "@/features/entradas/hooks/useFetchEntradas";

import { EntradaCard } from "@/components/shared/cards/EntradaCard";
import EntradaSkeleton from "@/components/shared/skeletons/EntradaSkeleton";

import { useSessionData } from "@/features/auth/hooks/useSessionData";
import RequireAuth from "@/features/auth/components/guards/RequireAuth";
import { handleDownload, handleShareEntrada, handleViewQR } from "@/lib/utils/index";

export default function MisEntradasPage() {
  const { wallet } = useSessionData();
  const { entradas, loading, error } = useFetchEntradas(wallet || "");

  // Mostrar estado de carga mientras se obtienen las entradas
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <EntradaSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Mostrar error si existe
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error al cargar entradas</h1>
          <p className="text-red-600 mb-6">
            Ha ocurrido un error al intentar cargar tus entradas. Por favor,
            inténtalo de nuevo más tarde.
          </p>
          <Button asChild>
            <a href="/eventos">Volver a eventos</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <RequireAuth noSessionText="Todavía no hay entradas">
      <div className="container mx-auto py-12 px-8 max-w-7xl">
        {/* Encabezado */}
        <div className="mb-12 mt-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Mis Entradas</h1>
          <p className="text-muted-foreground text-lg">
            Gestiona y visualiza todas tus entradas para eventos
          </p>
        </div>

        {/* Tabs para filtrar entradas */}
        <Tabs defaultValue="todas">
          <TabsList className="mb-6">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="disponibles">Disponibles</TabsTrigger>
            <TabsTrigger value="usadas">Usadas</TabsTrigger>
            <TabsTrigger value="expiradas">Expiradas</TabsTrigger>
          </TabsList>

          <TabsContent value="todas">
            {!loading && entradas.length === 0 ? (
              <div className="text-center py-16 border border-dashed rounded-xl bg-muted/20">
                <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No tienes entradas</h3>
                <p className="text-muted-foreground mb-6">
                  Parece que aún no has adquirido entradas para ningún evento
                </p>
                <Button asChild>
                  <a href="/eventos">Explorar eventos</a>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {entradas.map((entrada) => (
                  <EntradaCard
                    key={entrada.id}
                    entrada={entrada}
                    onShare={() => handleShareEntrada(entrada)}
                    onDownload={() => handleDownload(entrada)}
                    onViewQR={() => handleViewQR(entrada)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="disponibles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {!loading &&
                entradas
                  .filter((e) => e.estado === "ACTIVA")
                  .map((entrada) => (
                    <EntradaCard
                      key={entrada.id}
                      entrada={entrada}
                      onShare={() => handleShareEntrada(entrada)}
                      onDownload={() => handleDownload(entrada)}
                      onViewQR={() => handleViewQR(entrada)}
                    />
                  ))}
              {!loading &&
                entradas.filter((e) => e.estado === "ACTIVA").length === 0 && (
                  <div className="text-center py-8 col-span-2">
                    <p>No tienes entradas disponibles actualmente</p>
                  </div>
                )}
            </div>
          </TabsContent>

          <TabsContent value="usadas">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {!loading &&
                entradas
                  .filter((e) => e.estado === "USADA")
                  .map((entrada) => (
                    <EntradaCard
                      key={entrada.id}
                      entrada={entrada}
                      onShare={() => handleShareEntrada(entrada)}
                      onDownload={() => handleDownload(entrada)}
                      onViewQR={() => handleViewQR(entrada)}
                    />
                  ))}
              {!loading &&
                entradas.filter((e) => e.estado === "USADA").length === 0 && (
                  <div className="text-center py-8 col-span-2">
                    <p>No tienes entradas usadas</p>
                  </div>
                )}
            </div>
          </TabsContent>

          <TabsContent value="expiradas">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {!loading &&
                entradas
                  .filter((e) => e.estado === "CANCELADA")
                  .map((entrada) => (
                    <EntradaCard
                      key={entrada.id}
                      entrada={entrada}
                      onShare={() => handleShareEntrada(entrada)}
                      onDownload={() => handleDownload(entrada)}
                      onViewQR={() => handleViewQR(entrada)}
                    />
                  ))}
              {!loading &&
                entradas.filter((e) => e.estado === "CANCELADA").length === 0 && (
                  <div className="text-center py-8 col-span-2">
                    <p>No tienes entradas expiradas</p>
                  </div>
                )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </RequireAuth>
  );
}
