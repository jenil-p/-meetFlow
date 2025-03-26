"use client";

import { useState, useEffect } from "react";
import AddSession from "@/app/components/Session/AddSession";
import UpdateSession from "@/app/components/Session/UpdateSession";
import DeleteSession from "@/app/components/Session/DeleteSession";



export default function SessionsPage() {
    const [sessions, setSessions] = useState([]);
    const [conferences, setConferences] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
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
    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showDeleteForm, setShowDeleteForm] = useState(false);
    const [selectedSessionId, setSelectedSessionId] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                const sessRes = await fetch("/api/sessions", { credentials: "include" });
                const sessData = await sessRes.json();
                if (sessRes.ok) {
                    setSessions(sessData);
                }

                const confRes = await fetch("/api/conferences", { credentials: "include" });
                const confData = await confRes.json();
                if (confRes.ok) {
                    setConferences(confData);
                    if (confData.length > 0) {
                        setFormData((prev) => ({ ...prev, conference: confData[0]._id }));
                    }
                } else {
                    setError("Failed to fetch conferences: " + (confData.message || "Unknown error"));
                }

                const roomRes = await fetch("/api/rooms", { credentials: "include" });
                const roomData = await roomRes.json();
                if (roomRes.ok) {
                    setRooms(roomData);
                }

                const resRes = await fetch("/api/resources", { credentials: "include" });
                const resData = await resRes.json();
                if (resRes.ok) {
                    setResources(resData);
                }
            } catch (error) {
                setError("Error fetching data: " + error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSuccess = () => {
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
        });
        setShowAddForm(false);
        setShowUpdateForm(false);
        setShowDeleteForm(false);
        setSelectedSessionId("");
        setMessage("");
        const fetchSessions = async () => {
            try {
                const res = await fetch("/api/sessions", { credentials: "include" });
                const data = await res.json();
                if (res.ok) {
                    setSessions(data);
                }
            } catch (error) {
                setError("Error refreshing sessions: " + error.message);
            }
        };
        fetchSessions();
    };

    const handleEditClick = (sessionId) => {
        setSelectedSessionId(sessionId);
        setShowUpdateForm(true);
        setShowAddForm(false);
        setShowDeleteForm(false);
        setMessage("");
    };

    const handleDeleteClick = (sessionId) => {
        setSelectedSessionId(sessionId);
        setShowDeleteForm(true);
        setShowAddForm(false);
        setShowUpdateForm(false);
        setMessage("");
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 playfair-display-sc-regular">
                Sessions
            </h2>
            <button
                onClick={() => {
                    setShowAddForm(!showAddForm);
                    setShowUpdateForm(false);
                    setShowDeleteForm(false);
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
                    });
                    setMessage("");
                }}
                className={showAddForm ? "inline-block w-full border border-dashed border-black px-4 py-2 rounded-lg text-gray-700 transition-all duration-200 shadow-md mb-4" : "inline-block w-full border border-dashed border-black px-4 py-2 rounded-lg text-gray-700 transition-all duration-200 shadow-md mb-4"}
            >
                <div className="flex items-center justify-center gap-2">
                    {!showAddForm && (
                        <img className="w-6 h-6" src="/add.svg" alt="" />
                    )}
                    <span>{showAddForm ? "Cancel Add Session" : "Add New Session"}</span>
                </div>
            </button>

            {message && <p className="text-sm text-green-600 mb-4">{message}</p>}
            {loading && <p className="text-sm text-gray-600">Loading sessions...</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {showAddForm && (
                <AddSession
                    formData={formData}
                    conferences={conferences}
                    rooms={rooms}
                    resources={resources}
                    handleChange={handleChange}
                    setMessage={setMessage}
                    setSessions={setSessions}
                    setFormData={setFormData}
                    onSuccess={handleSuccess}
                />
            )}

            {showUpdateForm && (
                <div className="space-y-4">
                    <button
                        onClick={() => {
                            setShowUpdateForm(false);
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
                            });
                            setSelectedSessionId("");
                            setMessage("");
                        }}
                        className="inline-block bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-md mb-4"
                    >
                        Cancel Update Session
                    </button>
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
                        onSuccess={handleSuccess}
                        preSelectedSessionId={selectedSessionId}
                    />
                </div>
            )}

            {showDeleteForm && (
                <div className="space-y-4">
                    <button
                        onClick={() => {
                            setShowDeleteForm(false);
                            setSelectedSessionId("");
                            setMessage("");
                        }}
                        className="inline-block bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-md mb-4"
                    >
                        Cancel Delete Session
                    </button>
                    <DeleteSession
                        sessions={sessions}
                        setMessage={setMessage}
                        setSessions={setSessions}
                        onSuccess={handleSuccess}
                        preSelectedSessionId={selectedSessionId}
                    />
                </div>
            )}

            {sessions.length === 0 && !loading && !error ? (
                <p className="text-gray-600">No sessions found.</p>
            ) : (
                <div className="flex flex-col justify-start items-center gap-4 overflow-y-auto max-h-[500px] pb-20">
                    {sessions.map((session) => (
                        <div
                            key={session._id}
                            className="bg-gray-50 p-4 h-32 w-full rounded-2xl shadow-lg flex justify-between items-center"
                        >
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">{session.title}</h2>
                                <p className="text-sm text-gray-600">
                                    Conference: {session.conference?.name || "Not set"}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Starts: {new Date(session.startTime).toLocaleString()}, Ends: {new Date(session.endTime).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Room: {session.room?.roomNumber || "Not set"}
                                </p>
                            </div>
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleEditClick(session._id)}
                                    className="text-yellow-700 hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(session._id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}