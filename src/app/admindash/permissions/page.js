'use client';

import React, { useState, useEffect } from 'react';

const Permissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all permission requests
  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/permissions');
        const data = await res.json();
        if (res.ok) {
          setPermissions(data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to load permission requests');
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  // Handle approve/reject action
  const handleUpdateStatus = async (id, status) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/permissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      const data = await res.json();
      if (res.ok) {
        // Update the permissions list
        setPermissions((prev) =>
          prev.map((perm) =>
            perm._id === id ? { ...perm, status } : perm
          )
        );
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to update permission status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 font-sans">
      <h2 className="text-2xl font-bold uppercase mb-5 text-gray-600">
        Permission Requests
      </h2>
      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500 mb-3">{error}</p>}
      {permissions.length === 0 ? (
        <p className="text-gray-600">No permission requests found.</p>
      ) : (
        <div className="space-y-4">
          {permissions.map((permission) => (
            <div
              key={permission._id}
              className="bg-white p-5 rounded-lg shadow-md"
            >
              <h3 className="text-lg font-bold mb-2">{permission.title}</h3>
              <p className="text-gray-700">
                <span className="font-bold">User:</span>{' '}
                {permission.user?.username || 'Unknown'}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Email:</span>{' '}
                {permission.user?.email || 'N/A'}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Session:</span>{' '}
                {permission.session?.title || 'N/A'}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Session Time:</span>{' '}
                {permission.session?.startTime
                  ? `${new Date(
                      permission.session.startTime
                    ).toLocaleString()} - ${new Date(
                      permission.session.endTime
                    ).toLocaleString()}`
                  : 'N/A'}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Paper Link:</span>{' '}
                <a
                  href={permission.paperLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {permission.paperLink}
                </a>
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Summary:</span> {permission.summary}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Expected Presentation Time:</span>{' '}
                {permission.expectedPresentationTime} minutes
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Message to Organizer:</span>{' '}
                {permission.messageToOrganizer || 'N/A'}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Status:</span> {permission.status}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Submitted:</span>{' '}
                {new Date(permission.createdAt).toLocaleString()}
              </p>
              {/* Action buttons */}
              {permission.status === 'PENDING' && (
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => handleUpdateStatus(permission._id, 'APPROVED')}
                    className="bg-yellow-700 text-white px-4 py-2 rounded-md text-base font-semibold hover:bg-yellow-800"
                    disabled={loading}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(permission._id, 'REJECTED')}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-base font-semibold hover:bg-gray-400"
                    disabled={loading}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Permissions;