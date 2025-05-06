// lib/supabase/useSupabaseClient.ts
import { useSession } from "next-auth/react";
import { createClient } from "@/lib/supabase/clientFront";

export function useSupabaseClient() {
  const { data: session } = useSession();
  return createClient(session?.supabaseToken);
}
