import React from "react";

export default function UserInfo({ user }) {
  return (
    <div className="lg:col-span-1 bg-gray-100 p-6 rounded-lg shadow-md">
      <h2 className="text-xl playfair-display-sc-regular font-semibold mb-4 text-gray-800">
        User Info
      </h2>
      <p className="text-gray-600">Welcome, {user?.email || "User"}!</p>
      <p className="text-gray-600 mt-2">Role: {user?.role || "USER"}</p>
    </div>
  );
}