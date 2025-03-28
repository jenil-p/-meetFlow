"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const DeleteConference = ({ conferences, setConferences, onSuccess, preSelectedConferenceId }) => {
    const [selectedConferenceId, setSelectedConferenceId] = useState(preSelectedConferenceId || "");

    useEffect(() => {
        setSelectedConferenceId(preSelectedConferenceId || "");
    }, [preSelectedConferenceId]);

    const handleDeleteSubmit = async () => {
        if (!selectedConferenceId) {
            toast.error("No conference selected to delete");
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
                    toast.success("Conference deleted successfully!");
                    setSelectedConferenceId("");
                    const confRes = await fetch("/api/conferences", { credentials: "include" });
                    const confData = await confRes.json();
                    if (confRes.ok) {
                        setConferences(confData);
                    }
                    onSuccess();
                } else {
                    toast.error(data.message || "Failed to delete conference");
                }
            } catch (error) {
                toast.error("Error: " + error.message);
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