// app/not-found.tsx
"use client"; // <-- ES CLIENTE
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100">404</h1>
      <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
        Lo sentimos, la página que buscas no existe.
      </p>
      <button
        className="mt-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        onClick={() => router.push("/")}>
        Volver al Dashboard
      </button>
    </div>
  );
}
