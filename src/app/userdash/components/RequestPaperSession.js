'use client';

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import PastRequestsList from './request/PastRequestsList';
import RequestPaperForm from './request/RequestPaperForm';

const RequestPaperSession = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    sessionId: '',
    paperLink: '',
    title: '',
    summary: '',
    expectedPresentationTime: '',
    messageToOrganizer: '',
  });

  // State for sessions, permissions, and modal
  const [sessions, setSessions] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch sessions and permissions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch('/api/sessions');
        const data = await res.json();
        setSessions(data);
      } catch (err) {
        setError('Failed to load sessions');
      }
    };

    const fetchPermissions = async () => {
      try {
        const res = await fetch('/api/permissions');
        const data = await res.json();
        setPermissions(data);
      } catch (err) {
        setError('Failed to load past requests');
      }
    };

    fetchSessions();
    fetchPermissions();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle session selection
  const handleSessionChange = (selectedOption) => {
    setFormData({ ...formData, sessionId: selectedOption ? selectedOption.value : '' });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Permission request submitted successfully!');
        // Reset form
        setFormData({
          sessionId: '',
          paperLink: '',
          title: '',
          summary: '',
          expectedPresentationTime: '',
          messageToOrganizer: '',
        });
        // Refresh permissions list
        const permissionsRes = await fetch('/api/permissions');
        const permissionsData = await permissionsRes.json();
        setPermissions(permissionsData);
        // Close modal
        setIsModalOpen(false);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  // Modal control functions
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="mx-auto font-sans">

      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl playfair-display-sc-regular font-bold text-gray-800 mb-4">Past Permission Requests</h2>
      </div>
      
      <button
          onClick={openModal}
          className="inline-block w-full border border-dashed border-black px-4 py-2 rounded-lg text-gray-700 transition-all duration-200 shadow-md mb-4"
        >
          Present a Paper
        </button>

      {/* Past Requests List */}

        <PastRequestsList permissions={permissions}/>


      {/* Modal with Form */}
      {isModalOpen && (
        <RequestPaperForm
          formData={formData}
          setFormData={setFormData}
          sessions={sessions}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          handleSessionChange={handleSessionChange}
          loading={loading}
          error={error}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default RequestPaperSession;