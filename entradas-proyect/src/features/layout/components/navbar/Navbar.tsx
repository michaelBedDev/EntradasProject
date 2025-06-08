"use client";

import { icons } from "./links";
import { LinkType } from "@/types/global";
import MobileNavbar from "./MobileNavbar";
import Linksbar from "./Linksbar";
import MainNavbar from "./MainNavbar";
// import DebugElement from "./debug-element/DebugElement";

export interface NavbarProps {
  links: LinkType[];
  showFullNavbar: boolean;
}

export default function Navbar({ links, showFullNavbar = false }: NavbarProps) {
  // const { open: openAuthModal } = useAuthModal();

  return (
    <>
      {/* Barra de navegación superior con logo y botones */}
      <MainNavbar showFullNavbar={showFullNavbar} />

      {showFullNavbar && (
        <>
          {/* Barra de Navegación de Links */}
          <Linksbar links={links} icons={icons} />

          {/* Barra de navegación móvil - Tabs inferiores */}
          <MobileNavbar links={links} icons={icons} />
        </>
      )}

      {/* Espaciador para el contenido considerando ambas barras */}
      <div className="h-18 w-full" />

      {/* <DebugElement /> */}
    </>
  );
}
