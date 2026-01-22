import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaEye, FaClock } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {

    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/pending_instructors`);
      console.log('Pending instructors response:', res.data);
      if (res.data && res.data.success) {
        setInstructors(res.data.data || []);
      } else {
        setInstructors([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending instructors:', error);
      setInstructors([]); 
      setLoading(false);
      toast.error('Failed to load pending instructors', { 
        position: 'top-center',
        autoClose: 4000,
        theme: 'colored',
      });
    } finally {
      setLoading(false)
    }
  };

  const handleApprove = async (userId) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/approve_instructor`, {
        userId,
        adminId: 'ADMIN_ID_HERE' 
      });
      
      if (res.data.success) {
        toast.success('Instructor approved successfully!', {
          position: 'top-center',
          autoClose: 3000,
          theme: 'colored',
        });
        fetchPending();
      } else {
        toast.warning(res.data.message || 'Could not approve instructor', {
          position: 'top-center',
          autoClose: 4000,
          theme: 'colored',
        });
      }
    } catch (error) {
      console.error('Error approving instructor:', error);
      toast.error(
        error.response?.data?.message || 'Failed to approve instructor',
        {
          position: 'top-center',
          autoClose: 4000,
          theme: 'colored',
        }
      );
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.warning('Please provide a rejection reason', {
        position: 'top-center',
        autoClose: 3000,
        theme: 'colored',
      });
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/reject_instructor`, {
        userId: selectedInstructor._id,
        reason: rejectionReason
      });

      if (res.data.success) {
        toast.error('Instructor rejected successfully', { 
          position: 'top-center',
          autoClose: 3000,
          theme: 'colored',
        });
        setShowModal(false);
        setRejectionReason('');
        fetchPending();
      } else {
        toast.warning(res.data.message || 'Could not reject instructor', {
          position: 'top-center',
          autoClose: 4000,
          theme: 'colored',
        });
      }
    } catch (error) {
      console.error('Error rejecting instructor:', error);
      toast.error('Failed to reject instructor', {
        position: 'top-center',
        autoClose: 4000,
        theme: 'colored',
      });
    }
  };

  const openRejectModal = (instructor) => {
    setSelectedInstructor(instructor);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-3 rounded-xl">
                <FaClock className="text-yellow-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Pending Instructor Approvals</h2>
                <p className="text-gray-600 mt-1">Review and approve instructor applications</p>
              </div>
            </div>
            {instructors && instructors.length > 0 && (
              <div className="bg-yellow-100 px-4 py-2 rounded-xl">
                <span className="text-2xl font-bold text-yellow-600">{instructors.length}</span>
                <p className="text-xs text-yellow-700">Pending</p>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        {!instructors || instructors.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xl text-gray-600">No pending approvals</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Phone</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Expertise</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Applied On</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {instructors.map((instructor) => (
                    <tr key={instructor._id} className="hover:bg-blue-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {instructor.firstname?.[0]}{instructor.lastname?.[0]}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {instructor.firstname} {instructor.lastname}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{instructor.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{instructor.phone}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {instructor.expertise || 'Not specified'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(instructor.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleApprove(instructor._id)}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2 transition shadow-md"
                          >
                            <FaCheck /> Approve
                          </button>
                          <button
                            onClick={() => openRejectModal(instructor)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 transition shadow-md"
                          >
                            <FaTimes /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Rejection Modal */}
        {showModal && selectedInstructor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Reject Instructor</h3>
              <p className="text-gray-600 mb-4">
                {selectedInstructor?.firstname} {selectedInstructor?.lastname} - {selectedInstructor?.email}
              </p>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a detailed reason..."
                className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                rows="4"
                required
              />

              <div className="flex gap-3">
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setRejectionReason('');
                  }}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ✅ ToastContainer added here */}
      <ToastContainer/>
    </div>
  );
};

export default VerifyInstructors;