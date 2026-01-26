import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/user'; // Ensure this model exists
import Company from '@/models/company';
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;
      
      await connectDB();
      
      // Find or create user
      let dbUser = await User.findOne({ email: user.email });
      
      if (!dbUser) {
        dbUser = await User.create({
          email: user.email,
          name: user.name,
          image: user.image,
          googleId: account?.providerAccountId,
        });
      } else if (!dbUser.googleId && account?.providerAccountId) {
        dbUser.googleId = account.providerAccountId;
        await dbUser.save();
      }
      
      return true;
    },
    async jwt({ token, user, account }) {
      // This runs on initial sign-in
      if (user && account) {
        await connectDB();
        
        // Find the user in the database to get their MongoDB _id
        const dbUser = await User.findOne({ email: user.email });
        
        if (dbUser) {
          // IMPORTANT: Store the MongoDB _id in the token
          token.id = dbUser._id.toString();
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        // Use the MongoDB _id from the token
        session.user.id = token.id;
        
        // Now, this will work correctly because token.id is the MongoDB _id
        await connectDB();
        const company = await Company.findOne({ owner: token.id });
        session.user.companyId = company?._id?.toString() || null;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET!,
};