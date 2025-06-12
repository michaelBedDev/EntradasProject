// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";

import { authOptions } from "@/features/auth/lib/auth";

const nextAuthSecret = process.env.NEXTAUTH_SECRET;
if (!nextAuthSecret) {
  throw new Error("NEXTAUTH_SECRET is not set");
}

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error("NEXT_PUBLIC_PROJECT_ID is not set");
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
