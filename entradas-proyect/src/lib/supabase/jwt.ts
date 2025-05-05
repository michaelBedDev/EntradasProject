// // lib/supabase/jwt.ts
// import jwt from "jsonwebtoken";

// export function generateSupabaseJWT(walletAddress: string): string {
//   const payload = {
//     wallet: walletAddress.toLowerCase(), // o "sub": walletAddress, si prefieres usar auth.uid()
//     iat: Math.floor(Date.now() / 1000),
//     exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hora
//     iss: "tu-dominio.com",
//   };

//   return jwt.sign(payload, process.env.SUPABASE_JWT_SECRET!, {
//     algorithm: "HS256",
//   });
// }
