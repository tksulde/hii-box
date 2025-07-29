import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { SIWESession } from "@reown/appkit-siwe";

interface UserData {
  id: number;
  wallet_address?: string;
  username?: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  role: "user" | "admin";
}

interface ExtendedUser {
  id: string;
  user: UserData;
}

declare module "next-auth" {
  interface Session extends SIWESession {
    address?: string;
    chainId?: number;
    user: UserData;
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  }

  interface User extends ExtendedUser {}
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessTokenExpires?: number;
    user?: UserData;
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  }
}
