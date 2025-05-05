// // app/components/auth/SupabaseTokenHandler.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useSession, signIn, signOut } from "next-auth/react";
// import { getAccount, getNetwork, signMessage, useAccount } from "wagmi";
// import { createSiweMessage } from "viem/siwe";
// import { getCsrfToken } from "next-auth/react";

// function isTokenExpired(token?: string): boolean {
//   if (!token) return true;
//   try {
//     const [, payloadBase64] = token.split(".");
//     const payload = JSON.parse(atob(payloadBase64));
//     const now = Math.floor(Date.now() / 1000);
//     return payload.exp < now;
//   } catch {
//     return true;
//   }
// }

// export function SupabaseTokenHandler() {
//   const { data: session } = useSession();
//   const { isConnected } = useAccount();
//   const [supabaseToken, setSupabaseToken] = useState<string | null>(null);

//   // Limpia sesión y token al desconectar wallet
//   useEffect(() => {
//     if (!isConnected) {
//       setSupabaseToken(null);
//       signOut({ redirect: false });
//     }
//   }, [isConnected]);

//   // Carga inicial desde sesión si el token es válido
//   useEffect(() => {
//     const token = session?.supabaseToken;
//     if (token && !isTokenExpired(token)) {
//       setSupabaseToken(token);
//     } else {
//       setSupabaseToken(null);
//     }
//   }, [session]);

//   // Si el token falta o expiró, lanzar nueva firma SIWE
//   useEffect(() => {
//     const renewToken = async () => {
//       try {
//         const nonce = await getCsrfToken();
//         if (!nonce) throw new Error("No nonce");

//         const { address } = getAccount();
//         const { chain } = getNetwork();

//         if (!address || !chain) throw new Error("Wallet no conectada");

//         const siweMessage = createSiweMessage({
//           domain: window.location.host,
//           uri: window.location.origin,
//           version: "1",
//           address,
//           chainId: chain.id,
//           nonce,
//           statement: "Refirma para continuar usando la app",
//         });

//         const signature = await signMessage({
//           message: siweMessage.prepareMessage(),
//         });

//         const response = await signIn("credentials", {
//           message: siweMessage.toMessage(),
//           signature,
//           redirect: false,
//         });

//         if (!response?.ok) throw new Error("Firma fallida");
//         // El nuevo token Supabase vendrá en la nueva sesión actualizada
//       } catch (err) {
//         console.error("Error al renovar el token de Supabase:", err);
//         setSupabaseToken(null);
//       }
//     };

//     if (isConnected && !supabaseToken) {
//       renewToken();
//     }
//   }, [supabaseToken, isConnected]);

//   return null;
// }

// // DONDE USARLO
// // app/(auth)/layout.tsx o donde tengas tu layout protegido

// // import { SupabaseTokenHandler } from "@/components/auth/SupabaseTokenHandler";

// // export default function AppLayout({ children }: { children: React.ReactNode }) {
// //   return (
// //     <>
// //       <SupabaseTokenHandler />
// //       {children}
// //     </>
// //   );
// // }
