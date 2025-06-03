"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { ConnectWalletButton } from "@/components/app";

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
} from "lucide-react";

import React from "react";
import Link from "next/link";
import { LinkType } from "@/types/global";
import DebugElement from "./DebugElement";

const iconMap = {
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
  Menu,
};

const ModernNavbar = ({ links }: { links: LinkType[] }) => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // const { open: openAuthModal } = useAuthModal();

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
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Segunda barra de navegación horizontal - Desktop only */}
      <div className="fixed top-16 left-0 right-0 z-40 hidden md:block">
        <div className="container mx-auto px-4 py-2">
          <div className="bg-background/60 dark:bg-background/40 backdrop-blur-md rounded-full shadow-sm border border-border/20 mx-auto max-w-fit">
            <div className="flex items-center justify-center h-10 px-2">
              {links.map((link: LinkType) => {
                const isActive = pathname === link.href;
                const Icon = iconMap[link.icon as keyof typeof iconMap];

                return (
                  <div key={link.href} className="relative">
                    <Link
                      href={link.href}
                      className={`
            relative flex items-center px-4 py-1.5 rounded-full transition-all duration-200
            ${
              isActive
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-background/80"
            }
              `}>
                      <div className="h-4 w-4 mr-2 flex items-center justify-center">
                        {Icon && (
                          <Icon className={`${isActive ? "text-primary" : ""}`} />
                        )}
                      </div>
                      <span className="text-sm whitespace-nowrap">{link.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="navbar-indicator"
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 30,
                          }}
                          className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                        />
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Navegación móvil - Tabs inferiores */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-t border-border flex justify-around p-1 px-2">
        {links.slice(0, 4).map((link) => {
          const isActive = pathname === link.href;
          const Icon = iconMap[link.icon as keyof typeof iconMap];

          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center justify-center py-2 px-3">
              <div
                className={`p-1.5 rounded-full ${isActive ? "bg-primary/10" : ""}`}>
                {Icon ? (
                  <div
                    className={`h-5 w-5 flex items-center justify-center ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}>
                    <Icon />
                  </div>
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-5 h-5" />
                )}
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

      <DebugElement />
    </>
  );
};

export default ModernNavbar;
