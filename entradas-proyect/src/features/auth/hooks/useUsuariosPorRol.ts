"use client";

import { useState, useEffect } from "react";
import { RolUsuario } from "@/types/enums";
import { getUsuariosPorRol, actualizarRolUsuario } from "@/app/actions/db/roles";

export function useUsuariosPorRol(rol: RolUsuario) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getUsuariosPorRol(rol);
      setUsuarios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener usuarios");
    } finally {
      setIsLoading(false);
    }
  };

  const actualizarRol = async (usuarioId: string, nuevoRol: RolUsuario) => {
    try {
      await actualizarRolUsuario(usuarioId, nuevoRol);
      // Actualizar el estado local
      setUsuarios((prev) =>
        prev.map((usuario) =>
          usuario.id === usuarioId ? { ...usuario, rol: nuevoRol } : usuario,
        ),
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar el rol");
      return false;
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [rol]);

  return {
    usuarios,
    isLoading,
    error,
    refetch: fetchUsuarios,
    actualizarRol,
  };
}
