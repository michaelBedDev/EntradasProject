"use client";

import { useSession } from "next-auth/react";
import { LoadingSession } from "../session/LoadingSession";
import { NoSession } from "../session/NoSession";

type RequireAuthProps = {
  children: React.ReactNode;
  noSessionText?: string;
};

export default function RequireAuth({ children }: RequireAuthProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <LoadingSession loadingText="Cargando sesión..." />;
  }

  if (!session) {
    return <NoSession noSessionText="Acceso Restringido" />;
  }

  return <>{children}</>;
}
