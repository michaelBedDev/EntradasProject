"use client";

import { useSession } from "next-auth/react";

export function useUserRole() {
  const { data: session, status } = useSession();

  const getUserRole = () => {
    if (!session || !session.userRole) return "usuario";
    return session.userRole;
  };

  return {
    role: getUserRole(),
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}
