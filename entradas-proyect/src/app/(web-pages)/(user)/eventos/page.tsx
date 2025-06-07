import EventosWrapper from "../../../../features/eventos/components/EventosWrapper";

interface Props {
  searchParams: Promise<{ query?: string }>;
}

export default function page({ searchParams }: Props) {
  return <EventosWrapper searchParams={searchParams} />;
}
