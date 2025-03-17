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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (status === "loading") return;
        if (!session || session.user.role !== "USER") {
            router.push("/login");
            return;
        }

        const fetchSessions = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await fetch("/api/sessions", { credentials: "include" });
                const data = await res.json();
                if (res.ok) {
                    setSessions(data);
                } else {
                    setError("Failed to fetch sessions: " + (data.message || "Unknown error"));
                }
            } catch (error) {
                setError("Error fetching sessions: " + error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, [session, status, router]);

    const handleRegister = (sessionId) => {
        const registeredSession = sessions.find((sess) => sess._id === sessionId);
        const sessionTitle = registeredSession ? registeredSession.title : "Unknown Session";
        setMessage(`Successfully registered for "${sessionTitle}"`);
        // Optionally refetch sessions to reflect updated registration status
        const fetchSessions = async () => {
            try {
                const res = await fetch("/api/sessions", { credentials: "include" });
                const data = await res.json();
                if (res.ok) {
                    setSessions(data);
                }
            } catch (error) {
                setError("Error refreshing sessions: " + error.message);
            }
        };
        fetchSessions();
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
                                <h2 className="text-2xl playfair-display-sc-regular font-semibold mb-4 text-gray-800">
                                    Register for Session
                                </h2>
                                {message && <p className="text-sm text-green-600 mb-4">{message}</p>}
                                {loading && <p className="text-sm text-gray-600">Loading sessions...</p>}
                                {error && <p className="text-sm text-red-500">{error}</p>}
                                {sessions.length === 0 && !loading && !error ? (
                                    <p className="text-gray-600">No sessions available.</p>
                                ) : (
                                    <div className="grid gap-4">
                                        {sessions.map((sess) => (
                                            <div
                                                key={sess._id}
                                                className="bg-gray-50 p-4 rounded-2xl shadow-lg flex justify-between items-center"
                                            >
                                                <div>
                                                    <h2 className="text-lg font-semibold text-gray-800">{sess.title}</h2>
                                                    <p className="text-sm text-gray-600">
                                                        Conference: {sess.conference?.name || "Not set"}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Starts: {new Date(sess.startTime).toLocaleString()}, Ends: {new Date(sess.endTime).toLocaleString()}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Room: {sess.room?.roomNumber || "Not set"}
                                                    </p>
                                                </div>
                                                <div className="space-x-2 flex items-center">
                                                    <RegisterSession
                                                        sessionId={sess._id}
                                                        onRegister={handleRegister}
                                                        userEmail={session.user.email}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === "requestPaperSession" && (
                            <div className="space-y-4">
                                <RequestPaperSession />
                                <div className="text-center text-gray-500">
                                    <h2 className="text-2xl playfair-display-sc-regular font-semibold mb-4 text-gray-800">
                                        Request Paper/Session
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
                                        Write Review
                                    </h2>
                                    <p>Feature under development. Check back soon!</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}