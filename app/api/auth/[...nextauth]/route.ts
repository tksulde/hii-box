/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
import credentialsProvider from "next-auth/providers/credentials";
import {
  type SIWESession,
  getChainIdFromMessage,
  getAddressFromMessage,
} from "@reown/appkit-siwe";
import { createPublicClient, http } from "viem";

declare module "next-auth" {
  interface Session extends SIWESession {
    address: string;
    chainId: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    backendToken?: any;
  }
}

const nextAuthSecret = process.env.NEXTAUTH_SECRET;
if (!nextAuthSecret) throw new Error("NEXTAUTH_SECRET is not set");

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) throw new Error("NEXT_PUBLIC_PROJECT_ID is not set");

const providers = [
  credentialsProvider({
    name: "Ethereum",
    credentials: {
      message: { label: "Message", type: "text", placeholder: "0x0" },
      signature: { label: "Signature", type: "text", placeholder: "0x0" },
    },
    async authorize(credentials) {
      try {
        if (!credentials?.message || !credentials?.signature) {
          throw new Error("Missing credentials");
        }

        const { message, signature } = credentials;
        const address = getAddressFromMessage(message);
        const chainId = getChainIdFromMessage(message);

        // ✅ Signature verification
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
          console.error("❌ Invalid signature");
          return null;
        }

        console.log("✅ Signature verified:", address);

        const bodyyy = JSON.stringify({
          wallet_address: address,
          signed_message: signature,
        });

        // ✅ Optional: call your FastAPI backend for login and JWT
        const backendRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: bodyyy,
          }
        );

        console.log("backendRes ->", await backendRes.json());

        if (!backendRes.ok) {
          console.error("❌ Backend login failed");
          return null;
        }

        const { access_token, refresh_token } = await backendRes.json();

        return {
          id: `${chainId}:${address}`,
          backendToken: access_token, // 💡 pass token to session
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
    session({ session, token }) {
      if (token.sub) {
        const [, chainId, address] = token.sub.split(":");
        session.address = address;
        session.chainId = parseInt(chainId, 10);
      }
      if (token.backendToken) {
        session.backendToken = token.backendToken;
      }
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.backendToken = (user as any).backendToken;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
