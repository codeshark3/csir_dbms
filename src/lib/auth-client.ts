import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  //local
  // baseURL: "http://localhost:3000",
  //vercel
  baseURL: process.env.BETTER_AUTH_URL,
  // the base url of your auth server
  plugins: [adminClient()],
});
export const { signIn, signUp, useSession } = createAuthClient();
