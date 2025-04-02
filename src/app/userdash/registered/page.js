"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import RegisteredSessionsList from "../components/RegisteredSessionsList";
import ReviewModal from "../components/reviews/ReviewModal";

export default function RegisteredPage() {
  const { data: session, status } = useSession();
  const [registeredSessions, setRegisteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (status === "loading" || !session) return;

    const fetchRegisteredSessions = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/registrations?id=${session.user.id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setRegisteredSessions(data);
        } else {
          toast.error("Failed to fetch registered sessions: " + (data.message || "Unknown error"));
        }
      } catch (error) {
        toast.error("Error fetching registered sessions: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRegisteredSessions();
  }, [session, status]);

  const handleCancel = async (registrationId, sessionTitle) => {
    if (!confirm(`Are you sure you want to cancel your registration for "${sessionTitle}"?`)) {
      return;
    }

    try {
      const res = await fetch("/api/registrations", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: registrationId }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Successfully canceled registration for "${sessionTitle}"`);
        const updatedSessions = registeredSessions.filter((reg) => reg._id !== registrationId);
        setRegisteredSessions(updatedSessions);
      } else {
        toast.error(data.message || "Failed to cancel registration");
      }
    } catch (error) {
      toast.error("Error canceling registration: " + error.message);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        toast.success("Review submitted successfully!");
        setTimeout(() => {
          setSelectedSession(null);
          setRating(0);
          setComment("");
        }, 1500);
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  return (
    <>
      <RegisteredSessionsList
        registeredSessions={registeredSessions}
        loading={loading}
        setSelectedSession={setSelectedSession}
        handleCancel={handleCancel}
      />
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
          handleReviewSubmit={handleReviewSubmit}
        />
      )}
    </>
  );
}