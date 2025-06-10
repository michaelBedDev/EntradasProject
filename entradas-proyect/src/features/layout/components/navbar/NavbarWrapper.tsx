// components/NavbarWrapper.tsx
"use client";

import { RolUsuario } from "@/types/rol-usuario";
import { LinkType } from "@/types/global";
import { useMemo } from "react";

import Navbar from "./Navbar";
import { adminLinks, organizerLinks, userLinks } from "./links";
import { useUserRole } from "@/features/auth/hooks/useUserRole";

/**
 * Componente que envuelve el Navbar y obtiene los enlaces según el rol del usuario.
 * Ahora es reactivo y se actualiza automáticamente cuando cambia la sesión.
 */
export default function NavbarWrapper() {
  const { role, isLoading } = useUserRole();

  const linksByRole: Record<RolUsuario, LinkType[]> = {
    [RolUsuario.ADMINISTRADOR]: adminLinks,
    [RolUsuario.ORGANIZADOR]: organizerLinks,
    [RolUsuario.USUARIO]: userLinks,
  };

  const links: LinkType[] = useMemo(() => {
    return linksByRole[role as RolUsuario];
  }, [role]);

  // Mientras carga la sesión, muestra un skeleton
  if (isLoading) {
    return (
      <>
        {/* Skeleton de la barra principal */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="container mx-auto px-4 h-16">
            <div className="flex h-full items-center justify-between">
              {/* Logo skeleton */}
              <div className="flex items-center space-x-2">
                <div className="h-6 w-32 bg-muted animate-pulse rounded-md" />
              </div>

              {/* Botones de acción skeleton */}
              <div className="flex items-center gap-2">
                {/* Menú móvil skeleton */}
                <div className="md:hidden h-9 w-9 bg-muted animate-pulse rounded-md" />

                {/* Botón Enter App skeleton */}
                <div className="hidden md:block">
                  <div className="h-9 w-28 bg-muted/80 animate-pulse rounded-lg border border-border/20" />
                </div>

                {/* Selector de tema y wallet skeleton */}
                <div className="hidden md:flex items-center gap-2">
                  {/* Selector de tema skeleton */}
                  <div className="h-9 w-9 bg-muted/80 animate-pulse rounded-md border border-border/20" />

                  {/* Wallet button skeleton */}
                  <div className="h-9 w-[140px] bg-muted/80 animate-pulse rounded-lg border border-border/20" />
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Skeleton de la barra de links (solo visible en desktop) */}
        <div className="fixed top-16 left-0 right-0 z-40 hidden md:block">
          <div className="container mx-auto px-4 py-2">
            <div className="bg-background/60 dark:bg-background/40 backdrop-blur-md rounded-full shadow-sm border border-border/20 mx-auto max-w-fit">
              <div className="flex items-center justify-center h-10 px-2">
                {Array(links.length)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="mx-2 h-6 w-20 bg-muted animate-pulse rounded-full"
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Espaciador para el contenido */}
        <div className="h-18 w-full" />
      </>
    );
  }

  return <Navbar links={links} showFullNavbar={true} />;
}
