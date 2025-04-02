import mongoose from "mongoose";
import connectDB from "../app/db/connectDB.js"
import Paper from "../app/models/Paper.js";
import User from "../app/models/User.js";

const seedPapers = async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log('Connected to MongoDB');

    // Find or create a user (e.g., jenil@gmail.com)
    let user = await User.findOne({ email: 'jenil@gmail.com' });
    if (!user) {
      user = new User({
        username: 'Jenil',
        email: 'jenil@gmail.com',
        password: 'hashed-password', // You should hash this in a real scenario
        role: 'USER',
        createdAt: new Date(),
      });
      await user.save();
      console.log('Created user:', user.email);
    }

    // Clear existing papers (optional, comment out if you don’t want to clear)
    await Paper.deleteMany({});
    console.log('Cleared existing papers');

    // Define possible statuses
    const statuses = ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'];

    // Generate 25 papers
    const papers = [];
    for (let i = 1; i <= 25; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)]; // Random status
      const preferredTime = new Date(`2025-04-${String(i).padStart(2, '0')}T10:00:00Z`);
      const submittedAt = new Date(`2025-03-${String(i).padStart(2, '0')}T12:00:00Z`);

      papers.push({
        user: user._id,
        title: `Research Paper ${i}`,
        abstract: `This is the abstract for Research Paper ${i}. It discusses various topics in the field.`,
        preferredTime,
        fileUrl: `/uploads/paper-${i}.pdf`,
        status,
        submittedAt,
      });
    }

    // Insert papers into the database
    await Paper.insertMany(papers);
    console.log('Inserted 25 papers with varying statuses');

    // Log the count of papers by status
    const statusCounts = await Paper.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    console.log('Papers by status:', statusCounts);

  } catch (error) {
    console.error('Error seeding papers:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the script
seedPapers();