import connectDB from "@/app/db/connectDB";
import Resource from "@/app/models/Resource";
import { NextResponse } from "next/server";

connectDB();

export async function GET() {
    try {
        const resources = await Resource.find({}, { _id: 1, name: 1 });
        return NextResponse.json(resources, { status: 200 });
    } catch (error) {
        console.error("Error fetching resources:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}