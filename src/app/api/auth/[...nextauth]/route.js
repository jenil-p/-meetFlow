// /src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/app/db/connectDB";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

export const authOptions = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (user && user.password) {
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (isValid) {
            return user;
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      await connectDB();
      const currentUser = await User.findOne({ email: user.email });
      if (!currentUser) {
        const newUser = new User({
          name: user.name || profile?.name || user.email.split("@")[0],
          email: user.email,
          password: credentials?.password ? await bcrypt.hash(credentials.password, 10) : undefined,
          role: "USER",
          username: user.email.split("@")[0],
          createdAt: new Date(),
        });
        await newUser.save();
      }
      return true;
    },
    async session({ session, token }) {
      // Minimize database calls by relying on token if possible
      if (token?.sub) {
        session.user.id = token.sub; // Use token sub as a unique identifier
      }
      // Fetch role only if not already in token (optional optimization)
      if (!session.user.role) {
        await connectDB();
        const dbUser = await User.findOne({ email: session.user.email }, "role username").lean();
        if (dbUser) {
          session.user.role = dbUser.role;
          session.user.name = dbUser.username;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});

export { authOptions as GET, authOptions as POST };