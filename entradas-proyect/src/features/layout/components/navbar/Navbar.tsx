"use client";

import { LinkType } from "@/types/global";
// import DebugElement from "./debug-element/DebugElement";
import MobileNavbar from "./MobileNavbar";
import Linksbar from "./Linksbar";
import MainNavbar from "./MainNavbar";
import { icons } from "./links";

const ModernNavbar = ({ links }: { links: LinkType[] }) => {
  // const { open: openAuthModal } = useAuthModal();

  return (
    <>
      {/* Barra de navegación superior con logo y botones */}
      <MainNavbar />

      {/* Barra de Navegación de Links */}
      <Linksbar links={links} icons={icons} />

      {/* Barra de navegación móvil - Tabs inferiores */}
      <MobileNavbar links={links} icons={icons} />

      {/* Espaciador para el contenido considerando ambas barras */}
      <div className="h-36 w-full" />

      {/* <DebugElement /> */}
    </>
  );
};

export default ModernNavbar;
