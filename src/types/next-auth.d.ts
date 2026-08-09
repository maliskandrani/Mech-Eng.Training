import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "TRAINER" | "STUDENT";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "ADMIN" | "TRAINER" | "STUDENT";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "ADMIN" | "TRAINER" | "STUDENT";
  }
}
