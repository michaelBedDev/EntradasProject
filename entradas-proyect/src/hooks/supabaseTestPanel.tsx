"use client";

import { useSupabaseTest } from "@/hooks/use-supabase-test";

export default function SupabaseTestPanel() {
  const { callAPI, output, loading } = useSupabaseTest();

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold">🧪 Pruebas Supabase (Service Role)</h2>

      <div className="grid grid-cols-1 gap-3">
        {/* Crear usuario admin */}
        <button
          onClick={() =>
            callAPI("create-user", {
              wallet: "0xADMIN123456",
              nombre: "Admin Test",
              rol: "administrador",
              email: "test@localhost.com",
            })
          }
          className="px-4 py-2 bg-blue-600 text-white rounded">
          Crear usuario admin
        </button>

        {/* Crear evento */}
        <button
          onClick={() =>
            callAPI("create-event", {
              titulo: "Test Evento",
              descripcion: "Un evento de prueba",
              fecha: new Date().toISOString(),
              lugar: "Teatro Principal",
              imagen_uri: "https://example.com/imagen.jpg",
              organizador_wallet: "0xADMIN123456",
            })
          }
          className="px-4 py-2 bg-green-600 text-white rounded">
          Crear evento
        </button>

        {/* Crear tipo de entrada */}
        <button
          onClick={() =>
            callAPI("create-ticket-type", {
              evento_id: 1, // cambia por un ID real si hace falta
              nombre: "Entrada General",
              descripcion: "Entrada estándar",
              precio: 15.0,
              cantidad: 100,
              zona: "Platea",
            })
          }
          className="px-4 py-2 bg-purple-600 text-white rounded">
          Crear tipo de entrada
        </button>

        {/* Crear entrada */}
        <button
          onClick={() =>
            callAPI("create-ticket", {
              wallet: "0xUSERABCDEF",
              tipo_entrada_id: 1, // cambia por un ID real si hace falta
              token: "token-abc123",
              metadata_uri: "https://example.com/meta.json",
              qr_code: "qr-code-123",
              qr_image_uri: "https://example.com/qr.png",
              estado: "emitida",
              tx_hash: "0x1234abcd",
            })
          }
          className="px-4 py-2 bg-red-600 text-white rounded">
          Crear entrada (ticket)
        </button>
      </div>

      {loading && <p className="text-gray-500">⏳ Cargando...</p>}

      {output && (
        <pre className="mt-4 p-4 text-sm border rounded whitespace-pre-wrap break-words">
          Acción: {output.action}
          {"\n"}
          {JSON.stringify(output.data, null, 2)}
        </pre>
      )}
    </div>
  );
}
