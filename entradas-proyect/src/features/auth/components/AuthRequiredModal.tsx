"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
}

export default function AuthRequiredModal({
  isOpen,
  onClose,
}: AuthRequiredModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-2">
            Autenticación requerida
          </DialogTitle>
          <DialogDescription>
            Necesitas iniciar sesión para acceder a esta funcionalidad.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
