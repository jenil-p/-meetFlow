"use client";

import { useState } from "react";

const DeleteConference = ({ conferences, setMessage, setConferences }) => {
    const [selectedConferenceId, setSelectedConferenceId] = useState("");

    const handleConferenceChange = (e) => {
        setSelectedConferenceId(e.target.value);
    };

    const handleDeleteSubmit = async () => {
        setMessage("");

        if (!selectedConferenceId) {
            setMessage("Please select a conference to delete");
            return;
        }

        if (confirm("Are you sure you want to delete this conference?")) {
            try {
                const res = await fetch(`/api/conferences?id=${selectedConferenceId}`, {
                    method: "DELETE",
                    credentials: "include",
                });

                const data = await res.json();
                if (res.ok) {
                    setMessage("Conference deleted successfully!");
                    setSelectedConferenceId("");
                    // Refresh conferences list
                    const confRes = await fetch("/api/conferences", { credentials: "include" });
                    const confData = await confRes.json();
                    if (confRes.ok) {
                        setConferences(confData);
                    }
                } else {
                    setMessage(data.message || "Failed to delete conference");
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
            <h2 className="text-2xl mb-4">Delete Conference</h2>
            <div className="flex flex-col">
                <label className="mb-1">Select Conference to Delete:</label>
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
                <div>
                    <p>Selected Conference: {conferences.find((c) => c._id.toString() === selectedConferenceId)?.name}</p>
                    <p>Starts: {formatDate(conferences.find((c) => c._id.toString() === selectedConferenceId)?.startDate)}</p>
                    <p>Ends: {formatDate(conferences.find((c) => c._id.toString() === selectedConferenceId)?.endDate)}</p>
                    <button
                        className="bg-red-500 text-white rounded-md p-2 mt-4"
                        onClick={handleDeleteSubmit}
                    >
                        Delete Conference
                    </button>
                </div>
            )}
        </div>
    );
};

export default DeleteConference;