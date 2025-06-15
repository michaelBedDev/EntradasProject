import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/lib/auth";
import { getUserRole } from "@/features/auth/lib/getUserRole";
import EditarEventoForm from "./EditarEventoForm";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EditarEventoPage({ params }: PageProps) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      console.log("No se proporcionó un ID válido");
      return notFound();
    }

    // Obtener los datos del evento por su ID
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/eventos/${id}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    console.log("Status de la respuesta:", response.status);

    // Si la respuesta no es correcta, mostrar 404
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.log("Error de la API:", errorData);
      return notFound();
    }

    const evento = await response.json();
    console.log("Evento encontrado:", evento ? "Sí" : "No");

    // Si no se encuentra el evento, mostrar 404
    if (!evento) {
      console.log("No se encontró el evento en la respuesta");
      return notFound();
    }

    // Verificar permisos
    const session = await getServerSession(authOptions);
    const userRole = await getUserRole();

    // Si el usuario no está autenticado, redirigir al login
    if (!session) {
      console.log("Usuario no autenticado");
      return notFound();
    }

    // Verificar si el usuario es el organizador o un administrador
    const isOrganizer =
      session.address?.toLowerCase() === evento.organizador.wallet.toLowerCase();
    const isAdmin = userRole === "administrador";

    if (!isOrganizer && !isAdmin) {
      console.log("Usuario no es organizador ni admin");
      return notFound();
    }

    // Permitir editar cualquier evento si es el organizador o admin
    return <EditarEventoForm evento={evento} />;
  } catch (error) {
    console.error("Error en EditarEventoPage:", error);
    return notFound();
  }
}
