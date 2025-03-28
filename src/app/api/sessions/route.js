import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/app/db/connectDB";
import Session from "@/app/models/Session";
import Room from "@/app/models/Room";
import Resource from "@/app/models/Resource";
import User from "@/app/models/User";
import Conference from "@/app/models/Conference";
import Registration from "@/app/models/Registration";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

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

// Function to check for overlapping sessions
const checkOverlappingSessions = async (newSession) => {
  const { conference, startTime, endTime, room } = newSession;

  const overlappingSessions = await Session.find({
    $or: [
      {
        conference,
        room,
        _id: { $ne: newSession._id },
        $or: [
          { startTime: { $lt: endTime, $gte: startTime } },
          { endTime: { $gt: startTime, $lte: endTime } },
          { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
        ],
      },
      {
        room,
        conference: { $ne: conference },
        _id: { $ne: newSession._id },
        $or: [
          { startTime: { $lt: endTime, $gte: startTime } },
          { endTime: { $gt: startTime, $lte: endTime } },
          { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
        ],
      },
    ],
  }).lean();

  return overlappingSessions.length > 0;
};

// New helper function to check resource availability
const checkResourceAvailability = async (resources, startTime, endTime, excludeSessionId = null) => {
  if (!resources || resources.length === 0) return true; // No resources to check

  for (const { resource: resourceId, quantity } of resources) {
    if (!resourceId || !quantity) continue;

    // Fetch the resource to get its total quantity
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      throw new Error(`Resource with ID ${resourceId} not found`);
    }

    const totalQuantity = resource.totalQuantity;

    // Find all sessions that overlap with the given time period and use this resource
    const overlappingSessions = await Session.find({
      "resources.resource": resourceId,
      _id: { $ne: excludeSessionId }, // Exclude the session being updated (if any)
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
      ],
    }).lean();

    // Calculate the total quantity already allocated during this time period
    let allocatedQuantity = 0;
    for (const session of overlappingSessions) {
      const resourceEntry = session.resources.find(
        (r) => r.resource.toString() === resourceId.toString()
      );
      if (resourceEntry) {
        allocatedQuantity += resourceEntry.quantity;
      }
    }

    // Check if the requested quantity exceeds the available quantity
    const availableQuantity = totalQuantity - allocatedQuantity;
    if (quantity > availableQuantity) {
      return {
        isAvailable: false,
        message: `Requested quantity (${quantity}) for resource "${resource.name}" exceeds available quantity (${availableQuantity}). Total quantity: ${totalQuantity}, allocated: ${allocatedQuantity}.`,
      };
    }
  }

  return { isAvailable: true };
};

// GET: Fetch all sessions (accessible to both users and admins)
export async function GET() {
  try {
    await ensureDbConnection();
    console.log("Fetching sessions...");
    const sessions = await Session.find()
      .populate("conference", "name location") // Ensure location is populated
      .populate("room", "roomNumber")
      .populate("createdBy", "name")
      .populate("resources.resource", "name");
    console.log("Sessions fetched:", sessions.length);
    return NextResponse.json(sessions, { status: 200 });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// POST: Create new session (admin only)
export async function POST(req) {
  try {
    const { isAdmin: adminCheck, session } = await isAdmin();
    if (!adminCheck) {
      return new Response(
        JSON.stringify({ message: "Unauthorized: Admin access required" }),
        { status: 403 }
      );
    }

    await ensureDbConnection();
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

    if (!conference || !title || !sessionType || !startTime || !endTime) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const conferencefortime = await Conference.findById(conference);
    if (!conferencefortime) {
      return NextResponse.json({ message: "Conference not found" }, { status: 404 });
    }

    const sessionStart = new Date(startTime);
    const sessionEnd = new Date(endTime);
    const confStart = new Date(conferencefortime.startDate);
    const confEnd = new Date(conferencefortime.endDate);

    if (isNaN(sessionStart) || isNaN(sessionEnd) || isNaN(confStart) || isNaN(confEnd)) {
      return NextResponse.json({ message: "Invalid date format" }, { status: 400 });
    }

    if (sessionStart < confStart || sessionEnd > confEnd) {
      return NextResponse.json(
        { message: "Session timing is outside the conference schedule" },
        { status: 400 }
      );
    }
    if (sessionStart > sessionEnd) {
      return NextResponse.json(
        { message: "Enter valid time interval" },
        { status: 400 }
      );
    }

    const validSessionTypes = ["WORKSHOP", "PRESENTATION", "KEYNOTE"];
    if (!validSessionTypes.includes(sessionType)) {
      return new Response(
        JSON.stringify({ message: "Invalid session type" }),
        { status: 400 }
      );
    }

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

    const dbUser = await User.findOne({ email: session.user.email }).lean();
    if (!dbUser) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }
    const createdBy = dbUser._id;

    // Check for overlapping sessions
    const newSessionData = {
      conference,
      startTime: sessionStart,
      endTime: sessionEnd,
      room,
    };
    const hasOverlap = await checkOverlappingSessions(newSessionData);
    if (hasOverlap) {
      return new Response(
        JSON.stringify({ message: "Session overlaps with an existing session in the same room" }),
        { status: 400 }
      );
    }

    // Check resource availability
    const resourceCheck = await checkResourceAvailability(resources, sessionStart, sessionEnd);
    if (!resourceCheck.isAvailable) {
      return new Response(
        JSON.stringify({ message: resourceCheck.message }),
        { status: 400 }
      );
    }

    const newSession = new Session({
      conference,
      title,
      description,
      sessionType,
      speaker,
      startTime: sessionStart,
      endTime: sessionEnd,
      room,
      createdBy,
      resources: resources || [],
    });

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

    await ensureDbConnection();
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

    const sessionStart = startTime ? new Date(startTime) : undefined;
    const sessionEnd = endTime ? new Date(endTime) : undefined;

    if (sessionStart && sessionEnd && (isNaN(sessionStart) || isNaN(sessionEnd))) {
      return new Response(
        JSON.stringify({ message: "Invalid date format" }),
        { status: 400 }
      );
    }

    // Check resource availability if resources or timing is being updated
    if (resources || startTime || endTime) {
      const existingSession = await Session.findById(id);
      if (!existingSession) {
        return new Response(
          JSON.stringify({ message: "Session not found" }),
          { status: 404 }
        );
      }

      const updatedStartTime = startTime ? new Date(startTime) : existingSession.startTime;
      const updatedEndTime = endTime ? new Date(endTime) : existingSession.endTime;
      const updatedResources = resources || existingSession.resources;

      const resourceCheck = await checkResourceAvailability(
        updatedResources,
        updatedStartTime,
        updatedEndTime,
        id // Exclude this session from the overlap check
      );
      if (!resourceCheck.isAvailable) {
        return new Response(
          JSON.stringify({ message: resourceCheck.message }),
          { status: 400 }
        );
      }
    }

    const updatedSession = await Session.findByIdAndUpdate(
      id,
      {
        conference,
        title,
        description,
        sessionType,
        speaker,
        startTime: sessionStart,
        endTime: sessionEnd,
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

    // Check for overlaps after update
    const hasOverlap = await checkOverlappingSessions(updatedSession);
    if (hasOverlap) {
      return new Response(
        JSON.stringify({ message: "Session update causes overlap with an existing session in the same room" }),
        { status: 400 }
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

    await ensureDbConnection();
    const deletedSession = await Session.findByIdAndDelete(id);

    if (!deletedSession) {
      return new Response(
        JSON.stringify({ message: "Session not found" }),
        { status: 404 }
      );
    }

    await Registration.deleteMany({ session: id });

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