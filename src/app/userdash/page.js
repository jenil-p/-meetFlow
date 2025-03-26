"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserInfo from "./UserInfo";
import NavMenu from "./NavMenu";
import SessionList from "./SessionList";
import RegisteredSessionsList from "./RegisteredSessionsList";
import ReviewModal from "./reviews/ReviewModal";
import RequestPaperSession from "./requests/RequestPaperSession";

export default function Userdash() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("registerSession");
  const [sessions, setSessions] = useState([]);
  const [registeredSessions, setRegisteredSessions] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSession, setSelectedSession] = useState(null); // For review modal
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

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

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "USER") {
      router.push("/login");
      return;
    }

    const fetchRegisteredSessions = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/registrations?id=${session.user.id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setRegisteredSessions(data);
        } else {
          setError(
            "Failed to fetch registered sessions: " + (data.message || "Unknown error")
          );
        }
      } catch (error) {
        setError("Error fetching registered sessions: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    if (activeTab === "registeredSessions") {
      fetchRegisteredSessions();
    }
  }, [session, activeTab]);

  const handleRegister = (sessionId) => {
    const registeredSession = sessions.find((sess) => sess._id === sessionId);
    const sessionTitle = registeredSession ? registeredSession.title : "Unknown Session";
    setMessage(`Successfully registered for "${sessionTitle}"`);
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewMessage("");

    if (!rating || rating < 1 || rating > 5) {
      setReviewMessage("Please select a rating between 1 and 5.");
      return;
    }

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          sessionId: selectedSession._id,
          rating,
          comment,
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        setReviewMessage("Review submitted successfully!");
        setTimeout(() => {
          setSelectedSession(null);
          setRating(0);
          setComment("");
          setReviewMessage("");
        }, 1500);
      } else {
        setReviewMessage(data.message || "Failed to submit review");
      }
    } catch (error) {
      setReviewMessage("Error: " + error.message);
    }
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
        <h1 className="text-4xl playfair-display-sc-regular font-bold mb-6 text-gray-800">
          User Dashboard
        </h1>

        {/* Navigation Menu */}
        <NavMenu activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar (User Info) */}
          <UserInfo user={session.user} />

          {/* Content Area */}
          <div
            className={`lg:col-span-2 bg-white p-6 rounded-lg shadow-md transition-all duration-300 ${
              selectedSession ? "blur-sm" : ""
            }`}
          >
            {activeTab === "registerSession" && (
              <SessionList
                sessions={sessions}
                loading={loading}
                error={error}
                message={message}
                handleRegister={handleRegister}
                userEmail={session.user.email}
              />
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
            {activeTab === "registeredSessions" && (
              <RegisteredSessionsList
                registeredSessions={registeredSessions}
                loading={loading}
                error={error}
                setSelectedSession={setSelectedSession}
              />
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {selectedSession && (
        <ReviewModal
          selectedSession={selectedSession}
          setSelectedSession={setSelectedSession}
          rating={rating}
          setRating={setRating}
          hoverRating={hoverRating}
          setHoverRating={setHoverRating}
          comment={comment}
          setComment={setComment}
          reviewMessage={reviewMessage}
          setReviewMessage={setReviewMessage}
          handleReviewSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
}