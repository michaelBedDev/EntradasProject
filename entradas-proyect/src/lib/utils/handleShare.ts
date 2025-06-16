import { EntradaCompletaPublica, EventoPublico } from "@/types/global";
import { showToastSuccess } from "./toast";

const shareItem = (
  id: string,
  title: string,
  description: string,
  type: "evento" | "entrada",
) => {
  const url = `${window.location.origin}/${type}s/${id}`;

  if (navigator.share) {
    navigator
      .share({
        title,
        text: description,
        url: url,
      })
      .catch((error) => {
        console.error("Error compartiendo:", error);
      });
  }

  showToastSuccess({
    title: `"${title}" compartido`,
    description: `El enlace ${
      type === "evento" ? "al evento" : "a la entrada"
    } se ha copiado al portapapeles.`,
  });
};

export const handleShareEvento = (evento: EventoPublico) => {
  shareItem(
    evento.id,
    evento.titulo,
    evento.descripcion || "Mira este evento",
    "evento",
  );
};

export const handleShareEntrada = (entrada: EntradaCompletaPublica) => {
  const evento = entrada.tipo_entrada.evento;
  const titulo = `${entrada.tipo_entrada.nombre} - ${evento.titulo}`;
  const descripcion =
    entrada.tipo_entrada.descripcion || `Entrada para ${evento.titulo}`;

  shareItem(entrada.id, titulo, descripcion, "entrada");
};
