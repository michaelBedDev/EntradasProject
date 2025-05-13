// app/providers.tsx
"use client";

import React from "react";
import AppKitProvider from "@/app/context/Appkit";
import { AppSidebar, Navbar } from "@/components/app";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import { cookieToInitialState } from "wagmi";

interface ProvidersProps {
  children: React.ReactNode;
  defaultOpen: boolean;
  initialState: ReturnType<typeof cookieToInitialState>;
}

export default function Providers({
  children,
  defaultOpen,
  initialState,
}: ProvidersProps) {
  return (
    <AppKitProvider initialState={initialState}>
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
    </AppKitProvider>
  );
}
