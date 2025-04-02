"use client";

import { toast } from "react-toastify";

const RegisterSession = ({ sessionId, onRegister, userEmail }) => {
  const handleRegister = async () => {
    if (!sessionId || !userEmail) {
      toast.error("Session ID or user email is missing.");
      return;
    }

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: userEmail,
          sessionId: sessionId,
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        onRegister(sessionId); // Callback to update parent state
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleRegister}
        className="bg-yellow-600 text-white rounded-md p-1 px-2 text-sm hover:bg-yellow-700 focus:outline-none focus:ring-1 focus:ring-yellow-600"
      >
        Register
      </button>
    </div>
  );
};

export default RegisterSession;