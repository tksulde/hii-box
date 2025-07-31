import NextAuth from "next-auth";
import credentialsProvider from "next-auth/providers/credentials";
import {
  getChainIdFromMessage,
  getAddressFromMessage,
} from "@reown/appkit-siwe";
import { createPublicClient, http } from "viem";
import { ExtendedUser } from "@/types/next-auth";
import axios from "axios";
import { JWT } from "next-auth/jwt";

const nextAuthSecret = process.env.NEXTAUTH_SECRET;
if (!nextAuthSecret) throw new Error("NEXTAUTH_SECRET is not set");

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) throw new Error("NEXT_PUBLIC_PROJECT_ID is not set");

async function refreshAccessToken(token: JWT) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/refresh`,
      {
        refresh_token: token.refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    const refreshedTokens = response.data;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: token.refreshToken,
      accessTokenExpires: Date.now() + 14 * 60 * 1000,
      error: undefined,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);

    if (axios.isAxiosError(error)) {
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
    }

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

const providers = [
  credentialsProvider({
    id: "user-login",
    name: "Ethereum",
    credentials: {
      message: { label: "Message", type: "text", placeholder: "0x0" },
      signature: { label: "Signature", type: "text", placeholder: "0x0" },
    },
    async authorize(credentials): Promise<ExtendedUser | null> {
      try {
        if (!credentials?.message || !credentials?.signature) {
          throw new Error("Missing credentials");
        }

        const { message, signature } = credentials;
        const address = getAddressFromMessage(message);
        const chainId = getChainIdFromMessage(message);

        const publicClient = createPublicClient({
          transport: http(
            `https://rpc.walletconnect.org/v1/?chainId=${chainId}&projectId=${projectId}`
          ),
        });

        const isValid = await publicClient.verifyMessage({
          message,
          address: address as `0x${string}`,
          signature: signature as `0x${string}`,
        });

        if (!isValid) {
          console.error("Invalid signature");
          return null;
        }

        const bodyyy = JSON.stringify({
          wallet_address: address,
          signed_message: signature,
          message,
        });

        const backendRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: bodyyy,
          }
        );

        if (!backendRes.ok) {
          const errorText = await backendRes.text();
          console.error("Backend login failed:", errorText);
          return null;
        }

        const user = await backendRes.json();

        return {
          id: `${chainId}:${address}`,
          user: {
            id: user.id,
            wallet_address: user.wallet_address,
            username: user.username,
            token: user.access_token,
            refreshToken: user.refresh_token,
            role: user.role || "user",
          },
        };
      } catch (e) {
        console.error("authorize() error:", e);
        return null;
      }
    },
  }),
  credentialsProvider({
    id: "admin-login",
    name: "Admin Login",
    credentials: {
      username: { label: "Username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials): Promise<ExtendedUser | null> {
      try {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const { username, password } = credentials;

        const bodyyy = JSON.stringify({ username, password });

        const backendRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/admin-login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: bodyyy,
          }
        );

        if (!backendRes.ok) {
          const errorText = await backendRes.text();
          console.error("Backend admin login failed:", errorText);
          return null;
        }

        const user = await backendRes.json();

        return {
          id: user.id,
          user: {
            id: user.id,
            username: user.username,
            token: user.access_token,
            refreshToken: user.refresh_token,
            role: user.role || "admin",
          },
        };
      } catch (e) {
        console.error("authorize() error:", e);
        return null;
      }
    },
  }),
];

const handler = NextAuth({
  secret: nextAuthSecret,
  providers,
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (token.error === "RefreshAccessTokenError") {
        return { ...session, error: "RefreshAccessTokenError" };
      }

      if (token.sub && token.sub.includes(":")) {
        const [, chainId, address] = token.sub.split(":");
        session.address = address;
        session.chainId = parseInt(chainId, 10);
      }

      if (token.user) {
        session.user = token.user;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user?.user) {
        return {
          ...token,
          accessToken: user.user.token,
          refreshToken: user.user.refreshToken,
          accessTokenExpires: Date.now() + 14 * 60 * 1000,
          user: user.user,
        };
      }

      if (token.error) {
        console.log("Token has error:", token.error);
        return token;
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token);
    },
  },
  pages: {
    signIn: "/manage",
    error: "/manage",
  },
});

export { handler as GET, handler as POST };
