"use client";

import { useState, useEffect } from "react";
import AddConference from "@/app/components/Conference/AddConference";
import UpdateConference from "@/app/components/Conference/UpdateConference";
import DeleteConference from "@/app/components/Conference/DeleteConference";

export default function ConferencesPage() {
    const [conferences, setConferences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
    });
    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showDeleteForm, setShowDeleteForm] = useState(false);
    const [selectedConferenceId, setSelectedConferenceId] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                const confRes = await fetch("/api/conferences", { credentials: "include" });
                const confData = await confRes.json();
                if (confRes.ok) {
                    setConferences(confData);
                } else {
                    setError("Failed to fetch conferences: " + (confData.message || "Unknown error"));
                }
            } catch (error) {
                setError("Error fetching data: " + error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSuccess = () => {
        setFormData({
            name: "",
            description: "",
            startDate: "",
            endDate: "",
            location: "",
        });
        setShowAddForm(false);
        setShowUpdateForm(false);
        setShowDeleteForm(false);
        setSelectedConferenceId("");
        setMessage("");
        const fetchConferences = async () => {
            try {
                const res = await fetch("/api/conferences", { credentials: "include" });
                const data = await res.json();
                if (res.ok) {
                    setConferences(data);
                }
            } catch (error) {
                setError("Error refreshing conferences: " + error.message);
            }
        };
        fetchConferences();
    };

    const handleEditClick = (conferenceId) => {
        const selectedConference = conferences.find((c) => c._id === conferenceId);
        if (selectedConference) {
            setFormData({
                name: selectedConference.name || "",
                description: selectedConference.description || "",
                startDate: selectedConference.startDate ? new Date(selectedConference.startDate).toISOString().slice(0, 16) : "",
                endDate: selectedConference.endDate ? new Date(selectedConference.endDate).toISOString().slice(0, 16) : "",
                location: selectedConference.location || "",
            });
        }
        setSelectedConferenceId(conferenceId);
        setShowUpdateForm(true);
        setShowAddForm(false);
        setShowDeleteForm(false);
        setMessage("");
    };

    const handleDeleteClick = (conferenceId) => {
        setSelectedConferenceId(conferenceId);
        setShowDeleteForm(true);
        setShowAddForm(false);
        setShowUpdateForm(false);
        setMessage("");
    };

    return (
        <>
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 playfair-display-sc-regular">
                    Conferences
                </h2>
                <button
                    onClick={() => {
                        setShowAddForm(!showAddForm);
                        setShowUpdateForm(false);
                        setShowDeleteForm(false);
                        setFormData({
                            name: "",
                            description: "",
                            startDate: "",
                            endDate: "",
                            location: "",
                        });
                        setMessage("");
                    }}
                    className="inline-block bg-yellow-700 text-white px-4 py-2 rounded-lg hover:bg-yellow-800 transition-all duration-200 shadow-md mb-4"
                >
                    {showAddForm ? "Cancel Add Conference" : "Add New Conference"}
                </button>

                {message && <p className="text-sm text-green-600 mb-4">{message}</p>}
                {loading && <p className="text-sm text-gray-600">Loading conferences...</p>}
                {error && <p className="text-sm text-red-500">{error}</p>}

                {showAddForm && (
                    <AddConference
                        formData={formData}
                        handleChange={handleChange}
                        setMessage={setMessage}
                        setConferences={setConferences}
                        setFormData={setFormData}
                        onSuccess={handleSuccess}
                    />
                )}

                {showUpdateForm && (
                    <div className="space-y-4">
                        <button
                            onClick={() => {
                                setShowUpdateForm(false);
                                setFormData({
                                    name: "",
                                    description: "",
                                    startDate: "",
                                    endDate: "",
                                    location: "",
                                });
                                setSelectedConferenceId("");
                                setMessage("");
                            }}
                            className="inline-block bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-md mb-4"
                        >
                            Cancel Update Conference
                        </button>
                        <UpdateConference
                            formData={formData}
                            conferences={conferences}
                            handleChange={handleChange}
                            setMessage={setMessage}
                            setConferences={setConferences}
                            setFormData={setFormData}
                            onSuccess={handleSuccess}
                            preSelectedConferenceId={selectedConferenceId}
                        />
                    </div>
                )}

                {showDeleteForm && (
                    <div className="space-y-4">
                        <button
                            onClick={() => {
                                setShowDeleteForm(false);
                                setSelectedConferenceId("");
                                setMessage("");
                            }}
                            className="inline-block bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-md mb-4"
                        >
                            Cancel Delete Conference
                        </button>
                        <DeleteConference
                            conferences={conferences}
                            setMessage={setMessage}
                            setConferences={setConferences}
                            onSuccess={handleSuccess}
                            preSelectedConferenceId={selectedConferenceId}
                        />
                    </div>
                )}

                {conferences.length === 0 && !loading && !error ? (
                    <p className="text-gray-600">No conferences found.</p>
                ) : (
                    <div className="grid gap-4">
                        {conferences.map((conference) => (
                            <div
                                key={conference._id}
                                className="bg-gray-50 p-4 rounded-2xl shadow-lg flex justify-between items-center"
                            >
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">{conference.name}</h2>
                                    <p className="text-sm text-gray-600">
                                        Starts: {new Date(conference.startDate).toLocaleString()}, Ends: {new Date(conference.endDate).toLocaleString()}
                                    </p>
                                    {conference.location && (
                                        <p className="text-sm text-gray-600">Location: {conference.location}</p>
                                    )}
                                </div>
                                <div className="space-x-2 flex items-center">
                                    <button
                                        onClick={() => handleEditClick(conference._id)}
                                        className="text-yellow-700 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(conference._id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}