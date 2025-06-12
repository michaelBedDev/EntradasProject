"use client";

import { UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ImageUploadProps {
  onChange: (value: string | File | null) => void;
  value?: string;
  onRemove?: () => void;
  className?: string;
}

export function ImageUpload({
  onChange,
  value,
  onRemove,
  className,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      onChange(null);
      setPreview(null);
      return;
    }

    // Crear una URL local para la vista previa
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onChange(file);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    if (onRemove) {
      onRemove();
    } else {
      onChange(null);
    }
  };

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="relative h-[200px] w-full rounded-lg overflow-hidden">
        {preview ? (
          <>
            <Image
              src={preview}
              alt="Vista previa de la imagen"
              fill
              className="object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={handleRemove}>
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
