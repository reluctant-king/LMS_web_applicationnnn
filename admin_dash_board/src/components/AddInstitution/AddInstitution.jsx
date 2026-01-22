import React, { useState } from 'react'
import axios from "axios"
import { FaBuilding, FaUser, FaEnvelope, FaLock, FaGlobe, FaImage, FaUpload, FaRegCheckCircle, FaHandSparkles, FaEyeSlash, FaEye, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';




const AddInstitution = () => {
    const preset_key = "arsmfwi7"
    const cloud_name = "dnqlt6cit"
    const [inputs, setInputs] = useState({
        institutionName: '',
        adminFullName: '',
        adminEmail: '',
        adminPassword: '',
        websiteUrl: '',
        image: null
    });
    const [submitted, setSubmitted] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleInput = (e) => {

        const { name, files, value } = e.target
        if (files && files.length > 0) {
            setInputs({ ...inputs, [name]: files[0] })
        } else {
            setInputs({ ...inputs, [name]: value })
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            let img_url;
            if (inputs.image) {
                const formData = new FormData()
                formData.append("file", inputs.image)
                formData.append("upload_preset", preset_key)

                let imageRes = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, formData)

                // console.log(imageRes);
                img_url = imageRes.data.secure_url
            }
            let payload = {
                institutionName: inputs.institutionName,
                adminFullName: inputs.adminFullName,
                adminEmail: inputs.adminEmail,
                adminPassword: inputs.adminPassword,
                websiteUrl: inputs.websiteUrl,
                image: img_url
            }
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/add_institition`, payload)
            console.log(res);
            if (res.data.success) {
                setSubmitted(true)
                toast.success(res.data.message)
            }

        } catch (error) {
            console.error(error);

        } finally {
            setLoading(false)
        }
    };
    console.log(inputs);


    return (
        <div className="min-h-screen max-w-5xl flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-6 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-10 relative border border-white/50">
                {/* Decorative corner elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-fuchsia-400/20 to-transparent rounded-tr-full"></div>

                {/* Header */}
                <div className="text-center mb-10 relative">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                        <FaBuilding className="text-white text-3xl" />
                        <FaHandSparkles className="absolute -top-1 -right-1 text-yellow-300 text-sm animate-pulse" />
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-3">
                        Institution Registration
                    </h2>
                    <p className="text-gray-600 text-lg">Create your institution account and get started</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Institution Name */}
                        <div className="transform transition-all duration-300 hover:scale-[1.02]">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${focusedField === 'institutionName' ? 'bg-purple-500 animate-pulse' : 'bg-gray-300'}`}></span>
                                Institution Name
                            </label>
                            <div className="relative group">
                                <div className={`absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                                <FaBuilding className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-colors z-10" />
                                <input
                                    type="text"
                                    name="institutionName"
                                    placeholder="Enter institution name"
                                    onChange={handleInput}
                                    onFocus={() => setFocusedField('institutionName')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    className="relative w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white hover:border-purple-300"
                                />
                            </div>
                        </div>

                        {/* Admin Full Name */}
                        <div className="transform transition-all duration-300 hover:scale-[1.02]">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${focusedField === 'adminFullName' ? 'bg-purple-500 animate-pulse' : 'bg-gray-300'}`}></span>
                                Admin Full Name
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-colors z-10" />
                                <input
                                    type="text"
                                    name="adminFullName"
                                    placeholder="Enter admin full name"
                                    onChange={handleInput}
                                    onFocus={() => setFocusedField('adminFullName')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    className="relative w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white hover:border-purple-300"
                                />
                            </div>
                        </div>

                        {/* Admin Email */}
                        <div className="transform transition-all duration-300 hover:scale-[1.02]">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${focusedField === 'adminEmail' ? 'bg-purple-500 animate-pulse' : 'bg-gray-300'}`}></span>
                                Admin Email
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-colors z-10" />
                                <input
                                    type="email"
                                    name="adminEmail"
                                    placeholder="admin@institution.com"
                                    onChange={handleInput}
                                    onFocus={() => setFocusedField('adminEmail')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    className="relative w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white hover:border-purple-300"
                                />
                            </div>
                        </div>

                        {/* Admin Password */}
                        <div className="transform transition-all duration-300 hover:scale-[1.02]">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${focusedField === 'adminPassword' ? 'bg-purple-500 animate-pulse' : 'bg-gray-300'}`}></span>
                                Admin Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-colors z-10" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="adminPassword"
                                    placeholder="Create a strong password"
                                    onChange={handleInput}
                                    onFocus={() => setFocusedField('adminPassword')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    className="relative w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white hover:border-purple-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors z-10 focus:outline-none"
                                >
                                    {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                                </button>
                            </div>
                        </div>

                        {/* Website URL */}
                        <div className="transform transition-all duration-300 hover:scale-[1.02]">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${focusedField === 'websiteUrl' ? 'bg-purple-500 animate-pulse' : 'bg-gray-300'}`}></span>
                                Website URL
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                <FaGlobe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-colors z-10" />
                                <input
                                    type="url"
                                    name="websiteUrl"
                                    placeholder="https://www.institution.com"
                                    onChange={handleInput}
                                    onFocus={() => setFocusedField('websiteUrl')}
                                    onBlur={() => setFocusedField(null)}
                                    className="relative w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white hover:border-purple-300"
                                />
                            </div>
                        </div>

                        {/* Logo Upload */}
                        <div className="transform transition-all duration-300 hover:scale-[1.02]">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                Institution Logo
                            </label>
                            <div className="flex items-center gap-4">
                                <label className="flex-1 flex items-center justify-center px-6 py-5 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 transition-all duration-300 group backdrop-blur-sm">
                                    <FaUpload className="text-gray-400 mr-3 text-lg group-hover:text-purple-500 transition-colors" />
                                    <span className="text-gray-600 text-sm font-medium group-hover:text-purple-600 transition-colors">
                                        {inputs.logo ? inputs.logo.name : 'Choose logo file'}
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        name="image"
                                        onChange={handleInput}
                                        className="hidden"
                                    />
                                </label>


                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`relative w-full py-4 rounded-xl font-bold text-lg transform hover:scale-[1.02] transition-all duration-300 overflow-hidden group mt-8 
                                 ${loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white hover:shadow-2xl"}`}
                        >
                            {loading ? (
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                    <span>Submiting details...</span>
                                </span>
                            ) : (
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Register Institution
                                    <FaHandSparkles className="animate-pulse" />
                                </span>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </div>
                </form>

                {/* Success Message */}
                {submitted && (
                    <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3 animate-pulse shadow-lg">
                        <FaCheckCircle className="text-green-500 text-2xl" />
                        <p className="text-green-700 font-bold">Institution registered successfully!</p>
                    </div>
                )}

                {/* Footer */}
                <p className="text-center text-gray-600 text-sm mt-8 font-medium">
                    Already have an account?{' '}
                    <a href="#" className="text-transparent bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text font-bold hover:underline">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}

export default AddInstitution