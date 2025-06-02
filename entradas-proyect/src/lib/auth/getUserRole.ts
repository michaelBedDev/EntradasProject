import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function getUserRole() {
  const session = await getServerSession(authOptions);

  if (!session || !session.userRole) {
    return null; // No session or userRole not set
  }

  return session.userRole; // Devuelve el rol del usuario
}
