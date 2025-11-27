import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    username?: string | null;
    bio?: string | null;
    image?: string | null;
  }
}
