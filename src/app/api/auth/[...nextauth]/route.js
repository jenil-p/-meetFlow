import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/app/db/connectDB";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

export const authOptions = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
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
      let currentUser = await User.findOne({ email: user.email });
      if (!currentUser) {
        currentUser = new User({
          username: user.name || profile?.name || user.email.split("@")[0],
          email: user.email,
          password: credentials?.password ? await bcrypt.hash(credentials.password, 10) : undefined,
          role: "USER",
          createdAt: new Date(),
          googleId: account?.provider === "google" ? account.providerAccountId : undefined,
          githubId: account?.provider === "github" ? account.providerAccountId : undefined,
        });
        await currentUser.save();
      } else {
        // Update googleId or githubId if not set
        if (account?.provider === "google" && !currentUser.googleId) {
          currentUser.googleId = account.providerAccountId;
          await currentUser.save();
        }
         else if (account?.provider === "github" && !currentUser.githubId) {
          currentUser.githubId = account.providerAccountId;
          await currentUser.save();
        }
      }
      return true;
    },
    async session({ session, token }) {
      await connectDB();
      const dbUser = await User.findOne({ email: session.user.email }, "role username _id").lean();
      if (dbUser) {
        session.user.id = dbUser._id.toString(); // Set session.user.id to MongoDB _id
        session.user.role = dbUser.role;
        session.user.name = dbUser.username;
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