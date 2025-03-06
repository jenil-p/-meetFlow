import connectDB from "@/app/db/connectDB";
import Conference from "@/app/models/Conference";
import { NextResponse } from "next/server";

connectDB();

export async function GET() {
    try {
        const conferences = await Conference.find({}, { _id: 1, name: 1 });
        return NextResponse.json(conferences, { status: 200 });
    } catch (error) {
        console.error("Error fetching conferences:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}