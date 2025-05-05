// hooks/useSupabaseTest.ts
// hooks/useSupabaseTest.ts
import { useState } from "react";
import axios from "axios";

export function useSupabaseTest() {
  const [output, setOutput] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function callAPI(action: string, body: any) {
    setLoading(true);
    try {
      const res = await axios.post(`/api/supabase-test/${action}`, body);
      setOutput({ action, data: res.data });
    } catch (err: any) {
      setOutput({ action, data: err.response?.data || err.message });
    } finally {
      setLoading(false);
    }
  }

  return { callAPI, output, loading };
}
