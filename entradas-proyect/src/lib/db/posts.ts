// /lib/posts.ts
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";

export async function fetchPosts() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, content")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
