"use client";

import { useState, useEffect } from "react";

import { useSession } from "next-auth/react";
import { RolUsuario } from "@/types/rol-usuario";

export function useRolUsuario() {
  const [role, setRole] = useState<RolUsuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    // Función para verificar el rol del usuario
    const checkRolUsuario = async () => {
      if (!session) {
        console.log("No hay sesión disponible");
        setRole(null);
        setIsLoading(false);
        return;
      }

      if (!session.address) {
        console.log("No hay dirección de wallet en la sesión");
        setRole(RolUsuario.USUARIO);
        setIsLoading(false);
        return;
      }

      console.log("Verificando rol para wallet:", session.address);

      setRole((session.userRole as RolUsuario) || RolUsuario.USUARIO);
      setIsLoading(false);
    };

    checkRolUsuario();
  }, [session]);

  return { role, isLoading };
}
