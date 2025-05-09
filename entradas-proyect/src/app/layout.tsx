import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AppSidebar } from "@/components/app";
import { Navbar } from "@/components/app";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

import { Web3AuthProvider } from "@/providers/Web3AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import AuthSync from "@/providers/AuthSync";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Entradas Proyect",
  description: "Prototipo 1",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Web3AuthProvider>
          {/* 👉 Aquí sincronizamos Supabase con la sesión de NextAuth */}
          <AuthSync />

          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <SidebarProvider defaultOpen={defaultOpen}>
              <div className="flex min-h-screen w-screen overflow-x-hidden">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                  <Navbar />
                  <main className="flex-1 p-0">{children}</main>
                </div>
              </div>
            </SidebarProvider>
          </ThemeProvider>
        </Web3AuthProvider>
      </body>
    </html>
  );
}
