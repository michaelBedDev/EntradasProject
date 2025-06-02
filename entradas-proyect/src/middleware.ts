import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Rutas públicas que no requieren autenticación
const publicRoutes = [
  "/eventos", // Explorar eventos (especificada por el usuario)
  "/api/auth", // Rutas de autenticación
  "/login", // Por si hay una página de login
  "/api", // Página principal
  "/_next", // Recursos estáticos
  "/favicon.ico", // Favicon
];

// Middleware de Next.js
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar si la ruta actual es pública
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Si es una ruta pública, permitir acceso sin restricción
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Verificar si el usuario tiene sesión
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Si no hay token, redirigir a la página de eventos
  if (!token) {
    return NextResponse.redirect(new URL("/eventos", request.url));
  }

  // Si hay token, permitir acceso a la ruta protegida
  return NextResponse.next();
}

// Configurar el matcher para que el middleware se ejecute en las rutas especificadas
export const config = {
  matcher: [
    // Aplicar a todas las rutas excepto las estáticas (ya incluidas en publicRoutes)
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
  ],
};
