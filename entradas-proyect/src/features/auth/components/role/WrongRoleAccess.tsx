import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export function WrongRoleAccess({
  requiredRoleName,
  redirectTo = "/app",
}: {
  requiredRoleName: string;
  redirectTo?: string;
}) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl text-center">
      <h1 className="text-2xl font-bold mb-4">Acceso restringido</h1>
      <p className="text-muted-foreground mb-6">
        ¿Eres un {requiredRoleName}? Este panel es solo para {requiredRoleName}es.
      </p>
      <div className="flex justify-center">
        <Button asChild size="lg" className="gap-2">
          <Link href={redirectTo}>
            <HomeIcon className="h-5 w-5" />
            Volver al inicio
          </Link>
        </Button>
      </div>
    </div>
  );
}
