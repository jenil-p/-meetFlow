'use client';

import React from 'react';
import Select from 'react-select';

const RequestPaperForm = ({
  formData,
  setFormData,
  sessions,
  handleSubmit,
  handleChange,
  handleSessionChange,
  loading,
  error,
  closeModal,
}) => {
  // Format sessions for react-select
  const sessionOptions = sessions.map((session) => ({
    value: session._id,
    label: `${session.title} (Starts: ${new Date(session.startTime).toLocaleString()})`,
  }));

  // Custom styles for react-select to match the screenshot
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      border: '1px solid #d1d5db', // Tailwind's border-gray-300
      borderRadius: '0.375rem', // Tailwind's rounded-md
      padding: '0.5rem', // Tailwind's p-2
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#d1d5db',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af', // Tailwind's text-gray-400
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#374151', // Tailwind's text-gray-700
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#374151', // Tailwind's text-gray-700
    }),
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background overlay with blur */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={closeModal}
      ></div>

      {/* Modal content */}
      <div className="relative bg-white p-9 rounded-lg shadow-xl transform transition-all duration-500 scale-0 animate-modal-open">
        <h2 className="text-2xl playfair-display-sc-regular font-bold text-gray-800 mb-4">Request to Present a Paper</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Session and Title (side by side) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session:</label>
              <Select
                options={sessionOptions}
                onChange={handleSessionChange}
                placeholder="Select a session"
                styles={customSelectStyles}
                isSearchable
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter paper title"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700"
                required
              />
            </div>

          {/* Paper Link and Expected Presentation Time (side by side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paper Link:</label>
              <input
                type="url"
                name="paperLink"
                value={formData.paperLink}
                onChange={handleChange}
                placeholder="Enter paper link"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Presentation Time (minutes):</label>
              <input
                type="number"
                name="expectedPresentationTime"
                value={formData.expectedPresentationTime}
                onChange={handleChange}
                placeholder="Enter time in minutes"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700"
                required
              />
            </div>
          </div>

          {/* Summary (full width) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Summary:</label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              placeholder="Enter paper summary"
              className="w-full p-3 border border-gray-300 rounded-md h-24 resize-y focus:outline-none focus:ring-2 focus:ring-gray-700"
              required
            />
          </div>

          {/* Message to Organizer (full width) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message to Organizer (Optional):</label>
            <textarea
              name="messageToOrganizer"
              value={formData.messageToOrganizer}
              onChange={handleChange}
              placeholder="Enter message (optional)"
              className="w-full p-3 border border-gray-300 rounded-md h-24 resize-y focus:outline-none focus:ring-2 focus:ring-gray-700"
            />
          </div>

          {/* Error message */}
          {error && <p className="text-red-500 mb-3">{error}</p>}

          {/* Buttons (side by side) */}
          <div className="flex justify-between gap-3">
            <button
              type="submit"
              className={`flex-1 bg-yellow-700 text-white p-3 rounded-md text-base font-semibold hover:bg-yellow-800 transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 bg-gray-800 text-gray-100 p-3 rounded-md text-base font-semibold hover:bg-gray-900 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestPaperForm;