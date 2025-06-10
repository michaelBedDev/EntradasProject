// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { ThemeProvider } from "./context/providers/ThemeProvider";
import Providers from "./context/providers/Providers";
import { cookieToInitialState } from "wagmi";
import { wagmiAdapter } from "./config";
import Navbar from "@/features/layout/components/navbar/Navbar";
import { Footer } from "@/components/ui/footer";

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <Providers initialState={initialState}>
            <Navbar links={[]} showFullNavbar={false} />
            {children}
            <Footer />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
