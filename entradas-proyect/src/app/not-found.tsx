"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Página no encontrada</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link href="/">
            <HomeIcon className="h-5 w-5" />
            Volver al inicio
          </Link>
        </Button>
      </div>
    </div>
  );
}
