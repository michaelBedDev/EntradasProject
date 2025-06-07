"use server";

import { RolUsuario } from "@/types/rol-usuario";
import { LinkType } from "@/types/global";
import { getUserRole } from "@/features/auth/lib/getUserRole";

import ModernNavbar from "./Navbar";
import { adminLinks, organizerLinks, userLinks } from "./links";

/**
 * Componente que envuelve el ModernNavbar y obtiene los enlaces según el rol del usuario.
 * Utiliza getUserRole para determinar el rol del usuario y asignar los enlaces correspondientes.
 *
 * @returns {JSX.Element} El componente ModernNavbar con los enlaces adecuados.
 */
export default async function ModernNavbarWrapper() {
  const userRole = await getUserRole();

  const linksByRole: Record<RolUsuario, LinkType[]> = {
    [RolUsuario.ADMINISTRADOR]: adminLinks,
    [RolUsuario.ORGANIZADOR]: organizerLinks,
    [RolUsuario.USUARIO]: userLinks,
  };

  const links: LinkType[] = linksByRole[userRole as RolUsuario];

  return <ModernNavbar links={links} />;
}
