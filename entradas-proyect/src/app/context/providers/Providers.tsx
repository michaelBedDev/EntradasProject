// app/providers.tsx
"use client";

import React from "react";
import AppKitProvider from "@/app/context/Appkit";
import ModernNavbar from "@/components/app/ModernNavbar";
import { ThemeProvider } from "next-themes";
import { cookieToInitialState } from "wagmi";

interface ProvidersProps {
  children: React.ReactNode;
  initialState: ReturnType<typeof cookieToInitialState>;
}

export default function Providers({ children, initialState }: ProvidersProps) {
  return (
    <AppKitProvider initialState={initialState}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange>
        <div className="flex min-h-screen w-screen bg-background overflow-x-hidden">
          <div className="flex-1 flex flex-col">
            <ModernNavbar />
            <main className="flex-1 pt-36 pb-20 lg:pb-4">
              <div className="px-4 lg:px-6">{children}</div>
            </main>
          </div>
        </div>
      </ThemeProvider>
    </AppKitProvider>
  );
}
