// components/NavbarWrapper.tsx
"use client";

import { RolUsuario } from "@/types/rol-usuario";
import { LinkType } from "@/types/global";
import { useMemo } from "react";

import Navbar from "./Navbar";
import { adminLinks, organizerLinks, userLinks } from "./utils/links";
import { useUserRole } from "@/features/auth/hooks/useUserRole";
import SkeletonMainbar from "./skeletons/SkeletonMainbar";
import SkeletonLinkbar from "./skeletons/SkeletonLinkbar";
import { usePathname } from "next/navigation";

/**
 * Componente que envuelve el Navbar y obtiene los enlaces según el rol del usuario.
 * Ahora es reactivo y se actualiza automáticamente cuando cambia la sesión.
 */
export default function NavbarWrapper() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Solo obtener el rol si NO estamos en la página de inicio
  const { role, isLoading } = useUserRole();

  const linksByRole: Record<RolUsuario, LinkType[]> = {
    [RolUsuario.ADMINISTRADOR]: adminLinks,
    [RolUsuario.ORGANIZADOR]: organizerLinks,
    [RolUsuario.USUARIO]: userLinks,
  };

  const links: LinkType[] = useMemo(() => {
    // Si estamos en home, no devolver links
    if (isHomePage) return [];
    return linksByRole[role as RolUsuario] || [];
  }, [role, isHomePage]);

  const linksCount = links.length;

  // Si estamos en home, mostrar navbar simple sin cargar
  if (isHomePage) {
    return <Navbar links={[]} showFullNavbar={false} />;
  }

  // Mientras carga la sesión (solo en otras rutas), muestra skeleton
  if (isLoading) {
    return (
      <>
        <SkeletonMainbar />
        <SkeletonLinkbar length={linksCount} />
        <div className="h-18 w-full" />
      </>
    );
  }

  return <Navbar links={links} showFullNavbar={true} />;
}
