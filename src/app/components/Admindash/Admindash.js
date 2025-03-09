"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AddSession from "./session/AddSession";
import UpdateSession from "./session/UpdateSession";
import DeleteSession from "./session/DeleteSession";
import SessionForm from "../SessionForm";

export default function Admindash() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // State for form inputs and active tab
    const [activeTab, setActiveTab] = useState("add");
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
        return <p>Loading...</p>;
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

    return (
        <div className="admin-dash p-10 text-white w-2/3 mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-4">
                <button
                    className={`px-4 py-2 rounded-md ${activeTab === "add" ? "bg-blue-300 text-black" : "bg-gray-700"}`}
                    onClick={() => setActiveTab("add")}
                >
                    Add Session
                </button>
                <button
                    className={`px-4 py-2 rounded-md ${activeTab === "update" ? "bg-blue-300 text-black" : "bg-gray-700"}`}
                    onClick={() => setActiveTab("update")}
                >
                    Update Session
                </button>
                <button
                    className={`px-4 py-2 rounded-md ${activeTab === "delete" ? "bg-blue-300 text-black" : "bg-gray-700"}`}
                    onClick={() => setActiveTab("delete")}
                >
                    Delete Session
                </button>
            </div>

            {/* Add Session Section */}
            {activeTab === "add" && (
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

            {/* Update Session Section */}
            {activeTab === "update" && (
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

            {/* Delete Session Section */}
            {activeTab === "delete" && (
                <DeleteSession
                    sessions={sessions}
                    setMessage={setMessage}
                    setSessions={setSessions}
                />
            )}

            {message && <p className="mt-4">{message}</p>}
        </div>
    );
}