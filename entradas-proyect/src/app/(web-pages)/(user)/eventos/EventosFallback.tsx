// EventosFallback.tsx

import EventoCardSkeleton from "./EventoCardSkeleton";

export default function EventosFallback() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <EventoCardSkeleton key={i} />
      ))}
    </div>
  );
}
