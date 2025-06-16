"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { RolUsuario } from "@/types/enums";
import { SupabaseJwt } from "@/types/global";

/**
 * Hook para obtener los datos de la sesión del usuario.
 * Incluye el rol, la wallet, la fecha de expiración y el token de Supabase.
 *
 */
export function useSessionData() {
  const [role, setRole] = useState<RolUsuario | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);
  const [expiration, setExpiration] = useState<Date | null>(null);
  const [supabaseToken, setSupabaseToken] = useState<SupabaseJwt | null>(null);

  // Obtener la sesión de NextAuth
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    const checkDataUsuario = async () => {
      if (!session || !session.address) {
        setRole(null);

        return;
      }
      setRole((session.userRole as RolUsuario) || RolUsuario.USUARIO);

      setWallet(session.address);

      setExpiration(session.expires ? new Date(session.expires) : null);

      setSupabaseToken(session.supabase || null);
    };

    checkDataUsuario();
  }, [session]);

  return { role, wallet, expiration, supabaseToken };
}
