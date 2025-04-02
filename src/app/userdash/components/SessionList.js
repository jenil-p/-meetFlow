import React from "react";
import RegisterSession from "./session/RegisterSession";

export default function SessionList({
  sessions,
  loading,
  handleRegister,
  userEmail,
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl playfair-display-sc-regular font-semibold mb-4 text-gray-800">
        Register for Session
      </h2>
      {loading && <p className="text-sm text-gray-600">Loading sessions...</p>}
      {sessions.length === 0 && !loading ? (
        <p className="text-gray-600">No sessions available.</p>
      ) : (
        <div className="flex flex-col justify-start items-center gap-4 overflow-y-auto max-h-[500px] pb-20">
          {sessions.map((sess) => (
            <div
              key={sess._id}
              className="bg-gray-50 p-4 h-32 w-full rounded-2xl shadow-lg flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{sess.title}</h2>
                <p className="text-sm text-gray-600">
                  Conference: {sess.conference?.name || "Not set"}
                </p>
                <p className="text-sm text-gray-600">
                  Starts: {new Date(sess.startTime).toLocaleString()}, Ends:{" "}
                  {new Date(sess.endTime).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Room: {sess.room?.roomNumber || "Not set"}
                </p>
              </div>
              <div className="space-x-2 flex items-center">
                <RegisterSession
                  sessionId={sess._id}
                  onRegister={handleRegister}
                  userEmail={userEmail}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}