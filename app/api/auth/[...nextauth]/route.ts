// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { JWT } from "next-auth/jwt";

// Extend session and JWT types
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

// Default role for new users
const DEFAULT_ROLE = "user";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET!,

  callbacks: {
    // Add role to JWT token
    async jwt({ token, user }) {
      if (user) {
        const client = await clientPromise;
        const db = client.db("resolvecore");

        // Ensure user has a role field
        const dbUser = await db.collection("users").findOne({ email: user.email });
        if (!dbUser) {
          // first login (new user) => set default role
          await db.collection("users").updateOne(
            { email: user.email },
            { $set: { role: DEFAULT_ROLE } },
            { upsert: true }
          );
          token.role = DEFAULT_ROLE;
        } else {
          token.role = dbUser.role || DEFAULT_ROLE;
        }

        token.id = dbUser?._id.toString() || user.id;
      }
      return token;
    },

    // Add role to session
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },

    // Redirect users after login
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/auth/sign-in",
    error: "/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
