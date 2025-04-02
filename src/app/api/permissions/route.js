import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/app/db/connectDB';
import Permissions from '@/app/models/Permissions';
import Paper from '@/app/models/Paper';
import User from '@/app/models/User';
import Session from '@/app/models/Session';
import nodemailer from 'nodemailer';
import { getToken } from 'next-auth/jwt';

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


// POST: Submit a permission request (user only)
export async function POST(req) {
  const session = await getServerSession(authOptions);
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
      if (!token || !token.name) {
          return NextResponse.json({ message: "Access denied" }, { status: 403 });
      }
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is a USER
  if (session.user.role !== 'USER') {
    return NextResponse.json({ message: 'Forbidden: Only users can submit permission requests' }, { status: 403 });
  }

  try {
    await connectDB();

    const { sessionId, paperLink, title, summary, expectedPresentationTime, messageToOrganizer } = await req.json();

    // Validate required fields
    if (!sessionId || !paperLink || !title || !summary || !expectedPresentationTime) {
      return NextResponse.json({ message: 'All required fields must be provided' }, { status: 400 });
    }

    // Verify the session exists
    const sessionExists = await Session.findById(sessionId);
    if (!sessionExists) {
      return NextResponse.json({ message: 'Session not found' }, { status: 404 });
    }

    // Create a new permission request
    const permission = new Permissions({
      user: session.user.id,
      session: sessionId,
      paperLink,
      title,
      summary,
      expectedPresentationTime,
      messageToOrganizer,
      status: 'PENDING',
    });

    await permission.save();

    return NextResponse.json({ message: 'Permission request submitted successfully!' }, { status: 201 });
  } catch (error) {
    console.error('Error submitting permission request:', error);
    return NextResponse.json({ message: 'Error submitting permission request: ' + error.message }, { status: 500 });
  }
}

// GET: Fetch permission requests (users see their own, admins see all)
export async function GET(req) {
  const session = await getServerSession(authOptions);
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
      if (!token || !token.name) {
          return NextResponse.json({ message: "Access denied" }, { status: 403 });
      }
  // Check if user is authenticated
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    let permissions;

    if (session.user.role === 'ADMIN') {
      // Admins can see all permission requests
      permissions = await Permissions.find()
        .populate('user', 'name email')
        .populate('session', 'title startTime endTime')
    } else if (session.user.role === 'USER') {
      // Users can only see their own permission requests
      permissions = await Permissions.find({ user: session.user.id })
        .populate('user', 'name email')
        .populate('session', 'title startTime endTime');
    } else {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(permissions, { status: 200 });
  } catch (error) {
    console.error('Error fetching permission requests:', error);
    return NextResponse.json({ message: 'Error fetching permission requests: ' + error.message }, { status: 500 });
  }
}

// PUT: Approve or reject a permission request (admin only)
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
      if (!token || !token.name) {
          return NextResponse.json({ message: "Access denied" }, { status: 403 });
      }

  // Check if user is authenticated
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is an ADMIN
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden: Only admins can update permission requests' }, { status: 403 });
  }

  try {
    await connectDB();

    const { id, status } = await req.json();

    // Validate required fields
    if (!id || !status) {
      return NextResponse.json({ message: 'Permission ID and status are required' }, { status: 400 });
    }

    // Validate status
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    // Find the permission request
    const permission = await Permissions.findById(id)
      .populate('user', 'email username')
      .populate('session', 'title startTime endTime');
    if (!permission) {
      return NextResponse.json({ message: 'Permission request not found' }, { status: 404 });
    }

    // Update status
    permission.status = status;
    await permission.save();

    // If approved, create a Paper entry and link to the session
    if (status === 'APPROVED') {
      // Create a new Paper entry
      const paper = new Paper({
        user: permission.user._id,
        session: permission.session._id,
        title: permission.title,
        paperLink: permission.paperLink,
        summary: permission.summary,
        status: 'UNDER_REVIEW',
      });

      await paper.save();

      // Link the permission to the session
      const sessionToUpdate = await Session.findById(permission.session);
      if (sessionToUpdate) {
        sessionToUpdate.permission = permission._id;
        await sessionToUpdate.save();
      }

      // Send approval email to the user
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: permission.user.email,
        subject: 'Congratulations! Your Permission Request Has Been Approved',
        text: `
          Dear ${permission.user.username},

          We are pleased to inform you that your request to present a paper in the session "${permission.session.title}" has been approved!

          **Paper Details:**
          - Title: ${permission.title}
          - Session: ${permission.session.title}
          - Start Time: ${permission.session.startTime}
          - End Time: ${permission.session.endTime}
          - Expected Presentation Time: ${permission.expectedPresentationTime} minutes

          Congratulations! Your paper has been scheduled for presentation, and it is now under review by experts. You will be notified of the final status after the review process.

          Best regards,
          Conference Organizing Team
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log('Approval email sent to:', permission.user.email);
    } else if (status === 'REJECTED') {
      // Remove the permission reference from the session (if any)
      await Session.updateOne({ permission: id }, { $unset: { permission: '' } });
    }

    return NextResponse.json({ message: 'Permission request updated successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error updating permission request:', error);
    return NextResponse.json({ message: 'Error updating permission request: ' + error.message }, { status: 500 });
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
