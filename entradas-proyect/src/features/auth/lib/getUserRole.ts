import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

/**
 * Obtiene el rol del usuario desde la sesión de NextAuth.
 * Si no hay sesión o el rol no está definido, retorna "usuario".
 * Si el rol es undefined, se asume que es un usuario normal.
 *
 * @returns {Promise<string>} El rol del usuario o "usuario" si no hay sesión.
 */
export async function getUserRole() {
  const session = await getServerSession(authOptions);

  if (!session || !session.userRole) return "usuario";

  return session.userRole;
}
