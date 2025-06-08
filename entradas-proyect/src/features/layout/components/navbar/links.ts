import { LinkType } from "@/types/global";

export const userLinks: LinkType[] = [
  { href: "/app", label: "Dashboard", icon: "Home" },
  { href: "/eventos", label: "Eventos", icon: "Calendar" },
  { href: "/mis-entradas", label: "Mis Entradas", icon: "Inbox" },
  { href: "/ajustes", label: "Ajustes", icon: "Settings" },
];

export const organizerLinks: LinkType[] = [
  { href: "/organizador/dashboard", label: "Dashboard", icon: "BarChart3" },
  { href: "/eventos", label: "Explorar", icon: "Search" },
  { href: "/organizador/crear-evento", label: "Crear Evento", icon: "PlusCircle" },
  { href: "/organizador/mis-eventos", label: "Mis Eventos", icon: "LayoutGrid" },
];

export const adminLinks: LinkType[] = [
  { href: "/", label: "Inicio", icon: "Home" },
  { href: "/admin/usuarios", label: "Usuarios", icon: "User" },
  { href: "/admin/eventos", label: "Eventos", icon: "Calendar" },
  { href: "/admin/dashboard", label: "Dashboard", icon: "BarChart3" },
];

// Importamos los iconos para usar en los enlaces de navegación,
import {
  Home,
  Calendar,
  Inbox,
  Settings,
  User,
  Moon,
  Sun,
  PlusCircle,
  BarChart3,
  LayoutGrid,
  Menu,
  AppWindow,
  Search,
  LucideIcon,
} from "lucide-react";

export const icons: Record<string, LucideIcon> = {
  Home,
  User,
  Settings,
  Calendar,
  Inbox,
  PlusCircle,
  BarChart3,
  LayoutGrid,
  AppWindow,
  Moon,
  Sun,
  Search,
  Menu,
};
