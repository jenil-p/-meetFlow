import connectDB from "@/app/db/connectDB";
import Room from "@/app/models/Room";
import { NextResponse } from "next/server";

connectDB();

export async function GET() {
    try {
        const rooms = await Room.find({}, { _id: 1, roomNumber: 1 });
        return NextResponse.json(rooms, { status: 200 });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}