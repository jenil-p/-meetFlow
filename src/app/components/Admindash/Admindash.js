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
import RemoveConference from "./Conference/RemoveConference";
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
    });
    const [sessions, setSessions] = useState([]);
    const [conferences, setConferences] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [resources, setResources] = useState([]);
    const [message, setMessage] = useState("");

    // Fetch data on component mount
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
        return <p className="text-center text-gray-700">Loading...</p>;
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
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

                {/* Navigation Menu */}
                <div className="mb-8">
                    <nav className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow-md">
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
                                    ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                    <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Event Calendar</h2>
                        <Calendar
                            className="w-full border-none"
                            tileClassName={({ date }) => {
                                // Placeholder for future event styling
                                return "hover:bg-gray-100 rounded-md transition-colors duration-200";
                            }}
                        />
                    </div>

                    {/* Content Area (Right Column on Large Screens) */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        {mainTab === "sessions" && (
                            <>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Manage Sessions</h2>
                                <div className="space-y-4">
                                    <div className="flex space-x-4">
                                        <button
                                            className={`px-4 py-2 rounded-md transition-colors ${subTab === "add"
                                                ? "bg-blue-500 text-white"
                                                : "bg-blue-300 text-black hover:bg-blue-400"
                                                }`}
                                            onClick={() => setSubTab("add")}
                                        >
                                            Add Session
                                        </button>
                                        <button
                                            className={`px-4 py-2 rounded-md transition-colors ${subTab === "update"
                                                ? "bg-gray-800 text-white"
                                                : "bg-gray-700 text-white hover:bg-gray-800"
                                                }`}
                                            onClick={() => setSubTab("update")}
                                        >
                                            Update Session
                                        </button>
                                        <button
                                            className={`px-4 py-2 rounded-md transition-colors ${subTab === "delete"
                                                ? "bg-red-800 text-white"
                                                : "bg-red-700 text-white hover:bg-red-800"
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
                            <div className="space-y-4">
                                <div className="text-center text-gray-500">
                                    <h2 className="text-2xl font-semibold mb-4">
                                        {mainTab
                                            .split(/(?=[A-Z])/)
                                            .join(" ")
                                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                                    </h2>
                                    <p>Feature under development. Check back soon!</p>
                                </div>
                                <div className="flex space-x-4">
                                    <AddConference />
                                    <RemoveConference />
                                </div>
                            </div>
                        )}

                        {mainTab === "reviewSection" && (
                            <>
                                <ReviewSection />
                                <div className="text-center text-gray-500">
                                    <h2 className="text-2xl font-semibold mb-4">
                                        {mainTab
                                            .split(/(?=[A-Z])/)
                                            .join(" ")
                                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                                    </h2>
                                    <p>Feature under development. Check back soon!</p>
                                </div>
                            </>
                        )

                        }
                        {mainTab === "roomsResources" && (
                            <div className="space-y-4">
                                <div className="text-center text-gray-500">
                                    <h2 className="text-2xl font-semibold mb-4">
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
                                <div className="text-center text-gray-500">
                                    <h2 className="text-2xl font-semibold mb-4">
                                        {mainTab
                                            .split(/(?=[A-Z])/)
                                            .join(" ")
                                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                                    </h2>
                                    <p>Feature under development. Check back soon!</p>
                                </div>
                            </>
                        )}
                        {mainTab === "sessionPermissions" && <Permissions />}

                        {mainTab !== "sessions" &&
                            mainTab !== "conferences" &&
                            mainTab !== "reviewSection" &&
                            mainTab !== "roomsResources" &&
                            mainTab !== "papers" &&
                            mainTab !== "sessionPermissions" && (
                                <div className="text-center text-gray-500">
                                    <h2 className="text-2xl font-semibold mb-4">
                                        {mainTab
                                            .split(/(?=[A-Z])/)
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