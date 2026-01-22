import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const CreateInstructorCourse = () => {
  const navigate = useNavigate();
  const preset_key = "arsmfwi7";
  const cloud_name = "dnqlt6cit";

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    isFree: false,
    duration: "",
    category: "",
    tags: "",
    hasMonthlyPayment: false,
    monthlyAmount: "",
    discount: "",
  });

  const [courseModules, setCourseModules] = useState([
    { id: 1, title: "", content: "" }
  ]);

  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/view_All_categories`);
      if (res.data.allCoursecategory) {
        setCategories(res.data.allCoursecategory);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
      if (name === "isFree" && checked) {
        setFormData({ ...formData, isFree: true, price: "0" });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploadingImage(true);
    const imgData = new FormData();
    imgData.append("file", file);
    imgData.append("upload_preset", preset_key);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        imgData
      );
      setImage(res.data.secure_url);
      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error("Image upload failed");
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const addModule = () => {
    const newModule = {
      id: courseModules.length + 1,
      title: "",
      content: ""
    };
    setCourseModules([...courseModules, newModule]);
  };

  const removeModule = (id) => {
    if (courseModules.length === 1) {
      toast.error("At least one module is required");
      return;
    }
    setCourseModules(courseModules.filter(module => module.id !== id));
  };

  const updateModule = (id, field, value) => {
    setCourseModules(courseModules.map((module) =>
      module.id === id ? { ...module, [field]: value } : module
    ));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Please enter course title");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Please enter course description");
      return false;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return false;
    }
    if (!formData.duration.trim()) {
      toast.error("Please enter course duration");
      return false;
    }
    if (!formData.isFree && (!formData.price || parseFloat(formData.price) <= 0)) {
      toast.error("Please enter a valid price");
      return false;
    }
    if (!image) {
      toast.error("Please upload a course image");
      return false;
    }

    const hasEmptyModule = courseModules.some(
      (module) => !module.title.trim()
    );

    if (hasEmptyModule) {
      toast.error("Please fill in all module titles");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        price: formData.isFree ? 0 : parseFloat(formData.price),
        isFree: formData.isFree,
        duration: formData.duration,
        category: formData.category,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        image: [image],
        courseModules: courseModules,
        hasMonthlyPayment: formData.hasMonthlyPayment,
        monthlyAmount: formData.hasMonthlyPayment ? parseFloat(formData.monthlyAmount) : 0,
        discount: formData.discount ? parseFloat(formData.discount) : 0
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/create-course`,
        payload,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Course created successfully!");
        setTimeout(() => {
          navigate("/my_courses");
        }, 1500);
      }
    } catch (err) {
      console.error("Error creating course:", err);
      toast.error(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-orange-50">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/my_courses" 
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-violet-100 hover:text-violet-600 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Create New Course</h1>
                <p className="text-sm text-gray-500">Fill in the details below</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/my_courses")}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || uploadingImage}
                className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-xl hover:from-violet-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Publishing...
                  </span>
                ) : "Publish Course"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Course Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Course Information</h2>
              </div>
              
              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-violet-500 focus:bg-white focus:ring-0 outline-none transition-all"
                    placeholder="e.g., Complete Web Development Bootcamp"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-violet-500 focus:bg-white focus:ring-0 outline-none transition-all resize-none"
                    placeholder="What will students learn in this course?"
                  />
                </div>

                {/* Category & Duration Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-violet-500 focus:bg-white focus:ring-0 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat, i) => (
                        <option key={i} value={cat.title}>{cat.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-violet-500 focus:bg-white focus:ring-0 outline-none transition-all"
                      placeholder="e.g., 8 weeks"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tags <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-violet-500 focus:bg-white focus:ring-0 outline-none transition-all"
                    placeholder="JavaScript, React, Node.js (comma separated)"
                  />
                  {formData.tags && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.split(',').filter(t => t.trim()).map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="px-3 py-1.5 bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-700 text-sm font-medium rounded-lg"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Course Thumbnail Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  Course Thumbnail <span className="text-rose-500">*</span>
                </h2>
              </div>
              
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden group">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6 gap-3">
                    <label className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium cursor-pointer hover:bg-gray-100 transition-colors shadow-lg">
                      Change
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    <button
                      type="button"
                      onClick={() => { setImage(""); setImagePreview(null); }}
                      className="px-4 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors shadow-lg"
                    >
                      Remove
                    </button>
                  </div>
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-3"></div>
                        <span className="text-sm font-medium text-violet-600">Uploading...</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center hover:border-violet-400 hover:bg-violet-50/50 transition-all group">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-900 font-semibold mb-1">Click to upload</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB • Recommended: 1280×720</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* Course Modules Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Course Modules</h2>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-lg">
                  {courseModules.length} module(s)
                </span>
              </div>

              <div className="space-y-4">
                {courseModules.map((module, idx) => (
                  <div 
                    key={module.id} 
                    className="group p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-lg shadow-emerald-500/20">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={module.title}
                          onChange={(e) => updateModule(module.id, "title", e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border-2 border-gray-100 rounded-lg focus:border-emerald-400 focus:ring-0 outline-none transition-all text-sm font-medium"
                          placeholder="Module title"
                        />
                        <textarea
                          value={module.content}
                          onChange={(e) => updateModule(module.id, "content", e.target.value)}
                          rows="2"
                          className="w-full px-4 py-2.5 bg-white border-2 border-gray-100 rounded-lg focus:border-emerald-400 focus:ring-0 outline-none transition-all resize-none text-sm"
                          placeholder="Brief description (optional)"
                        />
                      </div>
                      {courseModules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeModule(module.id)}
                          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addModule}
                className="mt-4 w-full py-3 border-2 border-dashed border-emerald-200 rounded-xl text-emerald-600 font-semibold hover:border-emerald-400 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Module
              </button>
            </div>
          </div>

          {/* Right Column - Pricing Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Pricing Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Pricing</h2>
                </div>

                {/* Free Toggle */}
                <label className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl cursor-pointer mb-5 border-2 border-transparent hover:border-violet-200 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-900">Free Course</span>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isFree"
                      checked={formData.isFree}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-7 bg-gray-200 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-violet-500 peer-checked:to-indigo-500 transition-all"></div>
                    <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
                  </div>
                </label>

                {!formData.isFree && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Price <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 font-bold text-lg">$</span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-amber-400 focus:bg-white outline-none transition-all font-semibold text-lg"
                          placeholder="99.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Discount <span className="text-gray-400 font-normal">(%)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="discount"
                          value={formData.discount}
                          onChange={handleChange}
                          min="0"
                          max="100"
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-amber-400 focus:bg-white outline-none transition-all"
                          placeholder="0"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">%</span>
                      </div>
                    </div>

                    {/* Monthly Payment Toggle */}
                    <div className="pt-4 border-t border-gray-100">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          name="hasMonthlyPayment"
                          checked={formData.hasMonthlyPayment}
                          onChange={handleChange}
                          className="w-5 h-5 text-amber-500 border-2 border-gray-300 rounded focus:ring-amber-400 focus:ring-offset-0"
                        />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-amber-600 transition-colors">Enable monthly payments</span>
                      </label>
                      
                      {formData.hasMonthlyPayment && (
                        <div className="mt-3">
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 font-bold">$</span>
                            <input
                              type="number"
                              name="monthlyAmount"
                              value={formData.monthlyAmount}
                              onChange={handleChange}
                              min="0"
                              step="0.01"
                              className="w-full pl-10 pr-20 py-3 bg-amber-50 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:bg-white outline-none transition-all"
                              placeholder="25.00"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-600 text-sm font-medium">/month</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Price Preview */}
                {!formData.isFree && formData.price && (
                  <div className="mt-5 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-emerald-700">Final Price</span>
                      {formData.discount > 0 && (
                        <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                          {formData.discount}% OFF
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-emerald-600">
                        ${formData.discount 
                          ? (formData.price - (formData.price * formData.discount / 100)).toFixed(2)
                          : parseFloat(formData.price).toFixed(2)
                        }
                      </span>
                      {formData.discount > 0 && (
                        <span className="text-lg text-gray-400 line-through">
                          ${parseFloat(formData.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {formData.isFree && (
                  <div className="p-4 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-violet-700">Free Course</p>
                        <p className="text-xs text-violet-600">Available to all students</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-violet-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">💡</span>
                  <h3 className="font-bold text-lg">Quick Tips</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-white/90">Use a clear, descriptive title</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-white/90">Add a high-quality thumbnail</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-white/90">Break content into modules</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-white/90">Price competitively</span>
                  </li>
                </ul>
              </div>

              {/* Progress Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Completion Progress</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Course Title', done: !!formData.title },
                    { label: 'Description', done: !!formData.description },
                    { label: 'Category', done: !!formData.category },
                    { label: 'Duration', done: !!formData.duration },
                    { label: 'Thumbnail', done: !!image },
                    { label: 'Modules', done: courseModules.some(m => m.title) },
                    { label: 'Pricing', done: formData.isFree || !!formData.price },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        item.done 
                          ? 'bg-gradient-to-br from-emerald-400 to-teal-500' 
                          : 'bg-gray-100'
                      }`}>
                        {item.done ? (
                          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        )}
                      </div>
                      <span className={`text-sm ${item.done ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Progress Bar */}
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-semibold text-gray-900">
                      {Math.round(
                        ([formData.title, formData.description, formData.category, formData.duration, image, courseModules.some(m => m.title), formData.isFree || formData.price]
                          .filter(Boolean).length / 7) * 100
                      )}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${([formData.title, formData.description, formData.category, formData.duration, image, courseModules.some(m => m.title), formData.isFree || formData.price]
                          .filter(Boolean).length / 7) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateInstructorCourse;