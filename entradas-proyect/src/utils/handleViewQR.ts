import { EntradaCompletaPublica } from "@/types/global";
import { showToastSuccess } from "./toast";

export const handleViewQR = (entrada: EntradaCompletaPublica) => {
  showToastSuccess({
    title: "Mostrando código QR",
    description: `Código QR para ${entrada.tipo_entrada.evento.titulo}. Presenta este código en la entrada del evento`,
    action: {
      label: "Cerrar",
      onClick: () => console.log("Cerrado"),
    },
  });
  // Aquí iría la lógica para mostrar el QR grande usando entrada.qrData
};
