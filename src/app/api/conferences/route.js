import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/app/db/connectDB";
import Conference from "@/app/models/Conference";
import User from "@/app/models/User";
import Session from "@/app/models/Session";
import Registration from "@/app/models/Registration";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Ensure DB connection
const ensureDbConnection = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection failed:", error);
    throw new Error("Failed to connect to the database");
  }
};

const isAdmin = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Not authenticated");
  }
  if (!session.user.role) {
    await ensureDbConnection();
    const dbUser = await User.findOne({ email: session.user.email }).lean();
    if (dbUser) {
      session.user.role = dbUser.role;
    } else {
      throw new Error("User not found in database");
    }
  }
  return { isAdmin: session.user.role === "ADMIN", session };
};

// GET: Fetch all conferences or a specific conference by ID
export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.name) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }
  try {
    await ensureDbConnection();
    console.log("Fetching conferences...");
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const fields = searchParams.get("fields"); // Optional: to control returned fields

    let conferences;
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: "Invalid conference ID" }, { status: 400 });
      }
      conferences = await Conference.findById(id).populate("createdBy", "name");
      if (!conferences) {
        return NextResponse.json({ message: "Conference not found" }, { status: 404 });
      }
    } else {
      if (fields === "minimal") {
        conferences = await Conference.find().select("name startDate endDate");
      } else {
        conferences = await Conference.find().populate("createdBy", "name");
      }
    }
    console.log("Conferences fetched:", conferences.length || 1);
    return NextResponse.json(conferences, { status: 200 });
  } catch (error) {
    console.error("Error fetching conferences:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// POST: Create a new conference (admin-only)
export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.name) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }
  try {
    const { isAdmin: adminCheck, session } = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 403 });
    }

    await ensureDbConnection();
    const body = await req.json();
    const { name, description, startDate, endDate, location } = body;

    if (!name || !startDate || !endDate) {
      return NextResponse.json({ message: "Name, startDate, and endDate are required" }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end) || start >= end) {
      return NextResponse.json({ message: "Invalid date range" }, { status: 400 });
    }

    const dbUser = await User.findOne({ email: session.user.email }).lean();
    if (!dbUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const createdBy = dbUser._id;

    const newConference = new Conference({
      name,
      description,
      startDate: start,
      endDate: end,
      location,
      createdBy,
    });

    await newConference.save();
    return NextResponse.json(
      { message: "Conference created successfully", conference: newConference },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating conference:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// PUT: Update an existing conference by ID (admin-only)
export async function PUT(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.name) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }
  try {
    const { isAdmin: adminCheck } = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid conference ID" }, { status: 400 });
    }

    await ensureDbConnection();
    const body = await req.json();
    const { name, description, startDate, endDate, location } = body;

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;
      if ((start && isNaN(start)) || (end && isNaN(end)) || (start && end && start >= end)) {
        return NextResponse.json({ message: "Invalid date range" }, { status: 400 });
      }
      if (start) updateData.startDate = start;
      if (end) updateData.endDate = end;
    }
    if (location) updateData.location = location;

    const updatedConference = await Conference.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name");

    if (!updatedConference) {
      return NextResponse.json({ message: "Conference not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Conference updated successfully", conference: updatedConference },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating conference:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a conference by ID (admin-only)
export async function DELETE(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.name) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }
  try {
    const { isAdmin: adminCheck } = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json(
        { message: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid conference ID" }, { status: 400 });
    }

    await ensureDbConnection();

    const sessionsForConference = await Session.find({ conference: id }).lean();
    const sessionIds = sessionsForConference.map((session) => session._id);

    if (sessionIds.length > 0) {
      await Registration.deleteMany({ session: { $in: sessionIds } });
    }

    await Session.deleteMany({ conference: id });

    const deletedConference = await Conference.findByIdAndDelete(id);
    if (!deletedConference) {
      return NextResponse.json({ message: "Conference not found" }, { status: 404 });
    }

    console.log(`Deleted conference ${id}: ${deletedConference.name}`);

    return NextResponse.json({ message: "Conference deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting conference:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
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
