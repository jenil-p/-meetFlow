import React from "react";

export default function RegisteredSessionsList({
  registeredSessions,
  loading,
  setSelectedSession,
  handleCancel,
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl playfair-display-sc-regular font-semibold mb-4 text-gray-800">
        Registered Sessions
      </h2>
      {loading && <p className="text-sm text-gray-600">Loading sessions...</p>}
      {registeredSessions.length === 0 && !loading ? (
        <p className="text-gray-600">You have not registered for any sessions.</p>
      ) : (
        <div className="flex flex-col justify-start items-center gap-4 overflow-y-auto max-h-[500px] pb-20">
          {registeredSessions.map((reg) => {
            const sessionEnded = reg.session?.endTime
              ? new Date(reg.session.endTime) < new Date()
              : false;
            return (
              <div
                key={reg._id}
                className="bg-gray-50 p-4 h-32 w-full rounded-2xl shadow-lg flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {reg.session?.title || "Unknown Session"}
                  </h2>
                  <p className="text-sm text-gray-600">Status: {reg.status || "Not set"}</p>
                  <p className="text-sm text-gray-600">
                    Registered At: {new Date(reg.registrationDate).toLocaleString()}
                  </p>
                  {reg.session?.startTime && reg.session?.endTime && (
                    <p className="text-sm text-gray-600">
                      Session Time: {new Date(reg.session.startTime).toLocaleString()} -{" "}
                      {new Date(reg.session.endTime).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="space-x-2">
                  {sessionEnded ? (
                    <button
                      onClick={() => setSelectedSession(reg.session)}
                      className="text-blue-600 hover:underline"
                    >
                      Rate Us
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCancel(reg._id, reg.session?.title || "Unknown Session")}
                      className="text-red-600 hover:underline"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}