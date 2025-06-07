"use server";

import { getSessionData } from "@/features/auth/lib/getSessionData";
import OrganizerDashboardPage from "./page";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

export default async function EventosWrapper() {
  let eventosList: Evento[] = [];

  try {
    const sessionData = await getSessionData();

    if (!sessionData) {
      return <p>Debes iniciar sesión para ver los eventos. ¿Eres un organizador?</p>;
    }

    const wallet = sessionData.address;

    const response = await fetch(`${baseUrl}/api/eventos/organizador/${wallet}`);

    if (!response.ok) {
      if (response.status === 404) {
        return <p>No tienes eventos creados aún.</p>;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    eventosList = await response.json();

    if (!eventosList || eventosList.length === 0) {
      return <p>No tienes eventos creados aún</p>;
    }
  } catch (error) {
    console.error("Error fetching eventos:", error);
    return <p>Error al cargar los eventos. Inténtalo de nuevo.</p>;
  }

  return <OrganizerDashboardPage eventos={eventosList} />;
}
