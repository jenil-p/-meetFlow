"use client";

const SessionForm = ({ formData, conferences, rooms, resources, handleChange, handleSubmit, submitLabel }) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
                <label className="mb-1">Conference:</label>
                <select
                    className="bg-gray-700 text-white rounded-md p-2"
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
                                {conf.name}
                            </option>
                        ))
                    )}
                </select>
            </div>

            <div className="flex flex-col">
                <label className="mb-1">Title:</label>
                <input
                    className="bg-gray-700 text-white rounded-md p-2"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="flex flex-col">
                <label className="mb-1">Description:</label>
                <textarea
                    className="bg-gray-700 text-white rounded-md p-2"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />
            </div>

            <div className="flex flex-col">
                <label className="mb-1">Session Type:</label>
                <select
                    className="bg-gray-700 text-white rounded-md p-2"
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

            <div className="flex flex-col">
                <label className="mb-1">Speaker:</label>
                <input
                    className="bg-gray-700 text-white rounded-md p-2"
                    type="text"
                    name="speaker"
                    value={formData.speaker}
                    onChange={handleChange}
                />
            </div>

            <div className="flex flex-col">
                <label className="mb-1">Start Time:</label>
                <input
                    className="bg-gray-700 text-white rounded-md p-2"
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="flex flex-col">
                <label className="mb-1">End Time:</label>
                <input
                    className="bg-gray-700 text-white rounded-md p-2"
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="flex flex-col">
                <label className="mb-1">Room:</label>
                <select
                    className="bg-gray-700 text-white rounded-md p-2"
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

            <div className="flex flex-col">
                <label className="mb-1">Resource:</label>
                <select
                    className="bg-gray-700 text-white rounded-md p-2"
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
                <div className="flex flex-col">
                    <label className="mb-1">Resource Quantity:</label>
                    <input
                        className="bg-gray-700 text-white rounded-md p-2"
                        type="number"
                        name="resourceQuantity"
                        value={formData.resourceQuantity}
                        onChange={handleChange}
                        min="1"
                        placeholder="Enter quantity"
                    />
                </div>
            )}

            <button className="bg-blue-300 text-black rounded-md p-2 mt-4" type="submit">
                {submitLabel}
            </button>
        </form>
    );
};

export default SessionForm;