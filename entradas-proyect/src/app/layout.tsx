import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { AppSidebar, Navbar } from "@/components/app";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Providers } from "@/components/providers/RainbowKitProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <SidebarProvider defaultOpen={defaultOpen}>
              <AppSidebar />
              <main className="w-full">
                <Navbar />
                <div className="">{children}</div>
              </main>
            </SidebarProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
