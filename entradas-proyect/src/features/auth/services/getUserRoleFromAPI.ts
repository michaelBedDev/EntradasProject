/**
 * Esta función está escrita exclusivamente para el callback de NextAuth
 * y se encarga de obtener el rol del usuario desde la API para poder guardarlo en el token de sesión
 * @description devuelve el rol del usuario o "usuario" por defecto si no se encuentra el rol
 * @param tokenSub - El campo sub del token que contiene la dirección
 * @returns Promise<string> - El rol del usuario o "usuario" por defecto
 */
export async function getUserRoleFromAPI(
  tokenSub: string | undefined,
): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  try {
    // Extraer la dirección del token.sub ()
    const wallet = tokenSub ? tokenSub.split(":").pop() : "";

    if (!wallet) {
      console.warn("No se pudo extraer la dirección del token");
      return "usuario";
    }

    const response = await fetch(`${baseUrl}/api/users/check-role/${wallet}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching user role: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    return data.role || "usuario";
  } catch (error) {
    console.error("Error fetching user role:", error);
    return "usuario";
  }
}
