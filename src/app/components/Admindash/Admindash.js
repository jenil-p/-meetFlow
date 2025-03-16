"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import AddSession from "./session/AddSession";
import UpdateSession from "./session/UpdateSession";
import DeleteSession from "./session/DeleteSession";
import SessionForm from "../SessionForm";
import AddConference from "./Conference/AddConference";
import UpdateConference from "./Conference/UpdateConference";
import DeleteConference from "./Conference/DeleteConference";
import ReviewSection from "./Review/ReviewSection";
import Rooms from "./RoomResource/Rooms";
import Resources from "./RoomResource/Resources";
import Papers from "./Papers/Papers";
import Permissions from "./Permissions/Permissions";

export default function Admindash() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // State for main tab, sub-tab, form inputs, and data
    const [mainTab, setMainTab] = useState("sessions");
    const [subTab, setSubTab] = useState(null); // For sub-tabs like add, update, delete
    const [formData, setFormData] = useState({
        conference: "",
        title: "",
        description: "",
        sessionType: "WORKSHOP",
        speaker: "",
        startTime: "",
        endTime: "",
        room: "",
        resourceId: "",
        resourceQuantity: "",
        name: "", // For conferences
        startDate: "",
        endDate: "",
        location: "",
    });
    const [sessions, setSessions] = useState([]);
    const [conferences, setConferences] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [resources, setResources] = useState([]);
    const [message, setMessage] = useState("");

    // Fetch data on component mount
    // Inside useEffect in Admindash.js
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch sessions for Update and Delete
                const sessRes = await fetch("/api/sessions", { credentials: "include" });
                const sessData = await sessRes.json();
                if (sessRes.ok) {
                    setSessions(sessData);
                }

                // Fetch conferences
                const confRes = await fetch("/api/conferences", { credentials: "include" });
                const confData = await confRes.json();
                if (confRes.ok) {
                    setConferences(confData);
                    if (confData.length > 0) {
                        setFormData((prev) => ({ ...prev, conference: confData[0]._id }));
                    }
                } else {
                    setMessage("Failed to fetch conferences: " + (confData.message || "Unknown error"));
                }

                // Fetch rooms
                const roomRes = await fetch("/api/rooms", { credentials: "include" });
                const roomData = await roomRes.json();
                if (roomRes.ok) {
                    setRooms(roomData);
                }

                // Fetch resources
                const resRes = await fetch("/api/resources", { credentials: "include" });
                const resData = await resRes.json();
                if (resRes.ok) {
                    setResources(resData);
                }
            } catch (error) {
                setMessage("Error fetching data: " + error.message);
            }
        };
        fetchData();
    }, []);

    // Redirect if not authenticated or not an admin
    if (status === "loading") {
        return <p className="text-center text-gray-600">Loading...</p>;
    }

    if (!session || session.user.role !== "ADMIN") {
        router.push("/login");
        return null;
    }

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle main tab change
    const handleMainTabChange = (tab) => {
        setMainTab(tab);
        setSubTab(null); // Reset sub-tab when changing main tabs
        // Clear form when switching tabs
        setFormData({
            conference: conferences.length > 0 ? conferences[0]._id : "",
            title: "",
            description: "",
            sessionType: "WORKSHOP",
            speaker: "",
            startTime: "",
            endTime: "",
            room: "",
            resourceId: "",
            resourceQuantity: "",
            name: "",
            startDate: "",
            endDate: "",
            location: "",
        });
        setMessage("");
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <h1 className="text-4xl font-bold text-gray-800 mb-6 playfair-display-sc-regular">
                    Admin Dashboard
                </h1>

                {/* Navigation Menu */}
                <div className="mb-8">
                    <nav className="flex flex-wrap gap-4 bg-gray-100 p-4 rounded-lg shadow-md">
                        {[
                            "sessions",
                            "conferences",
                            "reviewSection",
                            "roomsResources",
                            "papers",
                            "Permissions",
                        ].map((tab) => (
                            <button
                                key={tab}
                                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${mainTab === tab
                                        ? "bg-yellow-700 text-white shadow-lg"
                                        : "bg-white text-gray-600 hover:bg-gray-200"
                                    }`}
                                onClick={() => handleMainTabChange(tab)}
                            >
                                {tab
                                    .split(/(?=[A-Z])/)
                                    .join(" ")
                                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar (Left Column on Large Screens) */}
                    <div className="lg:col-span-1 bg-gray-100 p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 playfair-display-sc-regular">
                            Event Calendar
                        </h2>
                        <Calendar
                            className="w-full border-none"
                            tileClassName={({ date }) => {
                                // Placeholder for future event styling
                                return "hover:bg-gray-200 rounded-md transition-colors duration-200";
                            }}
                        />
                    </div>

                    {/* Content Area (Right Column on Large Screens) */}
                    <div className="lg:col-span-2 bg-gray-100 p-6 rounded-lg shadow-md">
                        {mainTab === "sessions" && (
                            <>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800 playfair-display-sc-regular">
                                    Manage Sessions
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex space-x-4">
                                        <button
                                            className={`px-4 py-2 rounded-md transition-colors ${subTab === "add"
                                                    ? "bg-yellow-700 text-white"
                                                    : "bg-yellow-600 text-white hover:bg-yellow-700"
                                                }`}
                                            onClick={() => setSubTab("add")}
                                        >
                                            Add Session
                                        </button>
                                        <button
                                            className={`px-4 py-2 rounded-md transition-colors ${subTab === "update"
                                                    ? "bg-gray-700 text-white"
                                                    : "bg-gray-600 text-white hover:bg-gray-700"
                                                }`}
                                            onClick={() => setSubTab("update")}
                                        >
                                            Update Session
                                        </button>
                                        <button
                                            className={`px-4 py-2 rounded-md transition-colors ${subTab === "delete"
                                                    ? "bg-red-700 text-white"
                                                    : "bg-red-600 text-white hover:bg-red-700"
                                                }`}
                                            onClick={() => setSubTab("delete")}
                                        >
                                            Delete Session
                                        </button>
                                    </div>
                                    {subTab === "add" && (
                                        <AddSession
                                            formData={formData}
                                            conferences={conferences}
                                            rooms={rooms}
                                            resources={resources}
                                            handleChange={handleChange}
                                            setMessage={setMessage}
                                            setSessions={setSessions}
                                            setFormData={setFormData}
                                        />
                                    )}
                                    {subTab === "update" && (
                                        <UpdateSession
                                            formData={formData}
                                            sessions={sessions}
                                            conferences={conferences}
                                            rooms={rooms}
                                            resources={resources}
                                            handleChange={handleChange}
                                            setMessage={setMessage}
                                            setSessions={setSessions}
                                            setFormData={setFormData}
                                        />
                                    )}
                                    {subTab === "delete" && (
                                        <DeleteSession
                                            sessions={sessions}
                                            setMessage={setMessage}
                                            setSessions={setSessions}
                                        />
                                    )}
                                </div>
                            </>
                        )}

                        {mainTab === "conferences" && (
                            <>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800 playfair-display-sc-regular">
                                    Manage Conferences
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex space-x-4">
                                        <button
                                            className={`px-4 py-2 rounded-md transition-colors ${subTab === "add"
                                                    ? "bg-yellow-700 text-white"
                                                    : "bg-yellow-600 text-white hover:bg-yellow-700"
                                                }`}
                                            onClick={() => setSubTab("add")}
                                        >
                                            Add Conference
                                        </button>
                                        <button
                                            className={`px-4 py-2 rounded-md transition-colors ${subTab === "update"
                                                    ? "bg-gray-700 text-white"
                                                    : "bg-gray-600 text-white hover:bg-gray-700"
                                                }`}
                                            onClick={() => setSubTab("update")}
                                        >
                                            Update Conference
                                        </button>
                                        <button
                                            className={`px-4 py-2 rounded-md transition-colors ${subTab === "delete"
                                                    ? "bg-red-700 text-white"
                                                    : "bg-red-600 text-white hover:bg-red-700"
                                                }`}
                                            onClick={() => setSubTab("delete")}
                                        >
                                            Delete Conference
                                        </button>
                                    </div>
                                    {subTab === "add" && (
                                        <AddConference
                                            formData={formData}
                                            handleChange={handleChange}
                                            setMessage={setMessage}
                                            setConferences={setConferences}
                                            setFormData={setFormData}
                                        />
                                    )}
                                    {subTab === "update" && (
                                        <UpdateConference
                                            formData={formData}
                                            conferences={conferences}
                                            handleChange={handleChange}
                                            setMessage={setMessage}
                                            setConferences={setConferences}
                                            setFormData={setFormData}
                                        />
                                    )}
                                    {subTab === "delete" && (
                                        <DeleteConference
                                            conferences={conferences}
                                            setMessage={setMessage}
                                            setConferences={setConferences}
                                        />
                                    )}
                                </div>
                            </>
                        )}

                        {mainTab === "reviewSection" && (
                            <>
                                <ReviewSection />
                                <div className="text-center text-gray-600">
                                    <h2 className="text-2xl font-semibold mb-4 playfair-display-sc-regular">
                                        {mainTab
                                            .split(/(?=[A-Z])/)
                                            .join(" ")
                                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                                    </h2>
                                    <p>Feature under development. Check back soon!</p>
                                </div>
                            </>
                        )}

                        {mainTab === "roomsResources" && (
                            <div className="space-y-4">
                                <div className="text-center text-gray-600">
                                    <h2 className="text-2xl font-semibold mb-4 playfair-display-sc-regular">
                                        {mainTab
                                            .split(/(?=[A-Z])/)
                                            .join(" ")
                                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                                    </h2>
                                    <p>Feature under development. Check back soon!</p>
                                </div>
                                <div className="flex space-x-4">
                                    <Rooms />
                                    <Resources />
                                </div>
                            </div>
                        )}
                        {mainTab === "papers" && (
                            <>
                                <Papers />
                                <div className="text-center text-gray-600">
                                    <h2 className="text-2xl font-semibold mb-4 playfair-display-sc-regular">
                                        {mainTab
                                            .split(/(?=[A-Z])/)
                                            .join(" ")
                                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                                    </h2>
                                    <p>Feature under development. Check back soon!</p>
                                </div>
                            </>
                        )}
                        {mainTab === "Permissions" && <Permissions />}

                        {mainTab !== "sessions" &&
                            mainTab !== "conferences" &&
                            mainTab !== "reviewSection" &&
                            mainTab !== "roomsResources" &&
                            mainTab !== "papers" &&
                            mainTab !== "Permissions" && (
                                <div className="text-center text-gray-600">
                                    <h2 className="text-2xl font-semibold mb-4 playfair-display-sc-regular">
                                        {mainTab
                                            .split(/(?=[AZ])/)
                                            .join(" ")
                                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                                    </h2>
                                    <p>Feature under development. Check back soon!</p>
                                </div>
                            )}
                    </div>
                </div>

                {message && <p className="mt-4 text-center text-green-600">{message}</p>}
            </div>
        </div>
    );
}