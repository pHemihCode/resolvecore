// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions, type Session } from "next-auth"; // 1. Import Options and Session
import GoogleProvider from "next-auth/providers/google";

// 2. Type the config object as NextAuthOptions
const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // 3. TypeScript now knows 'session' and 'token' types automatically!
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export { authOptions };