import { Client, auth } from "twitter-api-sdk";

export function createTwitterClient(accessToken: string) {
  const authClient = new auth.OAuth2User({
    client_id: process.env.TWITTER_CLIENT_ID!,
    client_secret: process.env.TWITTER_CLIENT_SECRET!,
    callback: `${process.env.NEXTAUTH_URL}/api/auth/callback/twitter`,
    token: accessToken,
    scopes: ["tweet.read", "users.read", "bookmark.read"],
  });

  return new Client(authClient);
} 