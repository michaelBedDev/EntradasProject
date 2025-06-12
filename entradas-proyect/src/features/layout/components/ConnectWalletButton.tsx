"use client";

export default function ConnectWalletButton() {
  // appkit-button es un web component que maneja su propio estado
  return (
    <div className="wallet-button-container flex items-center justify-center">
      <appkit-button />
    </div>
  );
}
