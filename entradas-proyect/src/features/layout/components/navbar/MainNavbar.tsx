import Link from "next/link";
import ConnectWalletButton from "../ConnectWalletButton";
import ThemeSelector from "./ThemeSelector";

export default function MainNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 h-16">
        <div className="flex h-full items-center justify-between">
          {/* Logo y nombre */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Entradas
              </span>
            </Link>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-2">
            {/* Selector de tema */}
            <ThemeSelector />
            {/* Wallet */}
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
