import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "./crypto";
import { prisma } from "@/lib/prisma";
import { signInSchema } from "@/lib/zod/authentication";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    maxAge: 60 * 60 * 24 * 30,
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { username, password } = await signInSchema.parseAsync(
          credentials
        );

        const user = await prisma.user.findFirst({
          where: {
            username: username,
          },
        });

        if (!user || !user.password) {
          throw new Error("Invalid user.");
        }

        const passwordMatch = compare(password, user.password);

        if (!passwordMatch) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      const protectedPaths = ["/", /^\/master(\/.*)?$/];
      const protectedLogin = ["/login"];

      const isProtectedPath = protectedPaths.some((path: string | RegExp) =>
        typeof path === "string" ? path === pathname : path.test(pathname)
      );

      if (!isLoggedIn && isProtectedPath) {
        return Response.redirect(new URL("/login", nextUrl.origin));
      }

      if (isLoggedIn && protectedLogin.includes(pathname)) {
        return Response.redirect(new URL("/", nextUrl.origin));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub;
      session.user.username = token.username;
      return session;
    },
  },
});
