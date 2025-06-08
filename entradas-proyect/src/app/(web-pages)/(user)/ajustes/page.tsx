"use client";

import { useState } from "react";
import {
  Settings,
  User,
  Wallet,
  Shield,
  Bell,
  Moon,
  Sun,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTheme } from "next-themes";

export default function AjustesPage() {
  // Estados para la página
  const [copied, setCopied] = useState(false);
  const { theme, setTheme } = useTheme();
  const [notificaciones, setNotificaciones] = useState(true);

  // Datos simulados del usuario
  const walletAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
  const shortAddress = `${walletAddress.substring(0, 6)}...${walletAddress.substring(
    walletAddress.length - 4,
  )}`;

  // Función para copiar al portapapeles
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress).then(() => {
      setCopied(true);
      toast.success("Dirección copiada al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Función para desconectar wallet (simulada)
  const handleLogout = () => {
    toast.success("Wallet desconectada correctamente");
    // Aquí iría la lógica real para desconectar la wallet
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Encabezado estilo Apple */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">Ajustes</h1>
        <p className="text-muted-foreground text-lg">
          Gestiona tu cuenta y preferencias
        </p>
      </div>

      <div className="space-y-8">
        {/* Sección de Wallet */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-border/40">
            <div className="flex items-center">
              <Wallet className="h-5 w-5 mr-2 text-primary" />
              <CardTitle>Conectividad Wallet</CardTitle>
            </div>
            <CardDescription>Información de tu wallet conectada</CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Dirección actual
                </p>
                <p className="font-medium">{shortAddress}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex gap-1 items-center"
                onClick={copyToClipboard}>
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "¡Copiado!" : "Copiar"}
              </Button>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Desconectar Wallet
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>¿Desconectar wallet?</DialogTitle>
                  <DialogDescription>
                    Esta acción cerrará tu sesión actual. Necesitarás conectar tu
                    wallet nuevamente para acceder.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <Button variant="outline" className="mr-2">
                    Cancelar
                  </Button>
                  <Button variant="destructive" onClick={handleLogout}>
                    Desconectar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Sección de Preferencias */}
        <Card>
          <CardHeader className="bg-primary/5 border-b border-border/40">
            <div className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-primary" />
              <CardTitle>Preferencias</CardTitle>
            </div>
            <CardDescription>
              Personaliza tu experiencia en la plataforma
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            <Separator />

            {/* Notificaciones */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-primary" />
                <Label htmlFor="notifications-toggle" className="cursor-pointer">
                  Notificaciones
                </Label>
              </div>
              <Switch
                id="notifications-toggle"
                checked={notificaciones}
                onCheckedChange={setNotificaciones}
              />
            </div>

            <Separator />

            {/* Privacidad y seguridad */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                <span>Privacidad y seguridad</span>
              </div>
              <Button variant="ghost" size="sm" className="text-primary" asChild>
                <a href="/privacidad" className="flex items-center">
                  Ver <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sección de Cuenta */}
        <Card>
          <CardHeader className="bg-primary/5 border-b border-border/40">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              <CardTitle>Datos personales</CardTitle>
            </div>
            <CardDescription>Información asociada a tu cuenta</CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="space-y-2 mb-6">
              <p className="text-muted-foreground text-sm">
                Tu cuenta está asociada a tu wallet y no requiere datos personales
                adicionales. Si deseas añadir información complementaria como nombre,
                correo o preferencias, puedes hacerlo a continuación.
              </p>
            </div>

            <Button variant="outline">Completar perfil</Button>
          </CardContent>

          <CardFooter className="border-t border-border/40 bg-muted/20 text-xs text-muted-foreground">
            <p>Cuenta creada el 10 de noviembre de 2024</p>
          </CardFooter>
        </Card>

        {/* Espacio para información legal */}
        <div className="text-center text-xs text-muted-foreground space-y-2">
          <p>© 2024 Entradas Proyect. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-4">
            <a href="/terminos" className="hover:text-primary transition-colors">
              Términos de servicio
            </a>
            <a href="/privacidad" className="hover:text-primary transition-colors">
              Política de privacidad
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
