"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import RegisterSession from "./session/RegisterSession";
import RequestPaperSession from "./requests/RequestPaperSession";
import WriteReview from "./reviews/WriteReview";

export default function Userdash() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState("registerSession");
    const [sessions, setSessions] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (status === "loading") return;
        if (!session || session.user.role !== "USER") {
            router.push("/login");
            return;
        }

        const fetchSessions = async () => {
            try {
                const res = await fetch("/api/sessions", { credentials: "include" });
                const data = await res.json();
                if (res.ok) {
                    setSessions(data);
                } else {
                    setMessage("Failed to fetch sessions");
                }
            } catch (error) {
                setMessage("Error fetching sessions: " + error.message);
            }
        };
        fetchSessions();
    }, [session, status, router]);

    const handleRegister = (sessionId) => {
        const registeredSession = sessions.find((sess) => sess._id === sessionId);
        const sessionTitle = registeredSession ? registeredSession.title : "Unknown Session";
        setMessage(`Successfully registered for "${sessionTitle}"`);
    };

    if (status === "loading") {
        return <p className="text-gray-800 text-center">Loading...</p>;
    }

    if (!session || session.user.role !== "USER") {
        return null; // User is redirected
    }

    return (
        <div className="min-h-screen bg-gray-50 text-black">
            <div className="max-w-7xl mx-auto py-12 px-6 lg:px-12">
                {/* Header */}
                <h1 className="text-4xl playfair-display-sc-regular font-bold mb-6 text-gray-800">User Dashboard</h1>

                {/* Navigation Menu */}
                <div className="mb-8">
                    <nav className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow-lg">
                        {[
                            { name: "registerSession", label: "Register for Session" },
                            { name: "requestPaperSession", label: "Request Paper/Session" },
                            { name: "writeReview", label: "Write Review" },
                        ].map((tab) => (
                            <button
                                key={tab.name}
                                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                                    activeTab === tab.name
                                        ? "bg-yellow-700 text-white shadow-md"
                                        : "bg-gray-100 text-gray-800 hover:bg-yellow-50"
                                }`}
                                onClick={() => setActiveTab(tab.name)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sidebar or Info Panel (Left Column) */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl playfair-display-sc-regular font-semibold mb-4 text-gray-800">User Info</h2>
                        <p className="text-gray-600">Welcome, {session?.user?.email || "User"}!</p>
                        <p className="text-gray-600 mt-2">Role: {session?.user?.role || "USER"}</p>
                    </div>

                    {/* Content Area (Right Column) */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        {activeTab === "registerSession" && (
                            <div className="space-y-4">
                                <h2 className="text-2xl playfair-display-sc-regular font-semibold mb-4 text-gray-800">Register for Session</h2>
                                <RegisterSession
                                    sessions={sessions}
                                    onRegister={handleRegister}
                                />
                                {message && <p className="text-sm text-yellow-700">{message}</p>}
                            </div>
                        )}
                        {activeTab === "requestPaperSession" && (
                            <div className="space-y-4">
                                <RequestPaperSession />
                                <div className="text-center text-gray-500">
                                    <h2 className="text-2xl playfair-display-sc-regular font-semibold mb-4 text-gray-800">
                                        {activeTab
                                            .split(/(?=[A-Z])/)
                                            .join(" ")
                                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                                    </h2>
                                    <p>Feature under development. Check back soon!</p>
                                </div>
                            </div>
                        )}
                        {activeTab === "writeReview" && (
                            <div className="space-y-4">
                                <WriteReview />
                                <div className="text-center text-gray-500">
                                    <h2 className="text-2xl playfair-display-sc-regular font-semibold mb-4 text-gray-800">
                                        {activeTab
                                            .split(/(?=[A-Z])/)
                                            .join(" ")
                                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                                    </h2>
                                    <p>Feature under development. Check back soon!</p>
                                </div>
                            </div>
                        )}
                        {activeTab !== "registerSession" &&
                            activeTab !== "requestPaperSession" &&
                            activeTab !== "writeReview" && (
                                <div className="text-center text-gray-500">
                                    <h2 className="text-2xl playfair-display-sc-regular font-semibold mb-4 text-gray-800">
                                        {activeTab
                                            .split(/(?=[A-Z])/)
                                            .join(" ")
                                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                                    </h2>
                                    <p>Feature under development. Check back soon!</p>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}