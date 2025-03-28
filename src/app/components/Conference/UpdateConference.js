"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ConferenceForm from "./ConferenceForm";

const UpdateConference = ({
    formData,
    conferences,
    handleChange,
    setConferences,
    setFormData,
    onSuccess,
    preSelectedConferenceId,
}) => {
    const [selectedConferenceId, setSelectedConferenceId] = useState(preSelectedConferenceId || "");

    useEffect(() => {
        setSelectedConferenceId(preSelectedConferenceId || "");
        if (preSelectedConferenceId) {
            const conference = conferences.find((c) => c._id.toString() === preSelectedConferenceId);
            if (conference) {
                setFormData({
                    name: conference.name || "",
                    description: conference.description || "",
                    startDate: conference.startDate ? new Date(conference.startDate).toISOString().slice(0, 10) : "",
                    endDate: conference.endDate ? new Date(conference.endDate).toISOString().slice(0, 10) : "",
                    location: conference.location || "",
                });
            }
        }
    }, [preSelectedConferenceId, conferences, setFormData]);

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        if (!selectedConferenceId) {
            toast.error("No conference selected to update");
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
                    toast.success("Conference updated successfully!");
                    const confRes = await fetch("/api/conferences", { credentials: "include" });
                    const confData = await confRes.json();
                    if (confRes.ok) {
                        setConferences(confData);
                    }
                    setFormData({
                        name: "",
                        description: "",
                        startDate: "",
                        endDate: "",
                        location: "",
                    });
                    onSuccess();
                } else {
                    toast.error(data.message || "Failed to update conference");
                }
            } catch (error) {
                toast.error("Error: " + error.message);
            }
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl mb-4">Update Conference</h2>
            <ConferenceForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleUpdateSubmit}
                submitLabel="Update Conference"
            />
        </div>
    );
};

export default UpdateConference;