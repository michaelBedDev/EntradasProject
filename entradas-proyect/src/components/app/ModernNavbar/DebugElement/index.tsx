import { useSessionData } from "@/hooks/useSessionData";
import { RolUsuario } from "@/types/rol-usuario";

export default function DebugElement() {
  const { role, wallet } = useSessionData();
  return (
    <div className="fixed bottom-24 right-4 bg-black/80 text-white p-2 rounded-lg text-xs z-50 flex flex-col gap-1">
      <div>
        Rol:{" "}
        <span
          className={`font-bold ${
            role === RolUsuario.ORGANIZADOR
              ? "text-green-400"
              : role === RolUsuario.ADMINISTRADOR
              ? "text-red-400"
              : "text-blue-400"
          }`}>
          {role || "ninguno"}
        </span>
      </div>
      <div>
        Wallet:{" "}
        {wallet
          ? `${wallet.substring(0, 6)}...${wallet.substring(wallet.length - 4)}`
          : "no conectada"}
      </div>
    </div>
  );
}
