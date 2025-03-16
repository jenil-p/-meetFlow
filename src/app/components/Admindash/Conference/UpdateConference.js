"use client";

import { useState } from "react";
import ConferenceForm from "../../ConferenceForm";

const UpdateConference = ({
    formData,
    conferences,
    handleChange,
    setMessage,
    setConferences,
    setFormData,
    onSuccess,
}) => {
    const [selectedConferenceId, setSelectedConferenceId] = useState("");

    const handleConferenceChange = (e) => {
        const conferenceId = e.target.value;
        setSelectedConferenceId(conferenceId);
        if (conferenceId) {
            const conference = conferences.find((c) => c._id.toString() === conferenceId);
            if (conference) {
                setFormData({
                    name: conference.name || "",
                    description: conference.description || "",
                    startDate: conference.startDate ? new Date(conference.startDate).toISOString() : "",
                    endDate: conference.endDate ? new Date(conference.endDate).toISOString() : "",
                    location: conference.location || "",
                });
            }
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!selectedConferenceId) {
            setMessage("Please select a conference to update");
            return;
        }

        if (confirm("Are you sure you want to update this conference?")) {
            try {
                const res = await fetch(`/api/conferences?id=${selectedConferenceId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        description: formData.description,
                        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
                        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
                        location: formData.location,
                    }),
                    credentials: "include",
                });

                const data = await res.json();
                if (res.ok) {
                    setMessage("Conference updated successfully!");
                    // Refresh conferences list
                    const confRes = await fetch("/api/conferences", { credentials: "include" });
                    const confData = await confRes.json();
                    if (confRes.ok) {
                        setConferences(confData);
                    }
                    // Clear the form
                    setFormData({
                        name: "",
                        description: "",
                        startDate: "",
                        endDate: "",
                        location: "",
                    });
                    setSelectedConferenceId("");
                    onSuccess(); // Reset sub-tab
                } else {
                    setMessage(data.message || "Failed to update conference");
                }
            } catch (error) {
                setMessage("Error: " + error.message);
            }
        }
    };

    const formatDate = (date) => {
        const parsedDate = new Date(date);
        return isNaN(parsedDate.getTime()) ? "Date not set" : parsedDate.toLocaleDateString();
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl mb-4">Update Conference</h2>
            <div className="flex flex-col">
                <label className="mb-1">Select Conference to Update:</label>
                <select
                    className="bg-gray-200 text-black rounded-md p-2"
                    value={selectedConferenceId}
                    onChange={handleConferenceChange}
                >
                    <option value="">Select a conference</option>
                    {conferences.map((conf) => (
                        <option key={conf._id} value={conf._id}>
                            {`${conf.name} (Starts: ${formatDate(conf.startDate)}, Ends: ${formatDate(conf.endDate)})`}
                        </option>
                    ))}
                </select>
            </div>

            {selectedConferenceId && (
                <ConferenceForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleUpdateSubmit}
                    submitLabel="Update Conference"
                />
            )}
        </div>
    );
};

export default UpdateConference;