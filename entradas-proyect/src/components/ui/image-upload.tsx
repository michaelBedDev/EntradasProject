"use client";

import { UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  className,
}: ImageUploadProps) {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Aquí iría la lógica para subir la imagen a un servicio de almacenamiento
    // Por ahora, solo simulamos la subida creando una URL local
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="relative h-[200px] w-[200px] rounded-lg overflow-hidden">
        {value ? (
          <>
            <Image
              src={value}
              alt="Imagen del evento"
              fill
              className="object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={onRemove}>
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center h-full w-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
            <span className="mt-2 text-sm text-muted-foreground">
              Haz clic para subir una imagen
            </span>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        )}
      </div>
    </div>
  );
}
