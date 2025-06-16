"use client";

import { useSession } from "next-auth/react";

import { RolUsuario } from "@/types/enums";
import { LoadingSession } from "../session/LoadingSession";
import { NoSession } from "../session/NoSession";
import { WrongRoleAccess } from "../role/WrongRoleAccess";

type Props = {
  children: React.ReactNode;
};

export default function RequireOrganizer({ children }: Props) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <LoadingSession loadingText="Verificando permisos..." />;
  }

  if (!session) {
    return <NoSession noSessionText="Acceso Restringido" />;
  }

  if (session.userRole !== RolUsuario.ORGANIZADOR) {
    return <WrongRoleAccess requiredRoleName={RolUsuario.ORGANIZADOR} />;
  }

  return <>{children}</>;
}
