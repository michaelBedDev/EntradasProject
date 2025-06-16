"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/lib/auth";
import { RolUsuario } from "@/types/enums";
import type { Database } from "@/types/supabase.types";

type Usuario = Database["public"]["Tables"]["usuarios"]["Row"];

export async function getUsuariosPorRol(rol: RolUsuario): Promise<Usuario[]> {
  const session = await getServerSession(authOptions);
  if (!session?.address) {
    throw new Error("No autorizado - Sesión no iniciada");
  }

  const supabase = await getSupabaseServerClient();

  // Verificar que el usuario es administrador
  const { data: userData, error: userError } = await supabase
    .from("usuarios")
    .select("rol")
    .eq("wallet", session.address)
    .single();

  if (userError || !userData) {
    throw new Error("Error al verificar permisos");
  }

  if (userData.rol !== RolUsuario.ADMINISTRADOR) {
    throw new Error("No autorizado - Se requiere rol de administrador");
  }

  // Obtener usuarios con el rol especificado
  const { data: usuarios, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("rol", rol);

  if (error) {
    throw new Error("Error al obtener usuarios");
  }

  return usuarios || [];
}

export async function actualizarRolUsuario(
  usuarioId: string,
  nuevoRol: RolUsuario,
): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session?.address) {
    throw new Error("No autorizado - Sesión no iniciada");
  }

  const supabase = await getSupabaseServerClient();

  // Verificar que el usuario es administrador
  const { data: userData, error: userError } = await supabase
    .from("usuarios")
    .select("rol")
    .eq("wallet", session.address)
    .single();

  if (userError || !userData) {
    throw new Error("Error al verificar permisos");
  }

  if (userData.rol !== RolUsuario.ADMINISTRADOR) {
    throw new Error("No autorizado - Se requiere rol de administrador");
  }

  // Verificar que el nuevo rol es válido
  if (!Object.values(RolUsuario).includes(nuevoRol)) {
    throw new Error("Rol no válido");
  }

  // Asegurarnos de que el rol se pasa como string
  const rolString = nuevoRol.toString();

  // Actualizar el rol del usuario
  const { error } = await supabase
    .from("usuarios")
    .update({ rol: rolString })
    .eq("id", usuarioId);

  if (error) {
    console.error("Error de Supabase al actualizar rol:", error);
    throw new Error("Error al actualizar el rol del usuario");
  }
}
