import { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt"; // eslint-disable-line

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }

  interface User {
    username: string;
    password: string;
    groupid?: number;
    // verifiedUser: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
    username: string;
    groupid: number;
    // verifiedUser: boolean;
  }
}
