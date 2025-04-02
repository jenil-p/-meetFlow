"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import SessionList from "../components/SessionList";

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading" || !session) return;

    const fetchSessions = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/sessions", { credentials: "include" });
        const data = await res.json();
        if (res.ok) {
          setSessions(data);
        } else {
          toast.error("Failed to fetch sessions: " + (data.message || "Unknown error"));
        }
      } catch (error) {
        toast.error("Error fetching sessions: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [session, status]);

  const handleRegister = (sessionId) => {
    const registeredSession = sessions.find((sess) => sess._id === sessionId);
    const sessionTitle = registeredSession ? registeredSession.title : "Unknown Session";
    toast.success(`Successfully registered for "${sessionTitle}"`);
    const fetchSessions = async () => {
      try {
        const res = await fetch("/api/sessions", { credentials: "include" });
        const data = await res.json();
        if (res.ok) {
          setSessions(data);
        }
      } catch (error) {
        toast.error("Error refreshing sessions: " + error.message);
      }
    };
    fetchSessions();
  };

  return (
    <SessionList
      sessions={sessions}
      loading={loading}
      handleRegister={handleRegister}
      userEmail={session?.user.email}
    />
  );
}