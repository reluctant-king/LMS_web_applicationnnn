import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSave, FaCalendarAlt, FaUserGraduate, FaClock } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ScheduleBatch = () => {
  const [form, setForm] = useState({
    batch: "",
    instructor: "",
    course: "",
    days: [],
    startTime: "",
    endTime: "",
    startDate: "",
    endDate:"",
    sessionType: "Online",
    location: "",
    status: "Upcoming",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const daysOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, instructorsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_courses`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/view_instructor`),
        ]);

        console.log(coursesRes, instructorsRes);
        setCourses(coursesRes.data.courses);
        setInstructors(instructorsRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleDaysChange = (day) => {
    setForm((prev) => {
      const exists = prev.days.includes(day);
      return {
        ...prev,
        days: exists
          ? prev.days.filter((d) => d !== day)
          : [...prev.days, day],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        batch: form.batch,
        instructor: form.instructor,
        course: form.course,
        days: form.days,
        startTime: form.startTime,
        endTime: form.endTime,
        enddate: form.endDate,
        sessionType: form.sessionType,
        location: form.location,
        status: form.status,
        description: form.description,
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/create_batch`, payload);

      toast.success("Batch created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset form
      setForm({
        batch: "",
        instructor: "",
        course: "",
        days: [],
        startTime: "",
        endTime: "",
        startDate: "",
        endDate:"",
        sessionType: "Online",
        location: "",
        status: "Upcoming",
        description: "",
      });
    } catch (err) {
      console.error("Error saving batch", err);
      toast.error("Error creating batch", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  console.log(form);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        .title-font {
          font-family: 'Playfair Display', serif;
        }
        
        /* Animated background patterns */
        .animated-bg {
          position: absolute;
          inset: 0;
          opacity: 0.1;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
          animation: float 20s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        
        /* Input focus effects */
        .custom-input:focus {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }
        
        /* Card entrance animation */
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .card-container {
          animation: slideUp 0.6s ease-out;
        }
        
        /* Day checkbox animations */
        .day-checkbox {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .day-checkbox:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }
        
        .day-checkbox.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
        }
        
        /* Floating label effect */
        .floating-label-input:focus + .floating-label,
        .floating-label-input:not(:placeholder-shown) + .floating-label {
          transform: translateY(-28px) scale(0.85);
          color: #667eea;
          font-weight: 600;
        }
        
        .floating-label {
          transition: all 0.3s ease;
          pointer-events: none;
        }
        
        /* Submit button effect */
        .submit-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.4s ease;
        }
        
        .submit-btn:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s ease;
        }
        
        .submit-btn:hover:before {
          left: 100%;
        }
        
        .submit-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(102, 126, 234, 0.5);
        }
        
        /* Glassmorphism effect */
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        /* Section divider */
        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #667eea, transparent);
          margin: 2rem 0;
        }
        
        /* Icon pulse */
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        .icon-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      <ToastContainer />

      {/* Animated background */}
      <div className="animated-bg"></div>

      {/* Main content */}
      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header section */}
          <div className="text-center mb-12 card-container">
            <div className="inline-block mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-50"></div>
                <FaCalendarAlt className="relative text-6xl text-white icon-pulse" />
              </div>
            </div>
            <h1 className="title-font text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
              Schedule New Batch
            </h1>
            <p className="text-xl text-white/80 font-medium">
              Create an unforgettable learning experience
            </p>
          </div>

          {/* Form card */}
          <div className="glass-card rounded-3xl shadow-2xl overflow-hidden card-container">
            <form onSubmit={handleSubmit} className="p-8 md:p-12">
              {/* Basic Information Section */}
              <div className="mb-10">
                <h3 className="title-font text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Batch Name */}
                  <div className="relative">
                    <input
                      type="text"
                      name="batch"
                      value={form.batch}
                      onChange={handleChange}
                      required
                      placeholder=" "
                      className="floating-label-input peer w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 custom-input transition-all duration-300"
                    />
                    <label className="floating-label absolute left-5 top-4 text-gray-500 bg-white px-2">
                      Batch Name *
                    </label>
                  </div>

                  {/* Course */}
                  <div className="relative">
                    <select
                      name="course"
                      value={form.course}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 custom-input transition-all duration-300 appearance-none bg-white"
                    >
                      <option value="">Select Course *</option>
                      {courses.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Instructor */}
                  <div className="relative md:col-span-2">
                    <select
                      name="instructor"
                      value={form.instructor}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 custom-input transition-all duration-300 appearance-none bg-white"
                    >
                      <option value="">Select Instructor *</option>
                      {instructors.map((i) => (
                        <option key={i._id} value={i._id}>
                          {i.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <FaUserGraduate className="text-gray-400" />
                    </div>
                  </div>

                  {/* Session Type */}
                  <div className="relative">
                    <select
                      name="sessionType"
                      value={form.sessionType}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 custom-input transition-all duration-300 appearance-none bg-white"
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-semibold text-gray-700">
                      Session Type
                    </label>
                  </div>

                  {/* Location */}
                  <div className="relative">
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder=" "
                      className="floating-label-input peer w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 custom-input transition-all duration-300"
                    />
                    <label className="floating-label absolute left-5 top-4 text-gray-500 bg-white px-2">
                      Location
                    </label>
                  </div>

                  {/* Status */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Status
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {["Upcoming", "Active", "Completed", "Cancelled"].map((statusOption) => (
                        <label
                          key={statusOption}
                          className={`day-checkbox cursor-pointer p-4 border-2 rounded-xl text-center font-semibold transition-all ${
                            form.status === statusOption ? 'active' : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="status"
                            value={statusOption}
                            checked={form.status === statusOption}
                            onChange={handleChange}
                            className="hidden"
                          />
                          {statusOption}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="relative md:col-span-2">
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows="4"
                      placeholder=" "
                      className="floating-label-input peer w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 custom-input transition-all duration-300 resize-none"
                    />
                    <label className="floating-label absolute left-5 top-4 text-gray-500 bg-white px-2">
                      Batch Description
                    </label>
                  </div>
                </div>
              </div>

              <div className="section-divider"></div>

              {/* Schedule Section */}
              <div className="mb-10">
                <h3 className="title-font text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                  Schedule & Timing
                  <FaClock className="text-purple-500 ml-auto" />
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Start Date */}
                  <div className="relative md:col-span-2">
                    <input
                      type="date"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 custom-input transition-all duration-300"
                    />
                    <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-semibold text-gray-700">
                      Start Date *
                    </label>
                  </div>

                  <div className="relative md:col-span-2">
                    <input
                      type="date"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 custom-input transition-all duration-300"
                    />
                    <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-semibold text-gray-700">
                      End Date *
                    </label>
                  </div>

                  {/* Start Time */}
                  <div className="relative">
                    <input
                      type="time"
                      name="startTime"
                      value={form.startTime}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 custom-input transition-all duration-300"
                    />
                    <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-semibold text-gray-700">
                      Start Time *
                    </label>
                  </div>

                  {/* End Time */}
                  <div className="relative">
                    <input
                      type="time"
                      name="endTime"
                      value={form.endTime}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 custom-input transition-all duration-300"
                    />
                    <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-semibold text-gray-700">
                      End Time *
                    </label>
                  </div>

                  {/* Days of Week */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-4">
                      Select Days of Week *
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
                      {daysOptions.map((day) => (
                        <label
                          key={day}
                          className={`day-checkbox cursor-pointer p-4 border-2 rounded-xl text-center font-semibold transition-all ${form.days.includes(day) ? 'active' : 'border-gray-200'
                            }`}
                        >
                          <input
                            type="checkbox"
                            checked={form.days.includes(day)}
                            onChange={() => handleDaysChange(day)}
                            className="hidden"
                          />
                          {day}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-10">
                <button
                  type="submit"
                  disabled={loading}
                  className="submit-btn group px-10 py-5 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white text-lg font-bold rounded-2xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Batch...
                    </>
                  ) : (
                    <>
                      <FaSave className="text-xl" />
                      Create Batch
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer note */}
          <div className="text-center mt-8 text-white/60 text-sm">
            All fields marked with * are required
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleBatch;