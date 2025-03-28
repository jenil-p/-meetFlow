"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const DeleteSession = ({ sessions, setSessions, onSuccess, preSelectedSessionId }) => {
    const [selectedSessionId, setSelectedSessionId] = useState(preSelectedSessionId || "");

    useEffect(() => {
        setSelectedSessionId(preSelectedSessionId || "");
    }, [preSelectedSessionId]);

    const handleDeleteSubmit = async () => {
        if (!selectedSessionId) {
            toast.error("No session selected to delete");
            return;
        }

        if (confirm("Are you sure you want to delete this session?")) {
            try {
                const res = await fetch(`/api/sessions?id=${selectedSessionId}`, {
                    method: "DELETE",
                    credentials: "include",
                });

                const data = await res.json();
                if (res.ok) {
                    toast.success("Session deleted successfully!");
                    setSelectedSessionId("");
                    const sessRes = await fetch("/api/sessions", { credentials: "include" });
                    const sessData = await sessRes.json();
                    if (sessRes.ok) {
                        setSessions(sessData);
                    }
                    onSuccess();
                } else {
                    toast.error(data.message || "Failed to delete session");
                }
            } catch (error) {
                toast.error("Error: " + error.message);
            }
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl mb-4">Delete Session</h2>
            {selectedSessionId && (
                <div>
                    <p>
                        Selected Session: {sessions.find((s) => s._id.toString() === selectedSessionId)?.title}
                    </p>
                    <p>
                        Conference: {sessions.find((s) => s._id.toString() === selectedSessionId)?.conference?.name}
                    </p>
                    <p>
                        Date: {new Date(sessions.find((s) => s._id.toString() === selectedSessionId)?.startTime).toLocaleString()}
                    </p>
                    <button
                        className="bg-red-500 text-white rounded-md p-2 mt-4"
                        onClick={handleDeleteSubmit}
                    >
                        Delete Session
                    </button>
                </div>
            )}
        </div>
    );
};

export default DeleteSession;