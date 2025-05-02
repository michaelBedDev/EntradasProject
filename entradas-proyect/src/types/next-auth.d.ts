import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    address?: string;
    user: {
      name?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
  }
}
