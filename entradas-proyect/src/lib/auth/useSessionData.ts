"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { RolUsuario } from "@/types/rol-usuario";

export function useSessionData() {
  const [role, setRole] = useState<RolUsuario | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    // Función para verificar el rol del usuario
    const checkRolUsuario = async () => {
      console.log(
        `[DEBUG] Verificando rol del usuario... Session: ${JSON.stringify(session)}`,
      );

      if (!session || !session.address) {
        setRole(null);

        return;
      }
      setRole((session.userRole as RolUsuario) || RolUsuario.USUARIO);

      setWallet(session.address);
    };

    checkRolUsuario();
  }, [session]);

  return { role, wallet };
}
