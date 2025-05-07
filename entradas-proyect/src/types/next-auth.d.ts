import { User as DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    address?: string;
    supabaseToken?: string;
    supabaseTokenExp?: number;
  }

  interface User extends DefaultUser {
    address: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    address?: string;
  }
}
