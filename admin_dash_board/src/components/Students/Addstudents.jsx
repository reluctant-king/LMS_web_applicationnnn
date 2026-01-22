import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddStudents = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    profileImage: null,
    courseEnrolled: "",
    address: "",
    batch: "",
  });

  const preset_key = "arsmfwi7"; // Cloudinary
  const cloud_name = "dnqlt6cit";

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/v1/view_all_batches`)
      .then((res) => setBatches(res.data.data || []))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    if (files && files.length > 0) setInputs({ ...inputs, [name]: files[0] });
    else setInputs({ ...inputs, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let img_url = null;
      if (inputs.profileImage) {
        const formData = new FormData();
        formData.append("file", inputs.profileImage);
        formData.append("upload_preset", preset_key);
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
          formData
        );
        img_url = res.data.secure_url;
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/add_student`, {
        ...inputs,
        profileImage: img_url,
      });

      alert("Student added successfully!");
      navigate("/view_students");
    } catch (error) {
      console.error(error);
      alert("Error adding student");
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
            Add Student
          </h1>
          <p className="text-gray-500">Enter the student details below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 shadow grid gap-6">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={inputs.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={inputs.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={inputs.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition"
            />
          </div>

          {/* Additional Info */}
          <div className="bg-gradient-to-r from-indigo-50 to-pink-50 rounded-2xl p-6 shadow grid gap-6">
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={inputs.age}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none hover:border-purple-400 transition"
            />
            <select
              name="gender"
              value={inputs.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none hover:border-purple-400 transition"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="file"
              name="profileImage"
              // accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition"
            />
            <input
              type="text"
              name="courseEnrolled"
              placeholder="Course Enrolled"
              value={inputs.courseEnrolled}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none hover:border-purple-400 transition"
            />
            <textarea
              name="address"
              placeholder="Address"
              value={inputs.address}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none hover:border-purple-400 transition resize-none"
            />
            <select
              name="batch"
              value={inputs.batch}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none hover:border-purple-400 transition"
            >
              <option value="">Select Batch</option>
              {batches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.batchName}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center"
          >
            Add Student
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudents;
