"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editResource, setEditResource] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", totalQuantity: "" });
  const [message, setMessage] = useState("");

  // Fetch resources on mount
  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/resources", { credentials: "include" });
      const data = await res.json();
      if (res.ok) {
        setResources(data);
      } else {
        setError(data.message || "Failed to fetch resources");
      }
    } catch (error) {
      setError("Error fetching resources: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateResource = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const method = editResource ? "PUT" : "POST";
    const body = editResource
      ? { id: editResource._id, ...formData }
      : formData;

    try {
      const res = await fetch("/api/resources", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        fetchResources();
        setShowModal(false);
        setFormData({ name: "", description: "", totalQuantity: "" });
        setEditResource(null);
      } else {
        setError(data.message || "Failed to save resource");
      }
    } catch (error) {
      setError("Error saving resource: " + error.message);
    }
  };

  const handleEdit = (resource) => {
    setEditResource(resource);
    setFormData({
      name: resource.name,
      description: resource.description || "",
      totalQuantity: resource.totalQuantity,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/resources", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        fetchResources();
      } else {
        setError(data.message || "Failed to delete resource");
      }
    } catch (error) {
      setError("Error deleting resource: " + error.message);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 playfair-display-sc-regular">Resources</h3>
        <button
          onClick={() => {
            setEditResource(null);
            setFormData({ name: "", description: "", totalQuantity: "" });
            setShowModal(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
        >
          <FaPlus className="mr-2" /> Add Resource
        </button>
      </div>

      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-600">Loading resources...</p>}

      <div className="grid gap-4">
        <AnimatePresence>
          {resources.map((resource) => (
            <motion.div
              key={resource._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50 p-4 rounded-xl shadow-lg flex justify-between items-center hover:bg-gray-100 transition-all duration-200"
            >
              <div>
                <h4 className="text-lg font-semibold text-gray-800">{resource.name}</h4>
                <p className="text-sm text-gray-600">Quantity: {resource.totalQuantity}</p>
                <p className="text-sm text-gray-600">Description: {resource.description || "Not set"}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(resource)}
                  className="text-blue-600 hover:text-blue-800 transition-all duration-200"
                >
                  <FaEdit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(resource._id)}
                  className="text-red-600 hover:text-red-800 transition-all duration-200"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal for Add/Edit Resource */}
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
              {editResource ? "Edit Resource" : "Add Resource"}
            </h3>
            <form onSubmit={handleAddOrUpdateResource} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Total Quantity</label>
                <input
                  type="number"
                  name="totalQuantity"
                  value={formData.totalQuantity}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  rows="3"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
                >
                  {editResource ? "Update Resource" : "Add Resource"}
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