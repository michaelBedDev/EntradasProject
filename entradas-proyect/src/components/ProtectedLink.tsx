"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

interface ProtectedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  showAuthModal: () => void; // Función para mostrar el modal de autenticación
}

/**
 * Componente de enlace que verifica si el usuario está autenticado
 * antes de permitir la navegación a rutas protegidas.
 */
export default function ProtectedLink({
  href,
  children,
  className,
  onClick,
  showAuthModal,
}: ProtectedLinkProps) {
  const { status } = useSession();
  const pathname = usePathname();
  const isCurrentPage = pathname === href;

  // Función de manejo de clics
  const handleClick = (e: React.MouseEvent) => {
    // Si no está autenticado, prevenir la navegación y mostrar el modal
    if (status === "unauthenticated" && !isCurrentPage) {
      e.preventDefault();
      showAuthModal();
      if (onClick) onClick();
      return;
    }

    // Si está autenticado o es la página actual, permitir el comportamiento normal
    if (onClick) onClick();
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
