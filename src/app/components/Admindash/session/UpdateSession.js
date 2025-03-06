"use client";

import { useState } from "react";
import SessionForm from "../../SessionForm";

const UpdateSession = ({ formData, sessions, conferences, rooms, resources, handleChange, setMessage, setSessions, setFormData }) => {
    const [selectedSessionId, setSelectedSessionId] = useState("");

    const handleSessionChange = (e) => {
        const sessionId = e.target.value;
        setSelectedSessionId(sessionId);
        if (sessionId) {
            const session = sessions.find((s) => s._id.toString() === sessionId);
            if (session) {
                setFormData({
                    conference: session.conference?._id || "",
                    title: session.title || "",
                    description: session.description || "",
                    sessionType: session.sessionType || "WORKSHOP",
                    speaker: session.speaker || "",
                    startTime: session.startTime ? new Date(session.startTime).toISOString().slice(0, 16) : "",
                    endTime: session.endTime ? new Date(session.endTime).toISOString().slice(0, 16) : "",
                    room: session.room?._id || "",
                    resourceId: session.resources.length > 0 ? session.resources[0].resource?._id : "",
                    resourceQuantity: session.resources.length > 0 ? session.resources[0].quantity : "",
                });
            }
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!selectedSessionId) {
            setMessage("Please select a session to update");
            return;
        }

        if (confirm("Are you sure you want to update this session?")) {
            try {
                const res = await fetch(`/api/sessions?id=${selectedSessionId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        conference: formData.conference,
                        title: formData.title,
                        description: formData.description,
                        sessionType: formData.sessionType,
                        speaker: formData.speaker,
                        startTime: new Date(formData.startTime),
                        endTime: new Date(formData.endTime),
                        room: formData.room || undefined,
                        resources: formData.resourceId && formData.resourceQuantity
                            ? [{ resource: formData.resourceId, quantity: parseInt(formData.resourceQuantity) }]
                            : [],
                    }),
                    credentials: "include",
                });

                const data = await res.json();
                if (res.ok) {
                    setMessage("Session updated successfully!");
                    // Refresh sessions list
                    const sessRes = await fetch("/api/sessions", { credentials: "include" });
                    const sessData = await sessRes.json();
                    if (sessRes.ok) {
                        setSessions(sessData);
                    }
                } else {
                    setMessage(data.message || "Failed to update session");
                }
            } catch (error) {
                setMessage("Error: " + error.message);
            }
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl mb-4">Update Session</h2>
            <div className="flex flex-col">
                <label className="mb-1">Select Session to Update:</label>
                <select
                    className="bg-gray-700 text-white rounded-md p-2"
                    value={selectedSessionId}
                    onChange={handleSessionChange}
                >
                    <option value="">Select a session</option>
                    {sessions.map((sess) => (
                        <option key={sess._id} value={sess._id}>
                            {`${sess.title} (${sess.conference?.name || "No Conference"}) - ${new Date(sess.startTime).toLocaleString()}`}
                        </option>
                    ))}
                </select>
            </div>

            {selectedSessionId && (
                <SessionForm
                    formData={formData}
                    conferences={conferences}
                    rooms={rooms}
                    resources={resources}
                    handleChange={handleChange}
                    handleSubmit={handleUpdateSubmit}
                    submitLabel="Update Session"
                />
            )}
        </div>
    );
};

export default UpdateSession;