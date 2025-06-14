// components/auth/RequireAdmin.tsx
"use client";

import { useSession } from "next-auth/react";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  children: React.ReactNode;
};

export default function RequireAdmin({ children }: Props) {
  const { data: session, status } = useSession();

  // Estado de carga
  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl text-center">
        <p>Verificando permisos...</p>
      </div>
    );
  }

  // No hay sesión
  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl text-center">
        <h1 className="text-2xl font-bold mb-4">Acceso Restringido</h1>
        <p className="text-muted-foreground mb-6">
          ¿Seguro que has iniciado sesión?
        </p>
        <div className="flex justify-center">
          <appkit-button />
        </div>
      </div>
    );
  }

  // No es admin
  if (session.userRole !== "admin") {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl text-center">
        <h1 className="text-2xl font-bold mb-4">Acceso restringido</h1>
        <p className="text-muted-foreground mb-6">
          ¿Eres un administrador? Este panel es solo para administradores.
        </p>
        <div className="flex justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/app">
              <HomeIcon className="h-5 w-5" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
