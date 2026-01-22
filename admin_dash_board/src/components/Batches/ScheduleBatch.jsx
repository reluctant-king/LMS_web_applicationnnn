import React, { useEffect, useState } from "react";
import axios from "axios";

const ScheduleBatch = () => {
  const [form, setForm] = useState({
    batchName: "",
    batchCode: "",
    course: "",
    instructor: "",
    mode: "Online",
    maxSeats: 50,
    status: "Upcoming",
    startDate: "",
    endDate: "",
    duration: "",
    daysOfWeek: [],
    classStart: "",
    classEnd: "",
    timeZone: "IST",
    venue: "",
    address: "",
    mapsLink: "",
    description: "",
    notes: "",
    banner: null,
  });

  const preset_key = "arsmfwi7";
  const cloud_name = "dnqlt6cit";

  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const durations = ["1 Month", "2 Months", "3 Months", "6 Months"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    const getAllCourses = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_courses`);
        console.log(resizeBy)
        setCourses(res.data.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const getAllInstructors = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/view_instructor`);
        setInstructors(res.data.data);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };

    getAllCourses();
    getAllInstructors();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleDaysChange = (day) => {
    setForm((prev) => {
      const exists = prev.daysOfWeek.includes(day);
      return {
        ...prev,
        daysOfWeek: exists
          ? prev.daysOfWeek.filter((d) => d !== day)
          : [...prev.daysOfWeek, day],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let uploadedBanner = "";
      if (form.banner) {
        const formData = new FormData();
        formData.append("file", form.banner);
        formData.append("upload_preset", preset_key);

        const imgRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
          formData,
          { timeout: 60000 }
        );

        uploadedBanner = imgRes.data.secure_url;
      }

      const payload = { ...form, banner: uploadedBanner, daysOfWeek: form.daysOfWeek };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/create_batch`, payload);

      alert("Batch created successfully!");
    } catch (err) {
      console.error("Error saving batch", err);
      alert("Error creating batch");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-purple-100 to-pink-50">
      <div className="relative bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl border border-white border-opacity-30 backdrop-blur-xl">
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-2">
            Schedule Batch
          </h1>
          <p className="text-gray-500">Fill in batch details below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Batch Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 shadow grid gap-4">
            <input
              type="text"
              name="batchName"
              placeholder="Batch Name"
              value={form.batchName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition"
              required
            />
            <input
              type="text"
              name="batchCode"
              placeholder="Batch Code"
              value={form.batchCode}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition"
              required
            />
            <select
              name="course"
              value={form.course}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition"
              required
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
            <select
              name="instructor"
              value={form.instructor}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition"
              required
            >
              <option value="">Select Instructor</option>
              {instructors.map((i) => (
                <option key={i._id} value={i._id}>
                  {i.name}
                </option>
              ))}
            </select>
            <select
              name="mode"
              value={form.mode}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition"
            >
              <option>Online</option>
              <option>Offline</option>
              <option>Hybrid</option>
            </select>
            <input
              type="number"
              name="maxSeats"
              placeholder="Maximum Seats"
              value={form.maxSeats}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition"
            />
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition"
            >
              <option>Upcoming</option>
              <option>Active</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>

          {/* Date & Duration */}
          <div className="bg-gradient-to-r from-indigo-50 to-pink-50 rounded-2xl p-6 shadow grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none hover:border-purple-400 transition"
              />
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none hover:border-purple-400 transition"
              />
            </div>
            <select
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none hover:border-purple-400 transition"
            >
              <option value="">Select Duration</option>
              {durations.map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Days */}
            <div className="flex flex-wrap gap-3">
              {days.map((day) => (
                <label key={day} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.daysOfWeek.includes(day)}
                    onChange={() => handleDaysChange(day)}
                  />
                  {day}
                </label>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="time"
                name="classStart"
                value={form.classStart}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none hover:border-purple-400 transition"
              />
              <input
                type="time"
                name="classEnd"
                value={form.classEnd}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none hover:border-purple-400 transition"
              />
            </div>
          </div>

          {/* Venue & Description */}
          {(form.mode === "Offline" || form.mode === "Hybrid") && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 shadow grid gap-4">
              <input
                type="text"
                name="venue"
                placeholder="Venue / Classroom Name"
                value={form.venue}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition"
              />
              <textarea
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none hover:border-purple-400 transition resize-none"
              />
              <input
                type="text"
                name="mapsLink"
                placeholder="Google Maps Link"
                value={form.mapsLink}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition"
              />
            </div>
          )}

          <div className="bg-gradient-to-r from-indigo-50 to-pink-50 rounded-2xl p-6 shadow grid gap-4">
            <textarea
              name="description"
              placeholder="Batch Description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none hover:border-purple-400 transition resize-none"
            />
            <textarea
              name="notes"
              placeholder="Notes for Instructor (private)"
              value={form.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none hover:border-purple-400 transition resize-none"
            />
            <input
              type="file"
              name="banner"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center"
          >
            Create Batch
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleBatch;
