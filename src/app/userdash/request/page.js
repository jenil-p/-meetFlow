"use client";

import RequestPaperSession from "../components/RequestPaperSession";

export default function RequestPage() {
  return (
    <div className="space-y-4">
      <RequestPaperSession />
      <div className="text-center text-gray-500">
        <h2 className="text-2xl playfair-display-sc-regular font-semibold mb-4 text-gray-800">
          Request Paper/Session
        </h2>
        <p>Feature under development. Check back soon!</p>
      </div>
    </div>
  );
}