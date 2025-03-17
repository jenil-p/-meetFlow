"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SessionForm = ({
  formData,
  conferences,
  rooms,
  resources,
  handleChange,
  handleSubmit,
  submitLabel,
  conferenceRange = { startDate: null, endDate: null },
}) => {
  const [fetchedConferences, setFetchedConferences] = useState(conferences || []);

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const res = await fetch("/api/conferences?fields=minimal");
        const data = await res.json();
        if (res.ok) {
          setFetchedConferences(data);
        } else {
          console.error("Failed to fetch conferences:", data.message);
        }
      } catch (error) {
        console.error("Error fetching conferences:", error);
      }
    };

    if (!conferences || conferences.length === 0) {
      fetchConferences();
    }
  }, [conferences]);

  const handleDateChange = (date, field) => {
    handleChange({ target: { name: field, value: date ? date.toISOString() : "" } });
  };

  const getValidDate = (date) => {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  const formatDate = (date) => {
    const parsedDate = getValidDate(date);
    return parsedDate ? parsedDate.toLocaleDateString() : "Date not set";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 p-6 rounded-2xl shadow-lg space-y-4 max-w-4xl mx-auto transition-all duration-300"
    >
      <h2 className="text-2xl playfair-display-sc-regular font-bold text-gray-800 mb-4">
        Create Session
      </h2>

      {/* Conference and Title in a Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Conference:</label>
          <select
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-700 text-gray-900 shadow-sm transition-all duration-200 hover:border-yellow-300"
            name="conference"
            value={formData.conference}
            onChange={handleChange}
            required
          >
            {fetchedConferences.length === 0 ? (
              <option value="">No conferences available</option>
            ) : (
              fetchedConferences.map((conf) => (
                <option key={conf._id} value={conf._id}>
                  {conf.name} (Starts: {formatDate(conf.startDate)}, Ends: {formatDate(conf.endDate)})
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
          <input
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-700 text-gray-900 shadow-sm transition-all duration-200 hover:border-yellow-300"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter session title"
          />
        </div>
      </div>

      {/* Description - Full Width */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
        <textarea
          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-700 text-gray-900 h-20 resize-none shadow-sm transition-all duration-200 hover:border-yellow-300"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter session description"
        />
      </div>

      {/* Session Type and Speaker in a Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Session Type:</label>
          <select
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-700 text-gray-900 shadow-sm transition-all duration-200 hover:border-yellow-300"
            name="sessionType"
            value={formData.sessionType}
            onChange={handleChange}
            required
          >
            <option value="WORKSHOP">Workshop</option>
            <option value="PRESENTATION">Presentation</option>
            <option value="KEYNOTE">Keynote</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Speaker:</label>
          <input
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-700 text-gray-900 shadow-sm transition-all duration-200 hover:border-yellow-300"
            type="text"
            name="speaker"
            value={formData.speaker}
            onChange={handleChange}
            placeholder="Enter speaker name"
          />
        </div>
      </div>

      {/* Start Time and End Time Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time:</label>
          <DatePicker
            selected={formData.startTime ? new Date(formData.startTime) : null}
            onChange={(date) => handleDateChange(date, "startTime")}
            showTimeSelect
            timeIntervals={15}
            dateFormat="Pp"
            minDate={conferenceRange.startDate ? getValidDate(conferenceRange.startDate) : null}
            maxDate={conferenceRange.endDate ? getValidDate(conferenceRange.endDate) : null}
            initialVisibleMonth={conferenceRange.startDate ? getValidDate(conferenceRange.startDate) : null}
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-700 text-gray-900 shadow-sm transition-all duration-200 hover:border-yellow-300"
            placeholderText="Select start time"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time:</label>
          <DatePicker
            selected={formData.endTime ? new Date(formData.endTime) : null}
            onChange={(date) => handleDateChange(date, "endTime")}
            showTimeSelect
            timeIntervals={15}
            dateFormat="Pp"
            minDate={
              conferenceRange.startDate
                ? getValidDate(conferenceRange.startDate)
                : formData.startTime
                ? new Date(formData.startTime)
                : null
            }
            maxDate={conferenceRange.endDate ? getValidDate(conferenceRange.endDate) : null}
            initialVisibleMonth={conferenceRange.startDate ? getValidDate(conferenceRange.startDate) : null}
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-700 text-gray-900 shadow-sm transition-all duration-200 hover:border-yellow-300"
            placeholderText="Select end time"
            required
          />
        </div>
      </div>

      {/* Room and Resource Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room:</label>
          <select
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-700 text-gray-900 shadow-sm transition-all duration-200 hover:border-yellow-300"
            name="room"
            value={formData.room}
            onChange={handleChange}
          >
            <option value="">Select a room (optional)</option>
            {rooms.map((room) => (
              <option key={room._id} value={room._id}>
                {room.roomNumber}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Resource:</label>
          <select
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-700 text-gray-900 shadow-sm transition-all duration-200 hover:border-yellow-300"
            name="resourceId"
            value={formData.resourceId}
            onChange={handleChange}
          >
            <option value="">Select a resource (optional)</option>
            {resources.map((res) => (
              <option key={res._id} value={res._id}>
                {res.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resource Quantity (Conditional) */}
      {formData.resourceId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Resource Quantity:</label>
          <input
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-700 text-gray-900 shadow-sm transition-all duration-200 hover:border-yellow-300"
            type="number"
            name="resourceQuantity"
            value={formData.resourceQuantity}
            onChange={handleChange}
            min="1"
            placeholder="Enter quantity"
          />
        </div>
      )}

      {/* Note and Submit Button */}
      <p className="text-sm text-gray-500 italic">
        Note: Sessions cannot overlap in the same room, regardless of conference or session type.
      </p>
      <button
        type="submit"
        className="w-full bg-yellow-700 text-white rounded-lg py-2 font-semibold hover:bg-yellow-800 transition-all duration-300 shadow-md"
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default SessionForm;