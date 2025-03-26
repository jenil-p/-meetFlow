import connectDB from "@/app/db/connectDB";
import Room from "@/app/models/Room";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// Connect to the database
connectDB();

// GET: Fetch all rooms
export async function GET() {
  try {
    const rooms = await Room.find().lean();
    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// POST: Add a new room
export async function POST(request) {
  try {
    
    const { roomNumber, capacity, location } = await request.json();
    if (!roomNumber || !capacity) {
      return NextResponse.json({ message: "Room number and capacity are required" }, { status: 400 });
    }

    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return NextResponse.json({ message: "Room number already exists" }, { status: 400 });
    }

    const newRoom = new Room({ roomNumber, capacity, location });
    await newRoom.save();
    return NextResponse.json({ message: "Room added successfully", room: newRoom }, { status: 201 });
  } catch (error) {
    console.error("Error adding room:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// PUT: Update an existing room
export async function PUT(request) {
  try {
    
    const { id, roomNumber, capacity, location } = await request.json();
    if (!id || !roomNumber || !capacity) {
      return NextResponse.json({ message: "ID, room number, and capacity are required" }, { status: 400 });
    }

    const room = await Room.findById(id);
    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }

    room.roomNumber = roomNumber;
    room.capacity = capacity;
    room.location = location;
    await room.save();

    return NextResponse.json({ message: "Room updated successfully", room }, { status: 200 });
  } catch (error) {
    console.error("Error updating room:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a room
export async function DELETE(request) {
  try {
    
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ message: "Room ID is required" }, { status: 400 });
    }

    const room = await Room.findByIdAndDelete(id);
    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Room deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}