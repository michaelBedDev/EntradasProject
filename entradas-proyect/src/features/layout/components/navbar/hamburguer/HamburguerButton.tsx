"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { LinkType } from "@/types/global";
import { LucideIcon } from "lucide-react";
import ThemeSelector from "../ThemeSelector";
import ConnectWalletButton from "@/features/auth/components/buttons/ConnectWalletButton";
import { LayoutDashboard } from "lucide-react";

interface HamburguerButtonProps {
  showFullNavbar?: boolean;
  links?: LinkType[];
  icons?: Record<string, LucideIcon>;
}

export function HamburguerButton({
  showFullNavbar,
  links,
  icons,
}: HamburguerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
        <div className="flex flex-col mt-8">
          {/* Sección de navegación */}
          <div className="flex flex-col">
            {links?.map((link) => {
              const Icon = icons?.[link.icon];
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/10 text-base w-full">
                  {Icon && <Icon className="h-5 w-5 text-primary" />}
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
            {!showFullNavbar && (
              <Link
                href="/eventos"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/10 text-base w-full">
                <LayoutDashboard className="h-5 w-5 text-primary" />
                <span className="font-medium">Enter App</span>
              </Link>
            )}
          </div>

          {/* Separador */}
          <div className="h-px bg-border/50 my-2" />

          {/* Sección de configuración */}
          <div className="flex flex-col">
            <div className="px-4 py-2">
              <ThemeSelector text="Cambiar Tema" />
            </div>
            <div className="px-4 py-2">
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
