"use server";

import { getServerSession } from "next-auth";
import { RolUsuario } from "@/types/rol-usuario";
import ModernNavbar from ".";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { LinkType } from "@/types/global";

// Definir los enlaces para cada tipo de usuario
const userLinks: LinkType[] = [
  { href: "/app", label: "Dashboard", icon: "Home" },
  { href: "/eventos", label: "Eventos", icon: "Calendar" },
  { href: "/mis-entradas", label: "Mis Entradas", icon: "Inbox" },
  { href: "/ajustes", label: "Ajustes", icon: "Settings" },
];

const organizerLinks: LinkType[] = [
  { href: "/", label: "Inicio", icon: "Home" },
  { href: "/crear-evento", label: "Crear Evento", icon: "PlusCircle" },
  { href: "/dashboard", label: "Dashboard", icon: "BarChart3" },
  { href: "/mis-eventos", label: "Mis Eventos", icon: "LayoutGrid" },
];

const adminLinks: LinkType[] = [
  { href: "/", label: "Inicio", icon: "Home" },
  { href: "/admin/usuarios", label: "Usuarios", icon: "User" },
  { href: "/admin/eventos", label: "Eventos", icon: "Calendar" },
  { href: "/admin/dashboard", label: "Dashboard", icon: "BarChart3" },
];

export default async function ModernNavbarWrapper() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.userRole as RolUsuario) || RolUsuario.USUARIO;

  const linksByRole: Record<RolUsuario, LinkType[]> = {
    [RolUsuario.ADMINISTRADOR]: adminLinks,
    [RolUsuario.ORGANIZADOR]: organizerLinks,
    [RolUsuario.USUARIO]: userLinks,
  };

  const links: LinkType[] = linksByRole[userRole] || userLinks;

  return <ModernNavbar links={links} />;
}
