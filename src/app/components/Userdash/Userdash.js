"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import RegisterSession from "./session/RegisterSession";

export default function Userdash() {
    const { data: session, status } = useSession();
    const router = useRouter();
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
        // Find the session title from the sessions array
        const registeredSession = sessions.find((sess) => sess._id === sessionId);
        const sessionTitle = registeredSession ? registeredSession.title : "Unknown Session";
        setMessage(`Successfully registered for "${sessionTitle}"`);
    };

    if (status === "loading") {
        return <p className="text-white text-center">Loading...</p>;
    }

    if (!session || session.user.role !== "USER") {
        return null; // User is redirected
    }

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white">
            <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>
            {message && <p className="mb-4 text-sm text-gray-300">{message}</p>}
            <RegisterSession sessions={sessions} onRegister={handleRegister} />
        </div>
    );
}