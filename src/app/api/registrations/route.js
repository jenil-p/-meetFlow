import { NextResponse } from "next/server";
import connectDB from "@/app/db/connectDB";
import Registration from "@/app/models/Registration";
import Session from "@/app/models/Session";
import User from "@/app/models/User";

connectDB();

export async function POST(req) {
    try {
        const { userEmail, sessionId } = await req.json();

        // Validate input
        if (!userEmail || !sessionId) {
            return NextResponse.json({ message: "User email and session ID are required" }, { status: 400 });
        }

        // Check if session exists
        const session = await Session.findById(sessionId);
        if (!session) {
            return NextResponse.json({ message: "Session not found" }, { status: 404 });
        }

        // Check if user exists
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Check if already registered
        const existingRegistration = await Registration.findOne({ user: user._id, session: sessionId });
        if (existingRegistration) {
            return NextResponse.json({ message: "Already registered for this session" }, { status: 400 });
        }

        // Create new registration
        const registration = new Registration({
            user: user._id,
            session: sessionId,
            registeredAt: new Date(),
        });
        await registration.save();

        return NextResponse.json({ message: "Registration successful" }, { status: 201 });
    } catch (error) {
        console.error("Error registering for session:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}