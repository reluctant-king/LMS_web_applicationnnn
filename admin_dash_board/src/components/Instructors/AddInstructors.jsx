import React, { useState } from "react";
import axios from "axios";

const AddInstructors = () => {
  const [inputs, setInputs] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
    bio: "",
    image: null,
    specialization: "",
    experience: "",
    qualification: "",
    linkedin: "",
    github: "",
    website: "",
  });

  const [loading, setLoading] = useState(false);

  const preset_key = "arsmfwi7";
  const cloud_name = "dnqlt6cit";

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    if (files && files.length > 0) {
      setInputs({ ...inputs, [name]: files[0] });
    } else {
      setInputs({ ...inputs, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let img_url = null;
      if (inputs.image) {
        const formData = new FormData();
        formData.append("file", inputs.image);
        formData.append("upload_preset", preset_key);
        const imageRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
          formData
        );
        img_url = imageRes.data.secure_url;
      }

      //  let res = )
      const payload = { ...inputs, image: img_url };
      const signupPayload = {
        firstname: inputs.firstname,
        lastname: inputs.lastname,
        email: inputs.email,
        expertise: inputs.specialization,
        phone: inputs.phone,
        password: inputs.password,
        role: "instructor",

      }
      const [signupRes, detailsRes] = await Promise.all([
        axios.post(`${import.meta.env.VITE_API_URL}/api/v1/sign_up`, signupPayload),
        axios.post(`${import.meta.env.VITE_API_URL}/api/v1/add_instructor`, payload)
      ])

      console.log("signupRes", signupRes)
      console.log("detailsRes", detailsRes)

      alert("Instructor added successfully!");
      setInputs({
        name: "",
        email: "",
        phone: "",
        bio: "",
        image: null,
        specialization: "",
        experience: "",
        qualification: "",
        linkedin: "",
        github: "",
        website: "",
      });
    } catch (error) {
      console.error(error);
      alert("Error adding instructor");
    } finally {
      setLoading(false);
    }
  };

  console.log(inputs)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-100 to-pink-50 rounded-3xl">
      <div className="relative bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl border border-white border-opacity-30 backdrop-blur-xl ">
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-2">
            Add Instructor
          </h1>
          <p className="text-gray-500">Enter the details below for a new instructor</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-7"
        >
          {/* Personal Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 grid gap-6 mb-3 shadow">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">First name</label>
              <input
                type="text"
                name="firstname"
                // value={inputs.name}
                onChange={handleChange}
                required
                placeholder="Full Name"
                className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-300 outline-none hover:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Last name</label>
              <input
                type="text"
                name="lastname"
                // value={inputs.name}
                onChange={handleChange}
                required
                placeholder="Full Name"
                className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-300 outline-none hover:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={inputs.email}
                onChange={handleChange}
                required
                placeholder="Email"
                className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-300 outline-none hover:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                // value={inputs.email}
                onChange={handleChange}
                required
                placeholder="Email"
                className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-300 outline-none hover:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={inputs.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-300 outline-none hover:border-blue-400"
              />
            </div>
          </div>
          {/* Bio & Image */}
          <div className="bg-gradient-to-r from-indigo-50 to-pink-50 rounded-2xl p-6 grid gap-6 mb-3 shadow">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Short Bio</label>
              <textarea
                name="bio"
                value={inputs.bio}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Short Bio"
                className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition duration-300 outline-none resize-none hover:border-purple-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                required
                className="w-full px-5 py-2 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-300 outline-none hover:border-blue-400"
              />
            </div>
          </div>
          {/* Professional Details */}
          <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 rounded-2xl p-6 grid gap-6 mb-3 shadow grid-cols-1 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
              <input
                type="text"
                name="specialization"
                value={inputs.specialization}
                onChange={handleChange}
                placeholder="e.g. AI, Web Dev"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-300 outline-none hover:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
              <input
                type="number"
                name="experience"
                value={inputs.experience}
                onChange={handleChange}
                placeholder="Years"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-300 outline-none hover:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Qualification</label>
              <input
                type="text"
                name="qualification"
                value={inputs.qualification}
                onChange={handleChange}
                placeholder="e.g. MSc, PhD"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-300 outline-none hover:border-blue-400"
              />
            </div>
          </div>
          {/* Links */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 grid gap-6 mb-3 shadow grid-cols-1 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn</label>
              <input
                type="text"
                name="linkedin"
                value={inputs.linkedin}
                onChange={handleChange}
                placeholder="LinkedIn URL"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-300 outline-none hover:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">GitHub</label>
              <input
                type="text"
                name="github"
                value={inputs.github}
                onChange={handleChange}
                placeholder="GitHub URL"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-300 outline-none hover:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
              <input
                type="text"
                name="website"
                value={inputs.website}
                onChange={handleChange}
                placeholder="Personal Website"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-300 outline-none hover:border-blue-400"
              />
            </div>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center ${loading ? "bg-blue-400 cursor-not-allowed opacity-70" : ""
              }`}
          >
            {loading && (
              <span className="h-5 w-5 border-4 border-white border-t-transparent rounded-full animate-spin mr-2" />
            )}
            {loading ? "Saving..." : "Add Instructor"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddInstructors;
