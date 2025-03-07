import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/app/db/connectDB";
import User from "@/app/models/User";
import bcrypt from "bcryptjs"; // For password hashing

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
            console.log("SignIn User:", user, "Profile:", profile, "Credentials:", credentials);
            const currentUser = await User.findOne({ email: user.email });
            if (!currentUser) {
                const newUser = new User({
                    name: user.name || profile?.name || user.email.split("@")[0],
                    email: user.email,
                    password: credentials?.password ? bcrypt.hash(credentials.password, 10) : undefined, // Hash password if provided
                    role: account.provider === "google" ? "ADMIN" : "USER", // Example: Google users as admins (adjust as needed)
                    username: user.email.split("@")[0],
                    createdAt: new Date(),
                });
                await newUser.save();
                console.log("New user created:", newUser);
            } else {
                console.log("Existing user found:", currentUser);
            }
            return true;
        },
        async session({ session, user, token }) {
            await connectDB();
            console.log("Session callback - initial session:", session);
            const dbUser = await User.findOne({ email: session.user.email }).lean();
            if (dbUser) {
                session.user.role = dbUser.role;
                session.user.name = dbUser.username;
                console.log("User found in DB:", dbUser);
                console.log("Session after role assignment:", session);
            } else {
                console.error("User not found in database:", session.user.email);
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login", // Custom login page (if you have one)
    },
});

export { authOptions as GET, authOptions as POST };