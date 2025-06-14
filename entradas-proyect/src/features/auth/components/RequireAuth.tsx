// components/auth/RequireAuth.tsx
"use client";

import { useSession } from "next-auth/react";

type Props = {
  children: React.ReactNode;
  noSessionText?: string;
};

export default function RequireAuth({
  children,
  noSessionText = "Acceso Restringido",
}: Props) {
  const { data: session, status } = useSession();

  // Estado de carga
  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-24 max-w-7xl w-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cargando sesión...</h1>
        </div>
      </div>
    );
  }

  // No hay sesión
  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl text-center">
        <h1 className="text-2xl font-bold mb-4">{noSessionText} </h1>
        <p className="text-muted-foreground mb-6">
          ¿Seguro que has iniciado sesión?
        </p>
        <div className="flex justify-center">
          <appkit-button />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
