"use client";

import { useState, useEffect } from "react";

const DeleteConference = ({ conferences, setMessage, setConferences, onSuccess, preSelectedConferenceId }) => {
    const [selectedConferenceId, setSelectedConferenceId] = useState(preSelectedConferenceId || "");

    useEffect(() => {
        setSelectedConferenceId(preSelectedConferenceId || "");
    }, [preSelectedConferenceId]);

    const handleDeleteSubmit = async () => {
        setMessage("");

        if (!selectedConferenceId) {
            setMessage("No conference selected to delete");
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
                    const confRes = await fetch("/api/conferences", { credentials: "include" });
                    const confData = await confRes.json();
                    if (confRes.ok) {
                        setConferences(confData);
                    }
                    onSuccess();
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
            {selectedConferenceId && (
                <div>
                    <p>
                        Selected Conference: {conferences.find((c) => c._id.toString() === selectedConferenceId)?.name}
                    </p>
                    <p>
                        Starts: {formatDate(conferences.find((c) => c._id.toString() === selectedConferenceId)?.startDate)}
                    </p>
                    <p>
                        Ends: {formatDate(conferences.find((c) => c._id.toString() === selectedConferenceId)?.endDate)}
                    </p>
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