import { EntradaCompletaPublica } from "@/types/global";

export const getStatusStyle = (entrada: EntradaCompletaPublica) => {
  switch (entrada.estado) {
    case "usado":
      return {
        badge:
          "text-yellow-800 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-900/30",
        text: "Usado",
      };
    case "expirado":
      return {
        badge: "text-red-800 bg-red-100 dark:text-red-200 dark:bg-red-900/30",
        text: "Expirado",
      };
    default:
      return {
        badge:
          "text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-900/30",
        text: "Disponible",
      };
  }
};
