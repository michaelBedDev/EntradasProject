"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useUserRole } from "@/hooks/use-user-role";
import { UserRole } from "@/types/users.types";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ConnectWalletButton } from "@/components/app";
import ProtectedLink from "@/components/ProtectedLink";
import {
  Home,
  Calendar,
  Inbox,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  PlusCircle,
  BarChart3,
  LayoutGrid,
  Menu,
  AppWindow,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthModal } from "@/components/AuthRequiredModal";

// Definir los enlaces para cada tipo de usuario
const userLinks = [
  { href: "/app", label: "Dashboard", icon: Home },
  { href: "/eventos", label: "Eventos", icon: Calendar },
  { href: "/mis-entradas", label: "Mis Entradas", icon: Inbox },
  { href: "/ajustes", label: "Ajustes", icon: Settings },
];

const organizerLinks = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/crear-evento", label: "Crear Evento", icon: PlusCircle },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/mis-eventos", label: "Mis Eventos", icon: LayoutGrid },
];

const adminLinks = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/admin/usuarios", label: "Usuarios", icon: User },
  { href: "/admin/eventos", label: "Eventos", icon: Calendar },
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
];

// Enlaces secundarios de navegación horizontal para cada tipo de usuario
const userSecondaryLinks = [
  { href: "/app", label: "App", icon: AppWindow, protected: true },
  { href: "/eventos", label: "Eventos", icon: Calendar, protected: false },
  { href: "/mis-entradas", label: "Mis Entradas", icon: Inbox, protected: true },
  { href: "/ajustes", label: "Ajustes", icon: Settings, protected: true },
];

const organizerSecondaryLinks = [
  { href: "/", label: "Inicio", icon: Home, protected: false },
  {
    href: "/crear-evento",
    label: "Crear Evento",
    icon: PlusCircle,
    protected: true,
  },
  { href: "/dashboard", label: "Panel", icon: BarChart3, protected: true },
  { href: "/mis-eventos", label: "Mis Eventos", icon: LayoutGrid, protected: true },
];

const adminSecondaryLinks = [
  { href: "/admin/dashboard", label: "Panel", icon: BarChart3, protected: true },
  { href: "/admin/usuarios", label: "Usuarios", icon: User, protected: true },
  { href: "/admin/eventos", label: "Eventos", icon: Calendar, protected: true },
  { href: "/", label: "Ver Web", icon: Home, protected: false },
];

const ModernNavbar = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { role, isLoading } = useUserRole();
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { open: openAuthModal } = useAuthModal();

  // Log para depuración
  useEffect(() => {
    console.log("🎭 Rol actual del usuario:", role);
  }, [role]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Determinar qué enlaces mostrar según el rol
  let links = userLinks; // Por defecto, mostrar enlaces de usuario
  let secondaryLinks = userSecondaryLinks; // Enlaces secundarios por defecto

  useEffect(() => {
    if (role === UserRole.Organizador) {
      console.log("🎭 Aplicando enlaces de organizador");
    } else if (role === UserRole.Admin) {
      console.log("🎭 Aplicando enlaces de administrador");
    } else {
      console.log("🎭 Aplicando enlaces de usuario normal");
    }
  }, [role]);

  if (role === UserRole.Organizador) {
    console.log("Mostrando enlaces de organizador");
    links = organizerLinks;
    secondaryLinks = organizerSecondaryLinks;
  } else if (role === UserRole.Admin) {
    console.log("Mostrando enlaces de administrador");
    links = adminLinks;
    secondaryLinks = adminSecondaryLinks;
  } else {
    console.log("Mostrando enlaces de usuario");
    links = userLinks;
    secondaryLinks = userSecondaryLinks;
  }

  if (!isMounted) {
    return null; // Evitar renderizado en servidor para prevenir errores de hidratación
  }

  return (
    <>
      {/* Barra de navegación principal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16">
          <div className="flex h-full items-center justify-between">
            {/* Logo y nombre */}
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center">
                <span className="font-bold text-xl bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  Entradas
                </span>
              </Link>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center gap-2">
              {/* Menú móvil */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menú</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="lg:hidden py-6">
                  <div className="mb-8 flex items-center">
                    <span className="font-bold text-xl bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                      Entradas
                    </span>
                  </div>
                  <div className="flex flex-col space-y-2">
                    {links.map((link) => {
                      const isActive = pathname === link.href;
                      const Icon = link.icon;

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted"
                          }`}>
                          <Icon className="h-4.5 w-4.5" />
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Selector de tema */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9 rounded-full">
                <Sun className="h-4.5 w-4.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4.5 w-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Cambiar tema</span>
              </Button>

              {/* Wallet */}
              <div className="hidden sm:block">
                <ConnectWalletButton />
              </div>

              {/* Menú de usuario */}
              {session?.user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full overflow-hidden">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={session.user.image || ""}
                          alt={session.user.name || ""}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                          {session.user.name?.charAt(0) ||
                            session.user.email?.charAt(0) ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session.user.name || "Usuario"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user.email || ""}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/perfil"
                        className="cursor-pointer flex w-full items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/ajustes"
                        className="cursor-pointer flex w-full items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Ajustes</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Segunda barra de navegación horizontal con diseño moderno, separada de la primera */}
      <div className="fixed top-20 left-0 right-0 z-40 py-1.5">
        <div className="container mx-auto px-4">
          <div className="bg-background/40 dark:bg-background/30 backdrop-blur-sm mx-auto max-w-md">
            <div className="flex items-center justify-center h-12 overflow-x-auto no-scrollbar">
              <div className="flex relative">
                {secondaryLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;

                  return (
                    <div key={link.href} className="relative">
                      {link.protected ? (
                        <ProtectedLink
                          href={link.href}
                          showAuthModal={openAuthModal}
                          className={`
                            flex items-center px-4 py-2 rounded-md transition-all
                            ${
                              isActive
                                ? "text-primary font-medium"
                                : "text-foreground/70 hover:text-foreground"
                            }
                          `}>
                          <Icon
                            className={`h-4 w-4 ${
                              isActive ? "text-primary" : ""
                            } mr-2`}
                          />
                          <span className="text-sm">{link.label}</span>
                          {isActive && (
                            <motion.div
                              layoutId="navbar-indicator"
                              transition={{
                                type: "spring",
                                stiffness: 350,
                                damping: 30,
                              }}
                              className="absolute -bottom-[2px] left-0 right-0 h-0.5 bg-primary rounded-full"
                            />
                          )}
                        </ProtectedLink>
                      ) : (
                        <Link
                          href={link.href}
                          className={`
                            flex items-center px-4 py-2 rounded-md transition-all
                            ${
                              isActive
                                ? "text-primary font-medium"
                                : "text-foreground/70 hover:text-foreground"
                            }
                          `}>
                          <Icon
                            className={`h-4 w-4 ${
                              isActive ? "text-primary" : ""
                            } mr-2`}
                          />
                          <span className="text-sm">{link.label}</span>
                          {isActive && (
                            <motion.div
                              layoutId="navbar-indicator"
                              transition={{
                                type: "spring",
                                stiffness: 350,
                                damping: 30,
                              }}
                              className="absolute -bottom-[2px] left-0 right-0 h-0.5 bg-primary rounded-full"
                            />
                          )}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación móvil - Tabs inferiores */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-t border-border flex justify-around p-1 px-2">
        {links.slice(0, 4).map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center justify-center py-2 px-3">
              <div
                className={`p-1.5 rounded-full ${isActive ? "bg-primary/10" : ""}`}>
                <Icon
                  className={`h-5 w-5 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
              </div>
              <span
                className={`text-xs mt-0.5 ${
                  isActive ? "text-primary font-medium" : "text-muted-foreground"
                }`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Espaciador para el contenido considerando ambas barras */}
      <div className="h-36 w-full" />

      {/* Depuración */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-24 right-4 bg-black/80 text-white p-2 rounded-lg text-xs z-50 flex flex-col gap-1">
          <div>
            Rol:{" "}
            <span
              className={`font-bold ${
                role === UserRole.Organizador
                  ? "text-green-400"
                  : role === UserRole.Admin
                  ? "text-red-400"
                  : "text-blue-400"
              }`}>
              {role || "ninguno"}
            </span>
          </div>
          <div>
            Wallet:{" "}
            {session?.address
              ? `${session.address.substring(0, 6)}...${session.address.substring(
                  session.address.length - 4,
                )}`
              : "no conectada"}
          </div>
          <div className="text-[10px] opacity-70">
            Enlaces activos:{" "}
            {links === organizerLinks
              ? "organizador"
              : links === adminLinks
              ? "admin"
              : "usuario"}
          </div>
          <div className="text-[10px] opacity-70">
            Cargando: {isLoading ? "sí" : "no"}
          </div>
        </div>
      )}
    </>
  );
};

export default ModernNavbar;
