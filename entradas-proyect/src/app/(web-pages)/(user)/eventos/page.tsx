import { Suspense } from "react";
import EventosWrapper from "./EventosWrapper";
import EventosFallback from "./EventosFallback";

interface Props {
  searchParams: Promise<{ query?: string }>;
}

export default function page({ searchParams }: Props) {
  return (
    <Suspense fallback={<EventosFallback />}>
      <EventosWrapper searchParams={searchParams} />
    </Suspense>
  );
}
