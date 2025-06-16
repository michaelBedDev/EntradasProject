import { use } from "react";
import EventosList from "@/features/eventos/components/EventosList";
import { SearchBar } from "@/features/layout/components/SearchBar";

interface Props {
  searchParams: Promise<{
    query?: string;
    categoria?: string;
  }>;
}

export default function EventosPage({ searchParams }: Props) {
  const params = use(searchParams);
  const { query = "", categoria } = params;

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <SearchBar query={query} />
      <EventosList query={query} categoria={categoria} />
    </div>
  );
}
