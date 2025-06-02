// app/providers.tsx
"use client";

import React from "react";
import AppKitProvider from "@/app/context/Appkit";
import { cookieToInitialState } from "wagmi";

interface ProvidersProps {
  children: React.ReactNode;
  initialState: ReturnType<typeof cookieToInitialState>;
}

export default function Providers({ children, initialState }: ProvidersProps) {
  return (
    <AppKitProvider initialState={initialState}>
      <div className="px-4 lg:px-6">{children}</div>
    </AppKitProvider>
  );
}
