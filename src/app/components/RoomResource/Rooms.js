"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [formData, setFormData] = useState({ roomNumber: "", capacity: "", location: "" });
  const [message, setMessage] = useState("");

  // Fetch rooms on mount
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/rooms", { credentials: "include" });
      const data = await res.json();
      if (res.ok) {
        setRooms(data);
      } else {
        setError(data.message || "Failed to fetch rooms");
      }
    } catch (error) {
      setError("Error fetching rooms: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateRoom = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const method = editRoom ? "PUT" : "POST";
    const body = editRoom
      ? { id: editRoom._id, ...formData }
      : formData;

    try {
      const res = await fetch("/api/rooms", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        fetchRooms();
        setShowModal(false);
        setFormData({ roomNumber: "", capacity: "", location: "" });
        setEditRoom(null);
      } else {
        setError(data.message || "Failed to save room");
      }
    } catch (error) {
      setError("Error saving room: " + error.message);
    }
  };

  const handleEdit = (room) => {
    setEditRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      capacity: room.capacity,
      location: room.location || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/rooms", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        fetchRooms();
      } else {
        setError(data.message || "Failed to delete room");
      }
    } catch (error) {
      setError("Error deleting room: " + error.message);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 playfair-display-sc-regular">Rooms</h3>
        <button
          onClick={() => {
            setEditRoom(null);
            setFormData({ roomNumber: "", capacity: "", location: "" });
            setShowModal(true);
          }}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
        >
          <FaPlus className="mr-2" /> Add Room
        </button>
      </div>

      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-600">Loading rooms...</p>}

      <div className="grid gap-4">
        <AnimatePresence>
          {rooms.map((room) => (
            <motion.div
              key={room._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50 p-4 rounded-xl shadow-lg flex justify-between items-center hover:bg-gray-100 transition-all duration-200"
            >
              <div>
                <h4 className="text-lg font-semibold text-gray-800">{room.roomNumber}</h4>
                <p className="text-sm text-gray-600">Capacity: {room.capacity}</p>
                <p className="text-sm text-gray-600">Location: {room.location || "Not set"}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(room)}
                  className="text-blue-600 hover:text-blue-800 transition-all duration-200"
                >
                  <FaEdit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(room._id)}
                  className="text-red-600 hover:text-red-800 transition-all duration-200"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal for Add/Edit Room */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800 playfair-display-sc-regular">
              {editRoom ? "Edit Room" : "Add Room"}
            </h3>
            <form onSubmit={handleAddOrUpdateRoom} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Room Number</label>
                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-600"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-600"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Location (Optional)</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-600"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200"
                >
                  {editRoom ? "Update Room" : "Add Room"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}