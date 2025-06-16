"use client";

import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

export function SearchBar({ query = "" }: { query?: string }) {
  return (
    <div className="mb-12">
      <form
        action="/eventos"
        method="get"
        className="flex w-full max-w-lg mx-auto rounded-xl overflow-hidden border shadow-sm focus-within:ring-2 focus-within:ring-primary/50">
        <div className="flex-1 flex items-center">
          <SearchIcon className="text-muted-foreground ml-4 mr-2 h-5 w-5" />
          <input
            type="text"
            name="query"
            defaultValue={query}
            placeholder="Buscar eventos..."
            className="flex-grow max-w-[136px] sm:max-w-none outline-none bg-transparent"
          />
        </div>
        <div className="flex items-stretch">
          <Button type="submit" className="rounded-l-none py-6 px-6 cursor-pointer">
            Buscar
          </Button>
        </div>
      </form>
    </div>
  );
}
