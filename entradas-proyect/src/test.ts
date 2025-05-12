// import { NextResponse, NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(req: NextRequest) {
//   const res = NextResponse.next();
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });

//   const supabaseToken = token?.supabaseAccessToken as string | undefined;
//   const tokenExp = token?.supabaseAccessTokenExp as number | undefined;

//   if (supabaseToken && tokenExp) {
//     const maxAge = tokenExp - Math.floor(Date.now() / 1000);

//     res.cookies.set({
//       name: "sb-access-token",
//       value: supabaseToken,
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge: maxAge > 0 ? maxAge : 0,
//     });
//   } else {
//     res.cookies.delete("sb-access-token");
//   }

//   return res;
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };
