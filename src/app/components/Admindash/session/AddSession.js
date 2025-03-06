"use client";

import SessionForm from "../../SessionForm";

const AddSession = ({ formData, conferences, rooms, resources, handleChange, setMessage, setSessions, setFormData }) => {
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

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
                setMessage("Session added successfully!");
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
                // Refresh sessions list
                const sessRes = await fetch("/api/sessions", { credentials: "include" });
                const sessData = await sessRes.json();
                if (sessRes.ok) {
                    setSessions(sessData);
                }
            } else {
                setMessage(data.message || "Failed to add session");
            }
        } catch (error) {
            setMessage("Error: " + error.message);
        }
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
            />
        </div>
    );
};

export default AddSession;