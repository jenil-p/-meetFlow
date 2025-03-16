"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ConferenceList() {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConferences = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/conferences");
        const data = await res.json();
        if (res.ok) {
          setConferences(data);
        } else {
          setError(data.message || "Failed to fetch conferences");
        }
      } catch (error) {
        setError("Error fetching conferences: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConferences();
  }, []); // Empty dependency array: fetch only once on mount

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? "Date not set" : parsedDate.toLocaleDateString();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl playfair-display-sc-regular font-bold text-gray-800 mb-4">
        Conferences
      </h1>
      <Link
        href="/admindash/conference/add"
        className="inline-block bg-yellow-700 text-white px-4 py-2 rounded-lg hover:bg-yellow-800 transition-all duration-200 shadow-md mb-4"
      >
        Add New Conference
      </Link>

      {loading && <p className="text-sm text-gray-600">Loading conferences...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

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
                  Starts: {formatDate(conference.startDate)}, Ends: {formatDate(conference.endDate)}
                </p>
                {conference.location && (
                  <p className="text-sm text-gray-600">Location: {conference.location}</p>
                )}
              </div>
              <div className="space-x-2">
                <Link
                  href={`/admindash/conference/update?id=${conference._id}`}
                  className="text-yellow-700 hover:underline"
                >
                  Edit
                </Link>
                <Link
                  href={`/admindash/conference/delete?id=${conference._id}`}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}