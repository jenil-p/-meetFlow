"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const RegisterSession = ({ sessions, onRegister }) => {
    const { data: session } = useSession();
    const [selectedSessionId, setSelectedSessionId] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async () => {
        if (!selectedSessionId || !session?.user?.email) {
            setMessage("Please select a session and ensure you are logged in.");
            return;
        }

        try {
            const res = await fetch("/api/registrations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userEmail: session.user.email,
                    sessionId: selectedSessionId,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                const registeredSession = sessions.find((sess) => sess._id === selectedSessionId);
                const sessionTitle = registeredSession ? registeredSession.title : "Unknown Session";
                setMessage(`Successfully registered for "${sessionTitle}"!`);
                onRegister(selectedSessionId); // Callback to update parent state
            } else {
                setMessage(data.message || "Registration failed");
            }
        } catch (error) {
            setMessage("Error: " + error.message);
        }
    };

    return (
        <div className="my-4 flex gap-4 items-center justify-normal">
            {/* <h2 className="text-lg font-semibold text-gray-200 mb-2">Register for Session</h2> */}
            <select
                className="border border-gray-300 text-black rounded-md p-1 text-sm w-full max-w-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
            >
                <option value="">Select a session</option>
                {sessions.map((sess) => (
                    <option key={sess._id} value={sess._id}>
                        {`${sess.title} - ${new Date(sess.startTime).toLocaleString()} (${sess.room?.roomNumber || "No location"})`}
                    </option>
                ))}
            </select>
            <button
                onClick={handleRegister}
                className=" bg-blue-600 text-white rounded-md p-1 px-2 text-sm hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
                Register
            </button>
            {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
        </div>
    );
};

export default RegisterSession;