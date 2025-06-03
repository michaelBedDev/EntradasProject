"use client";

export default function ConnectWalletButton() {
  // appkit-button es un web component que maneja su propio estado
  // Solo necesitamos renderizarlo para que funcione correctamente
  return (
    <div className="wallet-button-container">
      <appkit-button />
    </div>
  );
}
