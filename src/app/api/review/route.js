import { NextResponse } from "next/server";
import mongoose from "mongoose";
import "@/app/models/index.js";
import connectDB from "@/app/db/connectDB";
import Review from "@/app/models/Review";
import Session from "@/app/models/Session";
import User from "@/app/models/User";
import { getToken } from "next-auth/jwt";

export async function POST(req) {

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.name) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }
    try {
        await connectDB();

        const body = await req.json();
        const { userId, sessionId, rating, comment } = body;

        // All fields are required
        if (!userId || !sessionId || !rating) {
            return NextResponse.json(
                { message: "User Id, session ID, and rating are required" },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { message: "Rating must be between 1 and 5" },
                { status: 400 }
            );
        }

        // Find user by _id (since userId is now the MongoDB _id)
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Session valid
        const session = await mongoose.models.Session.findById(sessionId);
        if (!session) {
            return NextResponse.json({ message: "Session not found" }, { status: 404 });
        }

        // User valid for session
        const registration = await mongoose.models.Registration.findOne({
            user: user._id,
            session: sessionId,
        });
        if (!registration) {
            return NextResponse.json(
                { message: "User is not registered for this session" },
                { status: 403 }
            );
        }

        // Can write review after ending the session
        const currentDate = new Date();
        if (new Date(session.endTime) > currentDate) {
            return NextResponse.json(
                { message: "Cannot write a review until the session has ended" },
                { status: 403 }
            );
        }

        const review = new mongoose.models.Review({
            user: user._id,
            session: sessionId,
            rating,
            comment,
            createdAt: new Date(),
        });

        await review.save();

        return NextResponse.json(
            { message: "Review submitted successfully", review },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json(
            { message: "Error creating review", error: error.message },
            { status: 500 }
        );
    }
}

export async function GET(req) {

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.name) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }
    try {
        await connectDB();
        console.log("fetching reviews...");
        const reviews = await Review.find()
            .populate("user", "username email")
            .populate("session", "title");
        console.log("reviews fetched: ", reviews.length);
        return NextResponse.json(reviews, { status: 200 });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json(
            { message: "Error fetching reviews", error: error.message },
            { status: 500 }
        );
    }
}
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
