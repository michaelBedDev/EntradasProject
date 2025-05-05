// // lib/supabase/clientWithSession.ts
// import { createClient } from "@supabase/supabase-js";
// import { generateSupabaseJWT } from "./jwt";
// import { authOptions } from "@/lib/authOptions";
// import { getServerSession } from "next-auth";

// export async function getSupabaseClientForSession() {
//   const session = await getServerSession(authOptions);

//   if (!session?.address) {
//     throw new Error("No wallet address in session.");
//   }

//   const jwt = generateSupabaseJWT(session.address);

//   const supabase = createClient(
//     process.env.SUPABASE_URL!,
//     process.env.SUPABASE_ANON_KEY!,
//     {
//       global: {
//         headers: {
//           Authorization: `Bearer ${jwt}`,
//         },
//       },
//     },
//   );

//   return supabase;
// }

// // Como lo uso de forma real:
// // // features/entradas/services/getEntradas.ts
// // import { getSupabaseClientForSession } from '@/lib/supabase/clientWithSession';

// // export async function getEntradas() {
// //   const supabase = await getSupabaseClientForSession();
// //   const { data, error } = await supabase.from('entradas').select('*');
// //   if (error) throw error;
// //   return data;
// // }
