import React, { useContext, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FiLogOut } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AllCourseDetail } from '../AllCourseContext/Context';
import axios from 'axios';

const Logout = ({ setLogout }) => {
  const navigate = useNavigate();
  const { setUser } = useContext(AllCourseDetail);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/logout`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setUser(null);
        localStorage.removeItem('token');
        setLogout(false);
        toast.success('Successfully logged out');
        navigate('/login');
      } else {
        toast.error(res.data.message || 'Logout failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong while logging out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => !loading && setLogout(false)}
      />

     
      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
         
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                <FiLogOut className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Log out</h2>
                <p className="text-xs text-gray-500">
                  You can sign back in anytime.
                </p>
              </div>
            </div>
            <button
              onClick={() => setLogout(false)}
              disabled={loading}
              className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition disabled:opacity-50"
            >
              <IoMdClose size={18} />
            </button>
          </div>

       
          <div className="px-4 py-4">
            <p className="text-sm text-gray-700">
              Are you sure you want to log out of your account?
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Any unsaved changes may be lost.
            </p>
          </div>

       
          <div className="px-4 py-3 flex justify-end gap-2 border-t border-gray-100 bg-gray-50/60">
            <button
              onClick={() => setLogout(false)}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{loading ? 'Logging out…' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;