import { ReactNode } from "react";
import { Action, toast } from "sonner";

export function showToastSuccess({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode | Action;
}) {
  toast(`🎉 ${title}`, {
    description: description,
    position: "bottom-right",

    style: {
      background: "oklch(0.129 0.042 264.695)",
      color: "oklch(0.984 0.003 247.858)",
    },
    action: action,
  });
}

export function showToastError({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  toast.error(`❌ ${title}`, {
    description: description,
    position: "bottom-right",

    style: {
      background: "oklch(0.129 0.042 264.695)",
      color: "oklch(0.984 0.003 247.858)",
    },
  });
}
