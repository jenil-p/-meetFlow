import mongoose from "mongoose";
import connectDB from "../app/db/connectDB.js";
import Conference from "../app/models/Conference.js";
import Room from "../app/models/Room.js";
import Resource from "../app/models/Resource.js";
import Paper from "../app/models/Paper.js";
import Review from "../app/models/Review.js";
import Registration from "../app/models/Registration.js";
import User from "../app/models/User.js";
import Session from "../app/models/Session.js";



// This code is for add some fake data in database...




const populateDB = async () => {
    try {
        await connectDB();

        await Conference.deleteMany({});
        await Room.deleteMany({});
        await Resource.deleteMany({});
        await Paper.deleteMany({});
        await Review.deleteMany({});
        await Registration.deleteMany({});
        await User.deleteMany({});
        await Session.deleteMany({});

        const users = [
            { name: "Admin User", email: "admin1@example.com", role: "ADMIN", username: "admin1", createdAt: new Date() },
            { name: "Admin User 2", email: "admin2@example.com", role: "ADMIN", username: "admin2", createdAt: new Date() },
            { name: "Regular User 1", email: "user1@example.com", role: "USER", username: "user1", createdAt: new Date() },
            { name: "Regular User 2", email: "user2@example.com", role: "USER", username: "user2", createdAt: new Date() },
        ];
        const createdUsers = await User.insertMany(users);
        console.log("Users added:", createdUsers.length);

        const conferences = [
            { name: "Tech Summit 2025", description: "A summit on technology trends", startDate: new Date("2025-06-01"), endDate: new Date("2025-06-03"), location: "New York", createdBy: createdUsers[0]._id },
            { name: "AI Conference 2025", description: "Exploring AI advancements", startDate: new Date("2025-07-10"), endDate: new Date("2025-07-12"), location: "San Francisco", createdBy: createdUsers[0]._id },
            { name: "Web Dev Expo", description: "Web development expo", startDate: new Date("2025-08-15"), endDate: new Date("2025-08-17"), location: "London", createdBy: createdUsers[1]._id },
            { name: "Data Science Symposium", description: "Symposium on data science", startDate: new Date("2025-09-20"), endDate: new Date("2025-09-22"), location: "Tokyo", createdBy: createdUsers[1]._id },
            { name: "Cybersecurity Forum", description: "Forum on cybersecurity", startDate: new Date("2025-10-05"), endDate: new Date("2025-10-07"), location: "Berlin", createdBy: createdUsers[0]._id },
            { name: "Cloud Computing Conf", description: "Conference on cloud tech", startDate: new Date("2025-11-01"), endDate: new Date("2025-11-03"), location: "Paris", createdBy: createdUsers[1]._id },
            { name: "Blockchain Summit", description: "Summit on blockchain", startDate: new Date("2025-12-10"), endDate: new Date("2025-12-12"), location: "Dubai", createdBy: createdUsers[0]._id },
        ];
        const createdConferences = await Conference.insertMany(conferences);
        console.log("Conferences added:", createdConferences.length);

        // Populate Rooms
        const rooms = [
            { roomNumber: "Hall A", capacity: 100, location: "New York" },
            { roomNumber: "Hall B", capacity: 150, location: "San Francisco" },
            { roomNumber: "Room 101", capacity: 50, location: "London" },
            { roomNumber: "Room 202", capacity: 80, location: "Tokyo" },
            { roomNumber: "Conference Room C", capacity: 120, location: "Berlin" },
            { roomNumber: "Room 303", capacity: 60, location: "Paris" },
            { roomNumber: "Room 404", capacity: 90, location: "Dubai" },
        ];
        const createdRooms = await Room.insertMany(rooms);
        console.log("Rooms added:", createdRooms.length);

        // Populate Resources
        const resources = [
            { name: "Projector 1", description: "High-definition projector", totalQuantity: 5 },
            { name: "Microphone Set A", description: "Wireless microphone set", totalQuantity: 10 },
            { name: "Large Screen", description: "65-inch screen", totalQuantity: 3 },
            { name: "Projector 2", description: "Portable projector", totalQuantity: 4 },
            { name: "Microphone Set B", description: "Wired microphone set", totalQuantity: 8 },
            { name: "Portable Screen", description: "Portable 50-inch screen", totalQuantity: 2 },
            { name: "Laptop Stand", description: "Adjustable laptop stand", totalQuantity: 15 },
        ];
        const createdResources = await Resource.insertMany(resources);
        console.log("Resources added:", createdResources.length);

        // Populate Sessions (we need some sessions for Paper, Review, and Registration)
        const sessions = [
            {
                conference: createdConferences[0]._id,
                title: "Opening Keynote",
                description: "Keynote speech on tech trends",
                sessionType: "KEYNOTE",
                speaker: "John Doe",
                startTime: new Date("2025-06-01T09:00:00"),
                endTime: new Date("2025-06-01T10:00:00"),
                room: createdRooms[0]._id,
                createdBy: createdUsers[0]._id,
                resources: [{ resource: createdResources[0]._id, quantity: 1 }],
            },
            {
                conference: createdConferences[1]._id,
                title: "AI Workshop",
                description: "Hands-on AI workshop",
                sessionType: "WORKSHOP",
                speaker: "Jane Smith",
                startTime: new Date("2025-07-10T10:00:00"),
                endTime: new Date("2025-07-10T12:00:00"),
                room: createdRooms[1]._id,
                createdBy: createdUsers[0]._id,
                resources: [{ resource: createdResources[1]._id, quantity: 2 }],
            },
            {
                conference: createdConferences[2]._id,
                title: "Web Dev Presentation",
                description: "Presentation on modern web dev",
                sessionType: "PRESENTATION",
                speaker: "Alice Brown",
                startTime: new Date("2025-08-15T11:00:00"),
                endTime: new Date("2025-08-15T12:00:00"),
                room: createdRooms[2]._id,
                createdBy: createdUsers[1]._id,
                resources: [{ resource: createdResources[2]._id, quantity: 1 }],
            },
        ];
        const createdSessions = await Session.insertMany(sessions);
        console.log("Sessions added:", createdSessions.length);

        // Populate Papers
        const papers = [
            { user: createdUsers[2]._id, title: "AI in Healthcare", abstract: "Exploring AI applications in healthcare", preferredTime: new Date("2025-07-10T10:00:00"), fileUrl: "http://example.com/paper1.pdf", status: "SUBMITTED" },
            { user: createdUsers[3]._id, title: "Blockchain Security", abstract: "Security aspects of blockchain", preferredTime: new Date("2025-12-10T11:00:00"), fileUrl: "http://example.com/paper2.pdf", status: "UNDER_REVIEW" },
            { user: createdUsers[2]._id, title: "Web Performance", abstract: "Optimizing web performance", preferredTime: new Date("2025-08-15T11:00:00"), fileUrl: "http://example.com/paper3.pdf", status: "APPROVED", session: createdSessions[2]._id },
            { user: createdUsers[3]._id, title: "Data Science Trends", abstract: "Trends in data science", preferredTime: new Date("2025-09-20T10:00:00"), fileUrl: "http://example.com/paper4.pdf", status: "SUBMITTED" },
            { user: createdUsers[2]._id, title: "Cybersecurity Best Practices", abstract: "Best practices in cybersecurity", preferredTime: new Date("2025-10-05T10:00:00"), fileUrl: "http://example.com/paper5.pdf", status: "REJECTED" },
            { user: createdUsers[3]._id, title: "Cloud Migration Strategies", abstract: "Strategies for cloud migration", preferredTime: new Date("2025-11-01T10:00:00"), fileUrl: "http://example.com/paper6.pdf", status: "SUBMITTED" },
            { user: createdUsers[2]._id, title: "Modern Web Frameworks", abstract: "Comparing modern web frameworks", preferredTime: new Date("2025-08-15T12:00:00"), fileUrl: "http://example.com/paper7.pdf", status: "APPROVED", session: createdSessions[2]._id },
        ];
        const createdPapers = await Paper.insertMany(papers);
        console.log("Papers added:", createdPapers.length);

        // Populate Reviews
        const reviews = [
            { user: createdUsers[2]._id, session: createdSessions[0]._id, rating: 5, comment: "Amazing keynote!" },
            { user: createdUsers[3]._id, session: createdSessions[0]._id, rating: 4, comment: "Very informative" },
            { user: createdUsers[2]._id, session: createdSessions[1]._id, rating: 3, comment: "Good but could be more hands-on" },
            { user: createdUsers[3]._id, session: createdSessions[1]._id, rating: 4, comment: "Enjoyed the workshop" },
            { user: createdUsers[2]._id, session: createdSessions[2]._id, rating: 5, comment: "Excellent presentation" },
            { user: createdUsers[3]._id, session: createdSessions[2]._id, rating: 4, comment: "Very insightful" },
            { user: createdUsers[2]._id, session: createdSessions[0]._id, rating: 5, comment: "Loved the speaker" },
        ];
        const createdReviews = await Review.insertMany(reviews);
        console.log("Reviews added:", createdReviews.length);

        // Populate Registrations
        const registrations = [
            { user: createdUsers[2]._id, session: createdSessions[0]._id, registrationDate: new Date(), status: "REGISTERED" },
            { user: createdUsers[3]._id, session: createdSessions[0]._id, registrationDate: new Date(), status: "REGISTERED" },
            { user: createdUsers[2]._id, session: createdSessions[1]._id, registrationDate: new Date(), status: "WAITLISTED" },
            { user: createdUsers[3]._id, session: createdSessions[1]._id, registrationDate: new Date(), status: "REGISTERED" },
            { user: createdUsers[2]._id, session: createdSessions[2]._id, registrationDate: new Date(), status: "REGISTERED" },
            { user: createdUsers[3]._id, session: createdSessions[2]._id, registrationDate: new Date(), status: "CANCELED" },
            { user: createdUsers[2]._id, session: createdSessions[0]._id, registrationDate: new Date(), status: "REGISTERED" },
        ];
        const createdRegistrations = await Registration.insertMany(registrations);
        console.log("Registrations added:", createdRegistrations.length);

        console.log("Database populated successfully!");
    } catch (error) {
        console.error("Error populating database:", error);
    } finally {
        mongoose.connection.close();
    }
};

// Run the script
populateDB();