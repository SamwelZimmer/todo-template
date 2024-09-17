import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare, hash } from "bcrypt";

import { db } from "@/lib/db";

// NOTE -> can't log in with different providers which are linked to same email address

interface NextAuthOptionsExtended extends NextAuthOptions {
  adapter?: any;
}
export const authOptions: NextAuthOptionsExtended = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(db),

  pages: {
    signIn: "/enter",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",

      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name ? profile.given_name : profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",

      async profile(profile) {
        return {
          id: `${profile.id}`,
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),

    CredentialsProvider({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter Password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // find user in db
        const existingUser = await db.user.findUnique({
          where: { email: credentials.email },
        });

        // create user
        if (!existingUser) {
          const hashedPassword = await hash(credentials.password, 10);

          const newUser = await db.user.create({
            data: {
              email: credentials.email,
              password: hashedPassword,
            },
          });

          return {
            id: newUser.id,
            email: newUser.email,
          };
        }

        if (!existingUser.password) return null;

        // check users password
        const isValid = await compare(
          credentials.password,
          existingUser.password
        );

        if (!isValid) return null;

        // return something
        return {
          id: existingUser.id,
          email: existingUser.email,
        };
      },
    }),
  ],

  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
