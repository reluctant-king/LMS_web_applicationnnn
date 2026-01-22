import React, { useEffect, useState } from "react";
import axios from "axios";

const BasicInfoForm = ({ data, updateData }) => {
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const durations = ["6 months", "1 year", "3 years"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/view_All_course_categories`);
        setCategories(catRes.data.data);

        const instRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/view_instructor`);
        setInstructors(instRes.data.data);
      } catch (err) {
        console.error("Error fetching dropdown data", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      updateData(name, checked);
    } else if (type === "file") {
      updateData(name, files[0]);
    } else if (name === "tags") {
      updateData(
        name,
        value
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      );
    } else {
      updateData(name, value);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Section Title */}
      <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
        A. Basic Info
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Title *
          </label>
          <input
            type="text"
            name="title"
            value={data.title}
            onChange={handleChange}
            placeholder="Enter course title"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Short Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description *
          </label>
          <textarea
            name="description"
            value={data.description}
            onChange={handleChange}
            placeholder="Enter a short description"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        {/* Detailed Overview */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Overview
          </label>
          <textarea
            name="overview"
            value={data.overview}
            onChange={handleChange}
            placeholder="Enter detailed overview"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Price & Free Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹)
            </label>
            <input
              type="number"
              name="price"
              value={data.isFree ? "" : data.price}
              onChange={handleChange}
              disabled={data.isFree}
              placeholder="Enter price"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <label className="flex items-center gap-2 mt-6 text-gray-700">
            <input
              type="checkbox"
              name="isFree"
              checked={data.isFree}
              onChange={handleChange}
              className="w-5 h-5 rounded"
            />
            Free Course
          </label>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration *
          </label>
          <select
            name="duration"
            value={data.duration}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Duration</option>
            {durations.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Level
          </label>
          <input
            type="text"
            name="level"
            value={data.level}
            onChange={handleChange}
            placeholder="Beginner, Intermediate, Advanced"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={data.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            value={Array.isArray(data.tags) ? data.tags.join(", ") : ""}
            onChange={handleChange}
            placeholder="e.g., Python, Data Science"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;
