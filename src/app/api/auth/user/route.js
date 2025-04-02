import { NextResponse } from "next/server";
import connectDB from "@/app/db/connectDB";
import User from "@/app/models/User";
import { getToken } from "next-auth/jwt";

export async function GET(req) {

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.name) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

  try {
    await connectDB(); // Ensure database connection


    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email"); // Get email from query params


    await connectDB();
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ role: user.role }), { status: 200 });
  }
  catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
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

