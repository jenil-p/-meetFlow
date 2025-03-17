"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ConferenceForm = ({
  formData,
  handleChange,
  handleSubmit,
  submitLabel,
}) => {
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
        {submitLabel === "Update Conference" ? "Edit Conference" : "Create Conference"}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
        <input
          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-700 text-gray-900 shadow-sm transition-all duration-200 hover:border-yellow-300"
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          required
          placeholder="Enter conference name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
        <textarea
          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-700 text-gray-900 h-20 resize-none shadow-sm transition-all duration-200 hover:border-yellow-300"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Enter conference description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date:</label>
          <DatePicker
            selected={formData.startDate ? new Date(formData.startDate) : null}
            onChange={(date) => handleDateChange(date, "startDate")}
            showTimeSelect
            timeIntervals={15}
            dateFormat="Pp"
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-700 text-gray-900 shadow-sm transition-all duration-200 hover:border-yellow-300"
            placeholderText="Select start date and time"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date:</label>
          <DatePicker
            selected={formData.endDate ? new Date(formData.endDate) : null}
            onChange={(date) => handleDateChange(date, "endDate")}
            showTimeSelect
            timeIntervals={15}
            dateFormat="Pp"
            minDate={formData.startDate ? new Date(formData.startDate) : null}
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-700 text-gray-900 shadow-sm transition-all duration-200 hover:border-yellow-300"
            placeholderText="Select end date and time"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location:</label>
        <input
          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-700 text-gray-900 shadow-sm transition-all duration-200 hover:border-yellow-300"
          type="text"
          name="location"
          value={formData.location || ""}
          onChange={handleChange}
          placeholder="Enter conference location"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-yellow-700 text-white rounded-lg py-2 font-semibold hover:bg-yellow-800 transition-all duration-300 shadow-md"
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default ConferenceForm;