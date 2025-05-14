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

export const authOptions: AuthOptions = {
  secret: NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const { email, password } = credentials || {};
        if (!email || !password) {
          return null;
        }

        const credentialResponse = await fetch(
          `${process.env.BASE_URL}/verify-credential?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          }
        );

        if (!credentialResponse.ok || credentialResponse.status !== 202) {
          return null;
        }

        const body = await credentialResponse.json();
        if (!body.data) {
          return null;
        }
        const token = body.data;
        if (!token) {
          return null;
        }
        return { id: token, name: token, email: token };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: [
            "openid",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email"
          ].join(" ")
        }
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 15 * 60 // 15 minutes
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in"
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
