import { NextResponse } from "next/server";
import connectDB from "@/app/db/connectDB";
import User from "@/app/models/User";

export async function GET(req) {

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
