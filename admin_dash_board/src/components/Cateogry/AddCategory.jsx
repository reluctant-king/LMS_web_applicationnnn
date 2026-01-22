import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ title: "", desc: "", image: null });
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

      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/add_course_cateogry`, {
        title: inputs.title,
        description: inputs.desc,
        image: img_url,
      });

      alert("Category added successfully!");
      navigate("/view_course_cateogry");
    } catch (error) {
      console.error(error);
      alert("Error adding category");
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
            Add Course Category
          </h1>
          <p className="text-gray-500">Enter the category details below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 shadow grid gap-6">
            <input
              type="text"
              name="title"
              placeholder="Category Title"
              value={inputs.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition"
            />

            <textarea
              name="desc"
              placeholder="Category Description"
              value={inputs.desc}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition resize-none"
            />

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center"
          >
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
