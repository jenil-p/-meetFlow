import React from "react";

export default function NavMenu({ activeTab, setActiveTab }) {
  const tabs = [
    { name: "registerSession", label: "Register for Session" },
    { name: "requestPaperSession", label: "Request Paper/Session" },
    { name: "registeredSessions", label: "Registered Sessions" },
  ];

  return (
    <div className="mb-8">
      <nav className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow-lg">
        {tabs.map((tab) => (
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
  );
}