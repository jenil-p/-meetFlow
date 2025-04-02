import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/app/db/connectDB";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

// Define the auth options
const authOptions = {
  providers: [
    GitHubProvider({
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
        try {
          await connectDB();
          const user = await User.findOne({ email: credentials.email });
          if (user && user.password) {
            const isValid = await bcrypt.compare(credentials.password, user.password);
            if (isValid) {
              return { id: user._id, name: user.username, email: user.email, role: user.role };
            }
          }
          return null;
        } catch (error) {
          console.error("Error in authorize:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
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
          } else if (account?.provider === "github" && !currentUser.githubId) {
            currentUser.githubId = account.providerAccountId;
            await currentUser.save();
          }
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      try {
        await connectDB();
        const dbUser = await User.findOne({ email: session.user.email }, "role username _id").lean();
        if (dbUser) {
          session.user.id = dbUser._id.toString();
          session.user.role = dbUser.role;
          session.user.name = dbUser.username;
        }
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export the handler for GET and POST requests
export { handler as GET, handler as POST, authOptions };

export async function OPTIONS(req) {
  const allowedOrigins = [
      "http://localhost:3000", // Allow during development
      "https://yourfrontend.com", // Replace with your actual frontend domain
  ];

  const origin = req.headers.get("origin");

  return new Response(null, {
      status: 200,
      headers: {
          "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "https://yourfrontend.com",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
  });
}
