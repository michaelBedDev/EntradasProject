// app/(with-nav)/layout.tsx  — SERVER COMPONENT
import Providers from "../context/providers/Providers"; // tu componente cliente
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { wagmiAdapter } from "../config";
import AuthRequiredModal from "@/components/AuthRequiredModal";

export default async function WithNavLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Leer cookies/headers en servidor
  const headerStore = await headers();
  const headerCookie = headerStore.get("cookie") ?? "";

  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, headerCookie);

  return (
    <Providers initialState={initialState}>
      {children}
      <AuthRequiredModal />
    </Providers>
  );
}
