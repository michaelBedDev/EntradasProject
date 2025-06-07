import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

/**
 * Obtiene los datos de la sesión del usuario desde NextAuth.
 * Incluye el rol, la dirección de la wallet, la fecha de expiración y el token de Supabase.
 *
 * @returns {Promise<Object | null>} Objeto con los datos de la sesión o null si no hay sesión.
 */
export async function getSessionData() {
  const session = await getServerSession(authOptions);

  if (!session || !session.userRole) return null;

  return {
    userRole: session.userRole,
    address: session.address,
    expires: session.expires,
    supabase: session.supabase,
  };
}
