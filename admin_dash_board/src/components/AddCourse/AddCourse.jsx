import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaPlus } from "react-icons/fa";

const AddCourse = () => {
  const preset_key = "arsmfwi7"
  const cloud_name = "dnqlt6cit"
  const [instructors, setInstructors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [instrectorEmail, setInstrectorEmail] = useState("")

  const coursesFields = [

    { label: "Course Title", name: "title", type: "text", placeholder: "Enter course title" },
    { label: "Description", name: "description", type: "textarea", placeholder: "Describe your course" },
    { label: "Category", name: "category", type: "select", options: [], placeholder: "Select category" },
    { label: "Tags", name: "tags", type: "text", placeholder: "Enter tags separated by commas" },
    { label: "Duration", name: "duration", type: "text", placeholder: "e.g., 8 weeks" },
    { label: "Course Image", name: "image", type: "file" },


    { label: "Free Course", name: "isFree", type: "checkbox" },
    { label: "Price", name: "price", type: "number", placeholder: "Enter price" },
    { label: "Discount (%)", name: "discount", type: "number", placeholder: "Enter discount percentage" },
    { label: "Monthly Payment Option", name: "hasMonthlyPayment", type: "checkbox" },
    { label: "Monthly Amount", name: "monthlyAmount", type: "number", placeholder: "Enter monthly amount" },


    { label: "Instructor Name", name: "instrectorName", type: "select", options: [], placeholder: "Select instructor" },
    { label: "Instructor Bio", name: "instrectorBio", type: "textarea", placeholder: "Enter instructor bio" },


    {
      label: "Course Modules", name: "modules", type: "array", subfields: [
        { label: "Module Title", name: "title", type: "text", placeholder: "Module title" }
      ]
    }
  ];


  const [inputs, setInputes] = useState({
    title: "",
    description: "",
    price: "",
    isFree: false,
    duration: "",
    category: "",
    tags: "",
    image: null,
    instructor: "",
    instructorName: "",
    instructorBio: "",
    hasMonthlyPayment: false,
    monthlyAmount: "",
    modules: [
      { id: 1, title: "" }
    ]

  });

  const getAllDetails = async () => {
    try {
      setLoading(true)
      const insterecters = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_approved_instrectors"`);

      console.log(insterecters)

      setInstructors(insterecters.data.instrecters);
      const catRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/view_All_categories`);
      console.log(catRes);


      setCategories(catRes.data.allCoursecategory);
    } catch (error) {
      console.error("Error fetching lists:", error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {

    getAllDetails();

  }, []);

  const addModule = () => {
    const newModule = {
      id: inputs.modules.length + 1,
      title: "",
    };
    setInputes({
      ...inputs,
      modules: [...inputs.modules, newModule],
    });
  };


  const updateModule = (id, value) => {
    const updatedModules = inputs.modules.map((module) =>
      module.id === id ? { ...module, title: value } : module
    );
    setInputes({ ...inputs, modules: updatedModules });
  };


  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    if (type === "file" && files && files.length > 0) {
      setInputes({ ...inputs, [name]: files[0] });
    } else if (type === "checkbox") {
      setInputes({ ...inputs, [name]: checked });
    } else {
      setInputes({ ...inputs, [name]: value });
    }
  };

  const handleEmail = (email) => {
    console.log(email)
    setInstrectorEmail(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl;
      if (inputs.image) {

        const formData = new FormData();
        formData.append("file", inputs.image);
        formData.append("upload_preset", preset_key);

        const imgRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
          formData,

        );
        imageUrl = imgRes.data.secure_url
      }

      const payload = {
        title: inputs.title,
        description: inputs.description,
        price: inputs.price,
        isFree: inputs.isFree,
        duration: inputs.duration,
        category: inputs.category,
        tags: inputs.tags,
        image: imageUrl,
        courseModules: inputs.modules,
        instructor: inputs.instructor,
        instructoremail: instrectorEmail,
        hasMonthlyPayment: inputs.hasMonthlyPayment,
        monthlyAmount: inputs.monthlyAmount

      };
      let res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/create_course`, payload);

      console.log(res);

      if (res.data.success) {
        toast.success(res.data.message)
      }



    } catch (err) {
      console.error("Error saving course", err);
    } finally {
      setLoading(false);
    }
  };


  console.log(inputs);
  // if (loading)
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
  //       <div className="text-center">
  //         <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
  //         <p className="text-xl font-semibold text-gray-700">Loading...</p>
  //       </div>
  //     </div>
  //   );

  // if (error)
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
  //       <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
  //         <p className="text-xl font-semibold text-red-600">{error}</p>
  //       </div>
  //     </div>
  //   );


  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 py-12 px-4">
      <ToastContainer />
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl shadow-2xl mb-6 transform hover:scale-105 transition-transform">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-3">
            Create New Course
          </h1>
          <p className="text-gray-600 text-lg">Fill in the details to add an amazing course</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Course Details Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-violet-100">
            <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">1</span>
                Course Details
              </h2>
            </div>

            <div className="p-8 space-y-6">
              {/* Course Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Course Title
                </label>
                <input
                  type="text"
                  name="title"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                  placeholder="Enter course title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  onChange={handleChange}
                  name="description"

                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors resize-none"
                  placeholder="Describe your course..."
                />
              </div>

              {/* Category & Duration Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    onChange={handleChange}
                    name="category"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat, i) => (
                      <option key={i} value={cat.title}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                    placeholder="e.g., 8 weeks"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                  placeholder="e.g., programming, web development"
                />
              </div>

              {/* Course Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Course Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-violet-500 transition-colors">

                  <label className="cursor-pointer">
                    <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 mb-1">Click to upload course image</p>
                    <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>

                </div>
              </div>
            </div>
          </div>

          {/* Instructor Details Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-violet-100">
            <div className="bg-gradient-to-r from-fuchsia-600 to-pink-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">2</span>
                Instructor Details
              </h2>
            </div>

            <div className="p-8 space-y-6">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Instructor *
                </label>
                <select
                  value={inputs.instructor}
                  onChange={(e) => {
                    handleChange(e)
                    handleEmail(e.target.value)
                  }}

                  name="instructor"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-fuchsia-500 focus:outline-none transition-colors"
                >
                  <option value="">Choose an instructor...</option>
                  {instructors.map((inst, i) => (
                    <option key={i} value={inst.email}>
                      {`${inst.firstname} ${inst.lastname} - ${inst.expertise}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Instructor Preview */}
              {/* {inputs.instructor && (
                <div className="bg-gradient-to-r from-fuchsia-50 to-pink-50 p-6 rounded-xl border-2 border-fuchsia-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-fuchsia-600 text-white rounded-full flex items-center justify-center text-xs">
                      ✓
                    </span>
                    Selected Instructor Details
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Name</p>
                      <p className="font-semibold text-gray-800">{inputs.instructorName}</p>
                    </div>

                    {inputs.instructorBio && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Bio</p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {inputs.instructorBio}
                        </p>
                      </div>
                    )}

                    {!inputs.instructorBio && (
                      <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                        ⚠️ This instructor hasn't added a bio yet
                      </p>
                    )}
                  </div>
                </div>
              )} */}
            </div>
          </div>

          {/* modules */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-violet-100">

            <div className="bg-gradient-to-r from-fuchsia-600 to-pink-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">
                  3
                </span>
                Course Modules
              </h2>
            </div>


            <div className="p-8 space-y-6">
              {inputs.modules.map((module, index) => (
                <div key={module.id} className="border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-fuchsia-700 mb-4">
                    Module {index + 1}: Learning
                  </h3>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Module Title
                    </label>
                    <input
                      type="text"
                      value={module.title}
                      onChange={(e) => updateModule(module.id, e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-fuchsia-500 focus:outline-none transition-colors"
                      placeholder="Introduction to the topic..."
                    />
                  </div>


                </div>
              ))}

              {/* Add Module Button */}
              <button
                type="button"
                onClick={addModule}
                className="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-semibold rounded-xl hover:from-fuchsia-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <FaPlus className="w-5 h-5" />
                Add Next Module
              </button>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-violet-100">
            <div className="bg-gradient-to-r from-pink-600 to-rose-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">3</span>
                Pricing
              </h2>
            </div>

            <div className="p-8 space-y-6">
              {/* Free Course Toggle */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-700">Free Course</p>
                  <p className="text-sm text-gray-500">Make this course available for free</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    onChange={handleChange}
                    name="isFree"
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-pink-600"></div>
                </label>
              </div>

              {/* Price & Discount */}
              {!inputs.isFree && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 text-gray-500 font-medium">$</span>
                        <input
                          type="number"
                          name="price"
                          onChange={handleChange}
                          className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                          placeholder="99.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Discount (%)
                      </label>
                      <input
                        type="number"
                        onChange={handleChange}
                        name="discount"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                        placeholder="10"
                      />
                    </div>
                  </div>

                  {/* Monthly Payment Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border-2 border-pink-200">
                    <div>
                      <p className="font-semibold text-gray-700">Monthly Payment Option</p>
                      <p className="text-sm text-gray-500">Allow students to pay in installments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        onChange={handleChange}
                        name="hasMonthlyPayment"
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-rose-500"></div>
                    </label>
                  </div>

                  {/* Monthly Amount Input */}
                  {inputs.hasMonthlyPayment && (
                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-xl border-2 border-pink-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Monthly Payment Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 text-gray-500 font-medium">$</span>
                        <input
                          type="number"
                          onChange={handleChange}
                          name="monthlyAmount"
                          className="w-full pl-8 pr-4 py-3 border-2 border-pink-300 rounded-xl focus:border-pink-500 focus:outline-none transition-colors bg-white"
                          placeholder="25.00"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Set the amount students will pay monthly</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">

            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-4 text-white font-semibold rounded-xl shadow-2xl transition-all transform hover:scale-105 ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving Course...
                </span>
              ) : (
                "Create Course"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;