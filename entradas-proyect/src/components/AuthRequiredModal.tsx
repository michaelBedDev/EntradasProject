"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { create } from "zustand";

// Crear una store global para controlar el estado del modal
interface AuthModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export default function AuthRequiredModal() {
  const { isOpen, close } = useAuthModal();

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-2">
            Autenticación requerida
          </DialogTitle>
          <DialogDescription>
            Necesitas iniciar sesión para acceder a esta funcionalidad.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Conecta tu wallet para acceder a todas las funcionalidades de la
            plataforma, como comprar entradas, ver tus tickets y más.
          </p>
        </div>

        <div className="flex justify-between items-center pt-4">
          <Button variant="outline" onClick={close}>
            <XIcon className="h-4 w-4 mr-1" /> Cancelar
          </Button>

          <div className="wallet-button-container">
            <appkit-button />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
