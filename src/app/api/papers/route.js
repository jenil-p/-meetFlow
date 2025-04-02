import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/app/db/connectDB';
import Paper from '@/app/models/Paper';
import Permissions from '@/app/models/Permissions';
import Session from '@/app/models/Session';
import User from '@/app/models/User';
import nodemailer from 'nodemailer';

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// GET: Fetch papers (admins see all, users see only APPROVED papers)
export async function GET(req) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    let papers;

    if (session.user.role === 'ADMIN') {
      // Admins can see all papers
      papers = await Paper.find()
        .populate('user', 'username email')
        .populate('session', 'title startTime endTime')
    } else if (session.user.role === 'USER') {
      // Users can only see APPROVED papers
      papers = await Paper.find({ status: 'APPROVED' })
        .populate('user', 'username email')
        .populate('session', 'title startTime endTime')
    } else {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(papers, { status: 200 });
  } catch (error) {
    console.error('Error fetching papers:', error);
    return NextResponse.json({ message: 'Error fetching papers: ' + error.message }, { status: 500 });
  }
}

// PUT: Update paper status (admin only, for expert review)
export async function PUT(req) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is an ADMIN
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden: Only admins can update papers' }, { status: 403 });
  }

  try {
    await connectDB();

    const { id, status } = await req.json();

    // Validate required fields
    if (!id || !status) {
      return NextResponse.json({ message: 'Paper ID and status are required' }, { status: 400 });
    }

    // Validate status
    const validStatuses = ['UNDER_REVIEW', 'APPROVED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    // Find the paper
    const paper = await Paper.findById(id)
      .populate('user', 'email username')
      .populate('session', 'title');
    if (!paper) {
      return NextResponse.json({ message: 'Paper not found' }, { status: 404 });
    }

    // Update status
    paper.status = status;
    await paper.save();

    // Send email notification to the user (optional)
    if (status === 'APPROVED' || status === 'REJECTED') {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: paper.user.email,
        subject: `Update: Your Paper Presentation Status - ${status === 'APPROVED' ? 'Approved' : 'Rejected'}`,
        text: `
          Dear ${paper.user.username},

          We have an update regarding your paper presentation in the session "${paper.session.title}".

          **Paper Details:**
          - Title: ${paper.title}
          - Session: ${paper.session.title}
          **Status Update:**
          Your paper has been ${status === 'APPROVED' ? 'approved' : 'rejected'} by the experts.

          ${status === 'APPROVED' ? 'Congratulations on your successful presentation!' : 'Thank you for your participation. We encourage you to try again in future sessions.'}

          Best regards,
          Conference Organizing Team
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Final status email (${status}) sent to:`, paper.user.email);
    }

    return NextResponse.json({ message: 'Paper status updated successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error updating paper:', error);
    return NextResponse.json({ message: 'Error updating paper: ' + error.message }, { status: 500 });
  }
}

// DELETE: Delete a paper (admin only)
export async function DELETE(req) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is an ADMIN
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden: Only admins can delete papers' }, { status: 403 });
  }

  try {
    await connectDB();

    const { id } = await req.json();

    // Validate required fields
    if (!id) {
      return NextResponse.json({ message: 'Paper ID is required' }, { status: 400 });
    }

    // Find and delete the paper
    const paper = await Paper.findByIdAndDelete(id);
    if (!paper) {
      return NextResponse.json({ message: 'Paper not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Paper deleted successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting paper:', error);
    return NextResponse.json({ message: 'Error deleting paper: ' + error.message }, { status: 500 });
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
