import NextAuth, { NextAuthOptions } from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0", // Specify OAuth 2.0 if supported
    }),
  ],
  callbacks: {
    // Include accessToken (and user id if available) in JWT
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = profile?.id_str || profile?.id;
      }
      return token;
    },
    // Make the token accessible in session
    async session({ session, token }) {
      session.user.accessToken = token.accessToken as string;
      session.user.id = token.id as string;
      return session;
    },
  },
};

export default NextAuth(authOptions);
