import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/app/db/connectDB";
import Session from "@/app/models/Session";
import User from "@/app/models/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

connectDB();

const isAdmin = async () => {
    const session = await getServerSession(authOptions);
    console.log("Session in isAdmin:", session);
    if (!session || !session.user) {
        throw new Error("Not authenticated");
    }
    if (!session.user.role) {
        await connectDB();
        const dbUser = await User.findOne({ email: session.user.email }).lean();
        if (dbUser) {
            session.user.role = dbUser.role;
        } else {
            throw new Error("User not found in database");
        }
    }
    return { isAdmin: session.user.role === "ADMIN", session };
};

// Create new session - for only the admin
export async function POST(req) {
    try {
        console.log("POST request received:", req);

        // Check role of the user
        const { isAdmin: adminCheck, session } = await isAdmin();
        if (!adminCheck) {
            return new Response(
                JSON.stringify({ message: "Unauthorized: Admin access required" }),
                { status: 403 }
            );
        }

        // Parse the request body
        const body = await req.json();
        const {
            conference,
            title,
            description,
            sessionType,
            speaker,
            startTime,
            endTime,
            room,
            resources,
        } = body;

        // Validate required fields
        if (!conference || !title || !sessionType || !startTime || !endTime) {
            return new Response(
                JSON.stringify({ message: "Missing required fields" }),
                { status: 400 }
            );
        }

        // Validate session type
        const validSessionTypes = ["WORKSHOP", "PRESENTATION", "KEYNOTE"];
        if (!validSessionTypes.includes(sessionType)) {
            return new Response(
                JSON.stringify({ message: "Invalid session type" }),
                { status: 400 }
            );
        }

        // Validate ObjectIds for conference and room (if provided)
        if (!mongoose.Types.ObjectId.isValid(conference)) {
            return new Response(
                JSON.stringify({ message: "Invalid conference ID" }),
                { status: 400 }
            );
        }
        if (room && !mongoose.Types.ObjectId.isValid(room)) {
            return new Response(
                JSON.stringify({ message: "Invalid room ID" }),
                { status: 400 }
            );
        }

        // Fetch the user to get the ID for createdBy
        const dbUser = await User.findOne({ email: session.user.email }).lean();
        if (!dbUser) {
            return new Response(
                JSON.stringify({ message: "User not found" }),
                { status: 404 }
            );
        }
        const createdBy = dbUser._id;

        // Create a new session
        const newSession = new Session({
            conference,
            title,
            description,
            sessionType,
            speaker,
            startTime,
            endTime,
            room,
            createdBy,
            resources: resources || [],
        });

        // Save the session to the database
        await newSession.save();

        return new Response(
            JSON.stringify({ message: "Session created successfully", session: newSession }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating session:", error);
        return new Response(
            JSON.stringify({ message: "Server error", error: error.message }),
            { status: 500 }
        );
    }
}

// GET: Fetch all sessions (accessible to both users and admins)
export async function GET() {
    try {
        const sessions = await Session.find()
            .populate("conference", "name")
            .populate("room", "roomNumber")
            .populate("createdBy", "name")
            .populate("resources.resource", "name");
        return NextResponse.json(sessions, { status: 200 });
    } catch (error) {
        console.error("Error fetching sessions:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}

// PUT: Update a session by ID (admin only)
export async function PUT(req) {
    try {
        const { isAdmin: adminCheck } = await isAdmin();
        if (!adminCheck) {
            return new Response(
                JSON.stringify({ message: "Unauthorized: Admin access required" }),
                { status: 403 }
            );
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return new Response(
                JSON.stringify({ message: "Invalid session ID" }),
                { status: 400 }
            );
        }

        const body = await req.json();
        const {
            conference,
            title,
            description,
            sessionType,
            speaker,
            startTime,
            endTime,
            room,
            resources,
        } = body;

        if (sessionType) {
            const validSessionTypes = ["WORKSHOP", "PRESENTATION", "KEYNOTE"];
            if (!validSessionTypes.includes(sessionType)) {
                return new Response(
                    JSON.stringify({ message: "Invalid session type" }),
                    { status: 400 }
                );
            }
        }

        if (conference && !mongoose.Types.ObjectId.isValid(conference)) {
            return new Response(
                JSON.stringify({ message: "Invalid conference ID" }),
                { status: 400 }
            );
        }
        if (room && !mongoose.Types.ObjectId.isValid(room)) {
            return new Response(
                JSON.stringify({ message: "Invalid room ID" }),
                { status: 400 }
            );
        }

        const updatedSession = await Session.findByIdAndUpdate(
            id,
            {
                conference,
                title,
                description,
                sessionType,
                speaker,
                startTime,
                endTime,
                room,
                resources,
            },
            { new: true, runValidators: true }
        );

        if (!updatedSession) {
            return new Response(
                JSON.stringify({ message: "Session not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: "Session updated successfully", session: updatedSession }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating session:", error);
        return new Response(
            JSON.stringify({ message: "Server error", error: error.message }),
            { status: 500 }
        );
    }
}

// DELETE: Remove a session by ID (admin only)
export async function DELETE(req) {
    try {
        const { isAdmin: adminCheck } = await isAdmin();
        if (!adminCheck) {
            return new Response(
                JSON.stringify({ message: "Unauthorized: Admin access required" }),
                { status: 403 }
            );
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return new Response(
                JSON.stringify({ message: "Invalid session ID" }),
                { status: 400 }
            );
        }

        const deletedSession = await Session.findByIdAndDelete(id);

        if (!deletedSession) {
            return new Response(
                JSON.stringify({ message: "Session not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: "Session deleted successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting session:", error);
        return new Response(
            JSON.stringify({ message: "Server error", error: error.message }),
            { status: 500 }
        );
    }
}