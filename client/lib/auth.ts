import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import type { AuthOptions } from "next-auth";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse
} from "next";
import { getServerSession } from "next-auth";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET as string;
const VERIFY_USER_URL = `${process.env.BASE_URL}/verify-user`;
const SEND_OTP_URL = `${process.env.BASE_URL}/send-otp-email`;

export const authOptions: AuthOptions = {
  secret: NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};
        if (!email || !password) return null;

        try {
          const verifyRes = await fetch(VERIFY_USER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
          });

          const user = await verifyRes.json();
          if (!verifyRes.ok || !user.token) return null;

          const token = user.token;
          await fetch(SEND_OTP_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          });
          return { id: token, email };
        } catch {
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    })
  ],
  session: {
    maxAge: 12 * 60 * 60, // 12 hours in seconds
    strategy: "jwt" // Use JWT-based session strategy
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        token.accessToken = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.accessToken) {
        return {
          ...session,
          accessToken: token.accessToken
        };
      }
      return session;
    }
  }
};

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}
