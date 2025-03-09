// /src/app/components/SessionForm.js
"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SessionForm = ({ formData, conferences, rooms, resources, handleChange, handleSubmit, submitLabel, conferenceRange = { startDate: null, endDate: null } }) => {
  // Handler for DatePicker changes
  const handleDateChange = (date, field) => {
    handleChange({ target: { name: field, value: date ? date.toISOString() : "" } });
  };

  // Helper to ensure a valid Date object
  const getValidDate = (date) => {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  // Helper to format date safely
  const formatDate = (date) => {
    const parsedDate = getValidDate(date);
    return parsedDate ? parsedDate.toLocaleDateString() : "Date not set";
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Session</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Conference:</label>
        <select
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
          name="conference"
          value={formData.conference}
          onChange={handleChange}
          required
        >
          {conferences.length === 0 ? (
            <option value="">No conferences available</option>
          ) : (
            conferences.map((conf) => (
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
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter session title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
        <textarea
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black h-24 resize-none"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter session description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Session Type:</label>
        <select
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
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
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
          type="text"
          name="speaker"
          value={formData.speaker}
          onChange={handleChange}
          placeholder="Enter speaker name"
        />
      </div>

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
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black max-w-xs"
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
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black max-w-xs"
          placeholderText="Select end time"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Room:</label>
        <select
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
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
          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
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

      {formData.resourceId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Resource Quantity:</label>
          <input
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            type="number"
            name="resourceQuantity"
            value={formData.resourceQuantity}
            onChange={handleChange}
            min="1"
            placeholder="Enter quantity"
          />
        </div>
      )}

      <p className="text-sm text-gray-500 italic">Note: Sessions cannot overlap in the same room, regardless of conference or session type.</p>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition-colors duration-200"
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default SessionForm;