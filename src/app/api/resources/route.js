import connectDB from "@/app/db/connectDB";
import Resource from "@/app/models/Resource";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { getToken } from "next-auth/jwt";

connectDB();

// GET: Fetch all resources
export async function GET(req) {

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.name) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

  try {
    await connectDB(); // Ensure database connection
    const resources = await Resource.find().lean();
    return NextResponse.json(resources, { status: 200 });

  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// POST: Add a new resource
export async function POST(req) {

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.name) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

  try {
    const { name, description, totalQuantity } = await req.json();
    if (!name || !totalQuantity) {
      return NextResponse.json({ message: "Name and total quantity are required" }, { status: 400 });
    }

    const existingResource = await Resource.findOne({ name });
    if (existingResource) {
      return NextResponse.json({ message: "Resource name already exists" }, { status: 400 });
    }

    const newResource = new Resource({ name, description, totalQuantity });
    await newResource.save();
    return NextResponse.json({ message: "Resource added successfully", resource: newResource }, { status: 201 });
  } catch (error) {
    console.error("Error adding resource:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// PUT: Update an existing resource
export async function PUT(req) {

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.name) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

  try {

    const { id, name, description, totalQuantity } = await req.json();
    if (!id || !name || !totalQuantity) {
      return NextResponse.json({ message: "ID, name, and total quantity are required" }, { status: 400 });
    }

    const resource = await Resource.findById(id);
    if (!resource) {
      return NextResponse.json({ message: "Resource not found" }, { status: 404 });
    }

    resource.name = name;
    resource.description = description;
    resource.totalQuantity = totalQuantity;
    await resource.save();

    return NextResponse.json({ message: "Resource updated successfully", resource }, { status: 200 });
  } catch (error) {
    console.error("Error updating resource:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a resource
export async function DELETE(req) {

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.name) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

  try {

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ message: "Resource ID is required" }, { status: 400 });
    }

    const resource = await Resource.findByIdAndDelete(id);
    if (!resource) {
      return NextResponse.json({ message: "Resource not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Resource deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting resource:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
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
