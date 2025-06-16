"use client";

import Link from "next/link";
import ConnectWalletButton from "../ConnectWalletButton";
import ThemeSelector from "./ThemeSelector";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { LinkType } from "@/types/global";
import { LucideIcon } from "lucide-react";
import { HamburguerButton } from "./hamburguer/HamburguerButton";

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
  return (
    <div className=" w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-8 h-16 max-w-8xl">
        <div className="flex h-full items-center justify-between">
          {/* Logo y nombre */}
          <div className="flex items-center space-x-2">
            <Link href="/app" className="flex items-center">
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Entradas Project
              </span>
            </Link>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-2">
            {/* Menú hamburguesa */}
            <HamburguerButton
              showFullNavbar={showFullNavbar}
              links={links}
              icons={icons}
            />

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
              <ThemeSelector compact />
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
