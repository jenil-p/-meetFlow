import { NextResponse } from "next/server";
import connectDB from "@/app/db/connectDB";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
    await connectDB();

    try {
        const { name, email, password } = await req.json();

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: "USER", // Default role for new users
            username: name,
        });
        await newUser.save();

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error registering user:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}