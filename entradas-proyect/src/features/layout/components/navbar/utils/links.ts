import { LinkType } from "@/types/global";

export const userLinks: LinkType[] = [
  { href: "/app", label: "Home", icon: "Home" },
  { href: "/eventos", label: "Explorar", icon: "Search" },
  { href: "/mis-entradas", label: "Mis Entradas", icon: "Ticket" },
];

export const organizerLinks: LinkType[] = [
  // { href: "/organizador/dashboard", label: "Dashboard", icon: "BarChart3" },
  { href: "/eventos", label: "Explorar", icon: "Search" },
  { href: "/organizador/crear-evento", label: "Crear Evento", icon: "PlusCircle" },
  { href: "/organizador/mis-eventos", label: "Mis Eventos", icon: "Calendar" },
];

export const adminLinks: LinkType[] = [
  // { href: "/administrador/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/eventos", label: "Explorar", icon: "Search" },
  { href: "/administrador/roles", label: "Gestión de Roles", icon: "Shield" },
  {
    href: "/administrador/solicitudes",
    label: "Solicitudes",
    icon: "ClipboardList",
  },
];

// Importamos los iconos para usar en los enlaces de navegación
import {
  Home,
  Calendar,
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
  Ticket,
  LayoutDashboard,
  Shield,
  ClipboardList,
} from "lucide-react";

export const icons: Record<string, LucideIcon> = {
  Home,
  User,
  Settings,
  Calendar,
  Ticket,
  PlusCircle,
  BarChart3,
  LayoutGrid,
  AppWindow,
  Moon,
  Sun,
  Search,
  Menu,
  LayoutDashboard,
  Shield,
  ClipboardList,
};
