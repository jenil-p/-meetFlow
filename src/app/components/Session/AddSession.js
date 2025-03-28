"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SessionForm from "./SessionForm";

const AddSession = ({ formData, conferences, rooms, resources, handleChange, setSessions, setFormData }) => {
    const [conferenceRange, setConferenceRange] = useState({ startDate: null, endDate: null });
    const [existingSessions, setExistingSessions] = useState([]);

    // Update conferenceRange when conference changes
    useEffect(() => {
        if (formData.conference) {
            const selectedConference = conferences.find((conf) => conf._id === formData.conference);
            if (selectedConference) {
                setConferenceRange({
                    startDate: new Date(selectedConference.startDate),
                    endDate: new Date(selectedConference.endDate),
                });
                // Reset startTime and endTime if they are outside the new range
                if (
                    formData.startTime &&
                    (new Date(formData.startTime) < new Date(selectedConference.startDate) ||
                        new Date(formData.startTime) > new Date(selectedConference.endDate))
                ) {
                    setFormData((prev) => ({ ...prev, startTime: "" }));
                }
                if (
                    formData.endTime &&
                    (new Date(formData.endTime) < new Date(selectedConference.startDate) ||
                        new Date(formData.endTime) > new Date(selectedConference.endDate))
                ) {
                    setFormData((prev) => ({ ...prev, endTime: "" }));
                }
            }
        } else {
            setConferenceRange({ startDate: null, endDate: null });
        }
    }, [formData.conference, conferences, setFormData]);

    // Fetch existing sessions when component mounts or conference changes
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await fetch("/api/sessions", { credentials: "include" });
                if (res.ok) {
                    const data = await res.json();
                    setExistingSessions(data);
                }
            } catch (error) {
                console.error("Error fetching sessions:", error);
            }
        };
        fetchSessions();
    }, [formData.conference]);

    const handleAddSubmit = async (e) => {
        e.preventDefault();

        // Preliminary client-side overlap check
        const sessionStart = new Date(formData.startTime);
        const sessionEnd = new Date(formData.endTime);
        const hasOverlap = existingSessions.some((session) => {
            const existingStart = new Date(session.startTime);
            const existingEnd = new Date(session.endTime);
            return (
                session.room === formData.room &&
                isTimeOverlap(sessionStart, sessionEnd, existingStart, existingEnd)
            );
        });

        if (hasOverlap) {
            toast.warn("This session may overlap with an existing session in the same room. Please verify or adjust the time/room.");
            return;
        }

        try {
            const res = await fetch("/api/sessions", {
                method: "POST",
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
                toast.success("Session added successfully!");
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
                const sessRes = await fetch("/api/sessions", { credentials: "include" });
                const sessData = await sessRes.json();
                if (sessRes.ok) {
                    setSessions(sessData);
                    setExistingSessions(sessData); // Update existing sessions
                }
            } else {
                toast.error(data.message || "Failed to add session");
            }
        } catch (error) {
            toast.error("Error: " + error.message);
        }
    };

    // Helper function to check time overlap
    const isTimeOverlap = (start1, end1, start2, end2) => {
        return start1 < end2 && start2 < end1;
    };

    return (
        <div>
            <h2 className="text-2xl mb-4">Add New Session</h2>
            <SessionForm
                formData={formData}
                conferences={conferences}
                rooms={rooms}
                resources={resources}
                handleChange={handleChange}
                handleSubmit={handleAddSubmit}
                submitLabel="Add Session"
                conferenceRange={conferenceRange}
            />
        </div>
    );
};

export default AddSession;