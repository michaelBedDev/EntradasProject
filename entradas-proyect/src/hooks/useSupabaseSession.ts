// src/hooks/useDbClient.ts
"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { getDbClient } from "@/lib/supabase/postgrestClient";

export function useDbClient() {
  const { data: session } = useSession();
  // session.supabaseToken es tu JWT custom
  return useMemo(
    () => getDbClient(session?.supabaseAccessToken),
    [session?.supabaseAccessToken],
  );
}
