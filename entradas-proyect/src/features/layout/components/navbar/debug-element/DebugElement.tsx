import { useSessionData } from "@/features/auth/hooks/useSessionData";
import { parseSupabaseToken } from "@/lib/supabase/utils";
import { RolUsuario } from "@/types/enums";

export default function DebugElement() {
  const { role, wallet, expiration, supabaseToken } = useSessionData();
  const tokenData = parseSupabaseToken(supabaseToken?.token ?? null);

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
      <div>
        Expiración:{" "}
        <span className="font-bold">
          {expiration ? expiration.toLocaleString() : "no disponible"}
        </span>
      </div>
      <div>
        Expiración de Supabase Token:{" "}
        {supabaseToken ? (
          <span className="font-mono">
            {supabaseToken.exp
              ? new Date(supabaseToken.exp * 1000).toLocaleString()
              : "no disponible"}
          </span>
        ) : (
          "no disponible"
        )}
        <div>
          Datos del Supabase Token:
          <br />
          {tokenData ? (
            <pre>{JSON.stringify(tokenData, null, 2)}</pre>
          ) : (
            "Token no válido o no disponible"
          )}
        </div>
      </div>
    </div>
  );
}
