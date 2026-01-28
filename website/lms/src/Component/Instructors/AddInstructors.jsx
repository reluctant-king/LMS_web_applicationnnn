import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AllCourseDetail } from "../AllCourseContext/Context";
import { toast, ToastContainer } from "react-toastify";
import { FaTimes } from "react-icons/fa";

const AddInstructors = ({ setShowForm, emailll }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [inputs, setInputs] = useState({
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
                const res = await axios.post(
                    `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
                    formData
                );
                img_url = res.data.secure_url;
            }

            const payload = {
                accountRegisteredEmail: emailll,
                name: inputs.name,
                email: inputs.email,
                phone: inputs.phone,
                bio: inputs.bio,
                image: img_url || null,
                specialization: inputs.specialization,
                experience: inputs.experience,
                qualification: inputs.qualification,
                linkedin: inputs.linkedin,
                github: inputs.github,
                website: inputs.website,
            }

            let res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/add_instructor_details`, payload)
            console.log(res)
            if (res.data.success) {
                toast.success(res.data.message)
                setShowForm(false)
                await new Promise((back) => setTimeout(back, 2000))
                navigate("/instructor_page")
            }

            console.log(res);

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Error adding instructor details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
            <ToastContainer position="top-right" />

            <div
                className="absolute inset-0"
                onClick={() => setShowForm(false)}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto my-4 sm:my-8 z-10 animate-fade-in">
                
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 sm:p-6 rounded-t-2xl sm:rounded-t-3xl z-20">
                    <div className="flex justify-between items-start sm:items-center gap-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-white bg-opacity-20 rounded-full shrink-0">
                                <svg
                                    className="w-5 h-5 sm:w-6 sm:h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-lg sm:text-2xl font-bold leading-tight">Complete Instructor Profile</h2>
                                <p className="text-blue-100 text-xs sm:text-sm">Enter your details below</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowForm(false)}
                            className="text-white hover:bg-white hover:bg-opacity-20 p-1.5 sm:p-2 rounded-lg transition-colors shrink-0"
                            type="button"
                        >
                            <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    
                    {/* Personal Info Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm space-y-3 sm:space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 sm:h-5 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
                            Personal Information
                        </h3>

                        <div className="grid gap-3 sm:gap-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={inputs.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="instructor@example.com"
                                        value={inputs.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        placeholder="Phone number"
                                        value={inputs.phone}
                                        onChange={handleChange}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                    Bio *
                                </label>
                                <textarea
                                    name="bio"
                                    placeholder="Tell us about yourself and your expertise..."
                                    value={inputs.bio}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Professional Details Section */}
                    <div className="bg-gradient-to-r from-indigo-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm space-y-3 sm:space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 sm:h-5 bg-gradient-to-b from-indigo-600 to-pink-600 rounded-full"></span>
                            Professional Details
                        </h3>

                        <div className="grid gap-3 sm:gap-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                    Profile Image
                                </label>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none hover:border-blue-400 transition file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                        Specialization
                                    </label>
                                    <input
                                        type="text"
                                        name="specialization"
                                        placeholder="e.g., Web Development"
                                        value={inputs.specialization}
                                        onChange={handleChange}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none hover:border-purple-400 transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                        Experience (years)
                                    </label>
                                    <input
                                        type="number"
                                        name="experience"
                                        placeholder="Years"
                                        value={inputs.experience}
                                        onChange={handleChange}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none hover:border-purple-400 transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                        Qualification
                                    </label>
                                    <input
                                        type="text"
                                        name="qualification"
                                        placeholder="e.g., MSc, PhD"
                                        value={inputs.qualification}
                                        onChange={handleChange}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none hover:border-purple-400 transition"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Links Section */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm space-y-3 sm:space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 sm:h-5 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full"></span>
                            Social Links (Optional)
                        </h3>

                        <div className="grid gap-3 sm:gap-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                        LinkedIn
                                    </label>
                                    <input
                                        type="text"
                                        name="linkedin"
                                        placeholder="LinkedIn URL"
                                        value={inputs.linkedin}
                                        onChange={handleChange}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none hover:border-purple-400 transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                        GitHub
                                    </label>
                                    <input
                                        type="text"
                                        name="github"
                                        placeholder="GitHub URL"
                                        value={inputs.github}
                                        onChange={handleChange}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none hover:border-purple-400 transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                        Website
                                    </label>
                                    <input
                                        type="text"
                                        name="website"
                                        placeholder="Personal website"
                                        value={inputs.website}
                                        onChange={handleChange}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none hover:border-purple-400 transition"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end pt-2">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-slate-200 text-slate-700 rounded-lg sm:rounded-xl hover:bg-slate-300 transition-colors font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
                        >
                            <FaTimes className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 order-1 sm:order-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Complete Profile
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddInstructors;