// // app/(user)/explorar-eventos/page.tsx
// import { headers } from "next/headers";
// import EventosClient from "./EventosClient";
// // import { getEventosByName } from "@/app/actions/db/events";

// export const dynamic = "force-dynamic"; // opcional, pero mantiene la página dinámica

// interface Props {
//   searchParams: Promise<{ query?: string }>;
// }

// // export default async function ExplorarEventosPage({ searchParams }: Props) {
// //   /* 1) Filtramos el HEAD de prefetch */
// //   const h = await headers(); // algunas versiones requieren await
// //   if (h.get("next-router-prefetch") === "1" || h.get("purpose") === "prefetch") {
// //     return null; // ⇢ sin llamada a la BD
// //   }

// //   /* 2) Consulta real - ahora solo obtenemos los eventos aprobados con info de organizador */
// //   // const params = await searchParams;
// //   // const q = params.query?.trim() ?? "";
// //   // const eventos = await getEventosByName(q);

// //   /* 3) UI cliente */
// //   // return <EventosClient eventos={eventos} q={q} />;
// // }
export default function page() {
  return <div>page</div>;
}
