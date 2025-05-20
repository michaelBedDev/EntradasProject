"use client";

import { useState, useEffect } from "react";
import { UserRole } from "@/types/users.types";
import { useSession } from "next-auth/react";

export function useUserRole() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    // Función para verificar el rol del usuario
    const checkUserRole = async () => {
      if (!session) {
        console.log("No hay sesión disponible");
        setRole(null);
        setIsLoading(false);
        return;
      }

      try {
        // Verificar si tenemos dirección de wallet
        if (!session.address) {
          console.log("No hay dirección de wallet en la sesión");
          setRole(UserRole.Usuario);
          setIsLoading(false);
          return;
        }

        console.log("Verificando rol para wallet:", session.address);

        // Llamar a la API para verificar el rol del usuario
        const response = await fetch("/api/users/check-role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ wallet: session.address }),
        });

        if (!response.ok) {
          console.error(
            "Error en la respuesta de la API:",
            response.status,
            response.statusText,
          );
          setRole(UserRole.Usuario);
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        console.log("Respuesta de API check-role:", data);

        // Determinar el rol según la respuesta
        if (data.role) {
          const userRole = data.role.toLowerCase();

          console.log("Rol recibido de la API:", userRole);

          // Comparar con los valores exactos del enum
          if (userRole === UserRole.Organizador) {
            console.log("➡️ ESTABLECIENDO ROL DE ORGANIZADOR");
            setRole(UserRole.Organizador);
          } else if (userRole === UserRole.Admin) {
            console.log("➡️ ESTABLECIENDO ROL DE ADMINISTRADOR");
            setRole(UserRole.Admin);
          } else {
            console.log("➡️ ESTABLECIENDO ROL DE USUARIO");
            setRole(UserRole.Usuario);
          }
        } else {
          console.log("No se recibió rol en la respuesta, usando rol por defecto");
          setRole(UserRole.Usuario);
        }
      } catch (error) {
        console.error("Error al verificar el rol:", error);
        setRole(UserRole.Usuario);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [session]);

  return { role, isLoading };
}
