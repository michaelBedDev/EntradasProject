"use client";

// No necesitamos importar WalletIcon ya que appkit-button maneja su propio estado
import "./styles.css";

export default function ConnectWalletButton() {
  // appkit-button es un web component que maneja su propio estado
  // Solo necesitamos renderizarlo para que funcione correctamente
  return (
    <div className="wallet-button-container">
      <appkit-button />
    </div>
  );
}
