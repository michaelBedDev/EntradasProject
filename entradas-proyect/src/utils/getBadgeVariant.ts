export const getBadgeVariant = (status: string) => {
  switch (status) {
    case "PENDIENTE":
      return "secondary";
    case "APROBADO":
      return "default";
    case "RECHAZADO":
      return "destructive";
    case "CANCELADO":
      return "outline";
    default:
      return "default";
  }
};
