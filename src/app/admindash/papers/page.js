'use client';

import React, { useState, useEffect } from 'react';

const Papers = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all papers
  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/papers');
        const data = await res.json();
        if (res.ok) {
          setPapers(data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to load papers');
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  // Handle update paper status
  const handleUpdateStatus = async (id, status) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/papers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      const data = await res.json();
      if (res.ok) {
        // Update the papers list
        setPapers((prev) =>
          prev.map((paper) =>
            paper._id === id ? { ...paper, status } : paper
          )
        );
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to update paper status');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete paper
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this paper?')) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/papers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (res.ok) {
        // Remove the paper from the list
        setPapers((prev) => prev.filter((paper) => paper._id !== id));
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to delete paper');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 font-sans">
      <h2 className="text-2xl font-bold uppercase mb-5 text-gray-600">
        Papers
      </h2>
      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500 mb-3">{error}</p>}
      {papers.length === 0 ? (
        <p className="text-gray-600">No papers found.</p>
      ) : (
        <div className="space-y-4">
          {papers.map((paper) => (
            <div key={paper._id} className="bg-white p-5 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">{paper.title}</h3>
              <p className="text-gray-700">
                <span className="font-bold">User:</span>{' '}
                {paper.user?.username || 'Unknown'}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Email:</span>{' '}
                {paper.user?.email || 'N/A'}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Session:</span>{' '}
                {paper.session?.title || 'N/A'}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Session Time:</span>{' '}
                {paper.session?.startTime
                  ? `${new Date(
                      paper.session.startTime
                    ).toLocaleString()} - ${new Date(
                      paper.session.endTime
                    ).toLocaleString()}`
                  : 'N/A'}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Paper Link:</span>{' '}
                <a
                  href={paper.paperLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {paper.paperLink}
                </a>
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Summary:</span> {paper.summary}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Status:</span> {paper.status}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Created:</span>{' '}
                {new Date(paper.createdAt).toLocaleString()}
              </p>
              {/* Action buttons */}
              <div className="flex justify-end gap-3 mt-4">
                {paper.status === 'UNDER_REVIEW' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(paper._id, 'APPROVED')}
                      className="bg-yellow-700 text-white px-4 py-2 rounded-md text-base font-semibold hover:bg-yellow-800"
                      disabled={loading}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(paper._id, 'REJECTED')}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-base font-semibold hover:bg-gray-400"
                      disabled={loading}
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(paper._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md text-base font-semibold hover:bg-red-600"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Papers;