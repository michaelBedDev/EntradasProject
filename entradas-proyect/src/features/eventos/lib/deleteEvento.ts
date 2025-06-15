export type DeleteEventoResult = {
  success: boolean;
  error?: string;
};

export const deleteEvento = async (
  eventoId: string,
): Promise<DeleteEventoResult> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/eventos/${eventoId}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al eliminar el evento");
    }

    return { success: true };
  } catch (error) {
    console.error("Error al eliminar el evento:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "No se pudo eliminar el evento",
    };
  }
};
