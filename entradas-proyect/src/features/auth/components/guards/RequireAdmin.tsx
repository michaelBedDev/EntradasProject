"use client";

import { useSession } from "next-auth/react";

import { RolUsuario } from "@/types/enums";
import { NoSession } from "../session/NoSession";
import { LoadingSession } from "../session/LoadingSession";
import { WrongRoleAccess } from "../role/WrongRoleAccess";

type Props = {
  children: React.ReactNode;
};

export default function RequireAdmin({ children }: Props) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <LoadingSession loadingText="Verificando permisos..." />;
  }

  if (!session) {
    return <NoSession noSessionText="Acceso Restringido" />;
  }

  if (session.userRole !== RolUsuario.ADMINISTRADOR) {
    return <WrongRoleAccess requiredRoleName={RolUsuario.ADMINISTRADOR} />;
  }

  return <>{children}</>;
}
