import { EntradaCompletaPublica } from "@/types/global";
import { showToastSuccess } from "./toast";

export const handleDownload = (entrada: EntradaCompletaPublica) => {
  showToastSuccess({
    title: `Descargando entrada para ${entrada.tipo_entrada.evento.titulo}...
  `,
  });
  // Aquí iría la lógica real para descargar la entrada como PDF
};
