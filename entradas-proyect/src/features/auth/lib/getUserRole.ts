import { authOptions } from "@/features/auth/lib/auth";
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

/**
 * Obtiene la wallet del usuario desde la solicitud de NextAuth.
 * Si no hay sesión o el sub no está definido, retorna null.
 * El sub tiene el formato "chainId:address".
 *
 * @param request - La solicitud de Next.js. Devuelve null si no hay sesión.
 */
export async function getUserWalletFromRequest(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || !token.sub) {
    return null;
  }

  // token.sub = "eip155:1:0x3193ae5Ec51212479F143ce06DA5B18Bd6e61782"
  // Dividir en 3 partes: [protocol, chainId, address]
  const parts = token.sub.split(":");

  if (parts.length !== 3) {
    console.error("Formato de token.sub inválido:", token.sub);
    return null;
  }

  const [, chainId, address] = parts;

  return {
    chainId: parseInt(chainId, 10),
    address: address,
  };
}
