// app/page.tsx — LANDING PAGE `/`
import Link from "next/link";

export default function LandingPage() {
  return (
    <section className="h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold">Bienvenido a Entradas Proyect</h1>
      <p className="mt-4 text-lg">Gestiona y explora eventos fácilmente.</p>

      {/* Formulario de búsqueda */}
      <form
        action="/explorar-eventos"
        method="get"
        className="mt-6 flex w-full max-w-md gap-2">
        <input
          type="text"
          name="query"
          placeholder="Buscar eventos..."
          className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Buscar
        </button>
      </form>

      {/* Opción de ir al Dashboard */}
      <Link
        href="/app"
        className="mt-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
        Ir al Dashboard
      </Link>
    </section>
  );
}
