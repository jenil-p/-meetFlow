import { NextResponse } from "next/server";
import Conference from "@/app/models/Conference";

export async function GET(req) {
    try {
        const conferences = await Conference.find().select("name startDate endDate"); // Explicitly select required fields
        return NextResponse.json(conferences, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching conferences", error: error.message }, { status: 500 });
    }
}