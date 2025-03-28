"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SessionForm from "./SessionForm";

const UpdateSession = ({
    formData,
    sessions,
    conferences,
    rooms,
    resources,
    handleChange,
    setSessions,
    setFormData,
    onSuccess,
    preSelectedSessionId,
}) => {
    const [selectedSessionId, setSelectedSessionId] = useState(preSelectedSessionId || "");

    useEffect(() => {
        setSelectedSessionId(preSelectedSessionId || "");
        if (preSelectedSessionId) {
            const session = sessions.find((s) => s._id.toString() === preSelectedSessionId);
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
    }, [preSelectedSessionId, sessions, setFormData]);

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSessionId) {
            toast.error("No session selected to update");
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
                    toast.success("Session updated successfully!");
                    const sessRes = await fetch("/api/sessions", { credentials: "include" });
                    const sessData = await sessRes.json();
                    if (sessRes.ok) {
                        setSessions(sessData);
                    }
                    onSuccess();
                } else {
                    toast.error(data.message || "Failed to update session");
                }
            } catch (error) {
                toast.error("Error: " + error.message);
            }
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl mb-4">Update Session</h2>
            <SessionForm
                formData={formData}
                conferences={conferences}
                rooms={rooms}
                resources={resources}
                handleChange={handleChange}
                handleSubmit={handleUpdateSubmit}
                submitLabel="Update Session"
            />
        </div>
    );
};

export default UpdateSession;