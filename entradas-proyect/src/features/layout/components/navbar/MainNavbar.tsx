"use client";

import Link from "next/link";
import { useState } from "react";
import ConnectWalletButton from "../ConnectWalletButton";
import ThemeSelector from "./ThemeSelector";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LinkType } from "@/types/global";
import { LucideIcon } from "lucide-react";

interface MainNavbarProps {
  showFullNavbar?: boolean;
  links?: LinkType[];
  icons?: Record<string, LucideIcon>;
}

export default function MainNavbar({
  showFullNavbar,
  links,
  icons,
}: MainNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 h-16">
        <div className="flex h-full items-center justify-between">
          {/* Logo y nombre */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Entradas Project
              </span>
            </Link>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-2">
            {/* Menú hamburguesa */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-4 mt-8">
                  {links?.map((link) => {
                    const Icon = icons?.[link.icon];
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/10 transition-colors">
                        {Icon && <Icon className="h-5 w-5 text-primary" />}
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                  {!showFullNavbar && (
                    <Link
                      href="/eventos"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/10 transition-colors">
                      <LayoutDashboard className="h-5 w-5 text-primary" />
                      <span>Enter App</span>
                    </Link>
                  )}
                  <div className="flex items-center gap-2 p-2">
                    <ThemeSelector />
                    <span>Cambiar tema</span>
                  </div>
                  <div className="p-2">
                    <ConnectWalletButton />
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Versión desktop */}
            {!showFullNavbar && (
              <Link href="/eventos" className="hidden md:block">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 rounded-lg border-primary/20 bg-secondary/10 hover:bg-secondary/20 transition-all font-medium px-4 py-2 text-sm">
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                  <span>Enter App</span>
                </Button>
              </Link>
            )}

            {/* Selector de tema y wallet (solo visible en desktop) */}
            <div className="hidden md:flex items-center gap-2">
              <ThemeSelector />
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
