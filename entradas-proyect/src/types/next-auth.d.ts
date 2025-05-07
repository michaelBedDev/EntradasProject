import { DefaultSession, User as DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    address?: string;
    supabaseToken?: string;
    user: {
      name?: string;
      email?: string;
      image?: string;
    };
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
