import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/app/db/connectDB";
import Registration from "@/app/models/Registration";
import Session from "@/app/models/Session";
import User from "@/app/models/User";

connectDB();

export async function DELETE(request) {
      try {
    
        const { id } = await request.json();
        if (!id) {
          return NextResponse.json({ message: "registration ID is required" }, { status: 400 });
        }
    
        const registration = await Registration.findByIdAndDelete(id);
        if (!registration) {
          return NextResponse.json({ message: "registration not found" }, { status: 404 });
        }
    
        return NextResponse.json({ message: "registration deleted successfully" }, { status: 200 });
      } catch (error) {
        console.error("Error deleting registration:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
      }
}

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

export async function GET(req) {
    try {
        await connectDB();
        console.log("Fetching registrations...");

        // Extract userId from query parameters
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("id");
        const fields = searchParams.get("fields"); // Optional: to control returned fields

        // Validate userId
        if (!userId) {
            return NextResponse.json(
                { message: "User ID is required" },
                { status: 400 }
            );
        }

        // Determine if userId is a MongoDB ObjectId
        let user;
        if (mongoose.Types.ObjectId.isValid(userId)) {
            // If userId is a valid ObjectId, query by _id
            user = await User.findById(userId);
        } else {
            // Otherwise, assume it's a googleId or githubId
            user = await User.findOne({
                $or: [{ googleId: userId }, { githubId: userId }],
            });
        }

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Fetch registrations for the user
        let registrations;
        if (fields === "minimal") {
            // Fetch minimal fields (e.g., session title and status)
            registrations = await Registration.find({ user: user._id })
                .populate("session", "title")
                .select("status registeredAt")
                .lean();
        } else {
            // Fetch all fields with populated session
            registrations = await Registration.find({ user: user._id })
                .populate("session", "title startTime endTime")
                .lean();
        }

        console.log("Registrations fetched:", registrations.length);

        if (!registrations || registrations.length === 0) {
            return NextResponse.json(
                { message: "No registrations found for this user" },
                { status: 404 }
            );
        }

        return NextResponse.json(registrations, { status: 200 });
    } catch (error) {
        console.error("Error fetching registrations:", error);
        return NextResponse.json(
            { message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}