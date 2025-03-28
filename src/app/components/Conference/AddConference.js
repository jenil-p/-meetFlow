"use client";

import { toast } from "react-toastify";
import ConferenceForm from "./ConferenceForm";

const AddConference = ({
    formData,
    handleChange,
    setConferences,
    setFormData,
    onSuccess,
}) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/conferences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
                toast.success("Conference created successfully!");
                setFormData({
                    name: "",
                    description: "",
                    startDate: "",
                    endDate: "",
                    location: "",
                });
                // Refresh conferences list
                const confRes = await fetch("/api/conferences", { credentials: "include" });
                const confData = await confRes.json();
                if (confRes.ok) {
                    setConferences(confData);
                }
                onSuccess(); // Reset sub-tab
            } else {
                toast.error(data.message || "Failed to create conference");
            }
        } catch (error) {
            toast.error("Error creating conference: " + error.message);
        }
    };

    return (
        <div>
            <h2 className="text-2xl mb-4">Add New Conference</h2>
            <ConferenceForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                submitLabel="Create Conference"
            />
        </div>
    );
};

export default AddConference;