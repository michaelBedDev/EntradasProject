// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { ThemeProvider } from "./context/providers/ThemeProvider";
import Providers from "./context/providers/Providers";
import { cookieToInitialState } from "wagmi";
import { wagmiAdapter } from "./config";
import { Footer } from "@/features/layout/components/Footer";
import { Toaster } from "sonner";
import NavbarWrapper from "@/features/layout/components/navbar/NavbarWrapper";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Entradas Proyect",
  description: "Prototipo 3",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Leer cookies/headers en servidor
  const headerStore = await headers();
  const headerCookie = headerStore.get("cookie");
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, headerCookie);
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground px-4 lg:px-6 flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <Providers initialState={initialState}>
            <NavbarWrapper />
            <Toaster theme="dark" />
            <main className="flex-1 mb-16">{children}</main>
            <Footer />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
