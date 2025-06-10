import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

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

/**
 * Obtiene el rol del usuario desde la solicitud de NextAuth.
 * Si no hay sesión o el rol no está definido, retorna "usuario".
 * Si el rol es undefined, se asume que es un usuario normal.
 * Éste método se utiliza para obtener el rol del usuario desde las APIs, para el resto de casos se utiliza getUserRole.
 * @param request - La solicitud de Next.js.
 * @returns {Promise<string>} El rol del usuario o "usuario" si no hay sesión.
 */
export async function getUserRoleFromRequest(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) return "usuario";

  return token.userRole;
}
