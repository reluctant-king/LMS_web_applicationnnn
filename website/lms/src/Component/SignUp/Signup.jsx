import axios from 'axios'
import React, { useState } from 'react';
import { MdMail, MdLock, MdVisibility, MdVisibilityOff, MdPerson, MdPhone } from 'react-icons/md';
import { toast ,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { MdVerified } from 'react-icons/md';
import { FaPhoneFlip  } from 'react-icons/fa6';

const Signup = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    let [inputs, setInputs] = useState({
        firstname: "",
        lastname: "",
        email: "",
        expertise:"",
        phone: "",
        password: "",
        role: ""
    })
    let [message, setMessage] = useState("")
    const payload = {
        firstname: inputs.firstname,
        lastname: inputs.lastname,
        email: inputs.email,
        expertise: inputs.expertise,
        phone: inputs.phone,
        password: inputs.password,
        role: inputs.role
    }


    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            let res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/sign_up`, payload)
            console.log(res);
            if (res.data.success) {
                setMessage(res.data.message)
                if (inputs.role === 'instructor') {
                    toast.success(" Registration successful!\n Your account is pending admin approval."); 
                } else {
                    toast.success(" Registration successful! Redirecting to login...");
                }
                
                await new Promise((back) => setTimeout(back, 3000))
                navigate("/login")
            }

        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.message || "Registration failed");
        }
    }
    console.log(inputs);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 p-4">
            <div className="w-full max-w-5xl flex bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Left Side - Hero Section */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 p-12 flex-col justify-center relative overflow-hidden">
                    <div className="relative z-10">
                        {/* Logo and Title */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                                    <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                                        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                                    </svg>
                                </div>
                                <h1 className="text-3xl font-bold text-white">EduLearn</h1>
                            </div>
                            
                            <h2 className="text-4xl font-bold text-white mb-4">Start Your Learning Journey</h2>
                            <p className="text-white text-opacity-90 text-lg">
                                Access thousands of courses, connect with expert instructors, and achieve your educational goals.
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="space-y-4 mt-12">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                                    <MdVerified className='w-10 h-15 text-yellow-500' />
                                </div>
                                <span className="text-white text-lg font-medium">10,000+ Premium Courses</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                                    <MdVerified className='w-10 h-15 text-yellow-500' />
                                </div>
                                <span className="text-white text-lg font-medium">Expert Instructors Worldwide</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                                    <MdVerified className='w-10 h-15 text-yellow-500' />
                                </div>
                                <span className="text-white text-lg font-medium">Lifetime Access to Content</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                                    <MdVerified className='w-10 h-15 text-yellow-500' />
                                </div>
                                <span className="text-white text-lg font-medium">Certificates of Completion</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form Section */}
                      <ToastContainer/>
                <div className="w-full lg:w-1/2 p-8 md:p-12 flex items-center justify-center">
                    <div className="max-w-md w-full">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                            <p className="text-gray-500">Join us and start learning today</p>
                        </div>

                        {/* Form */}
                        <div className="space-y-5">
                            {/* Role Selection */}
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleChange({ target: { name: "role", value: "student" } })}
                                    className={`flex-1 py-3 rounded-lg  transition font-semibold ${
                                        inputs.role === "student"
                                            ? "bg-purple-600 text-white border-purple-600"
                                            : "bg-white text-gray-600 border-gray-300 hover:border-purple-300 "
                                    }`}
                                >
                                    Student 
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleChange({ target: { name: "role", value: "instructor" } })}
                                    className={`flex-1 py-3 rounded-lg  transition font-semibold ${
                                        inputs.role === "instructor"
                                            ? "bg-green-600 text-white border-green-600 "
                                            : "bg-white text-gray-600 border-gray-300 hover:border-green-300"
                                    }`}
                                >
                                    Instructor
                                </button>
                            </div>

                            {/* Name Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        name="firstname"
                                        placeholder="John"
                                        value={inputs.firstname}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastname"
                                        placeholder="Doe"
                                        value={inputs.lastname}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    />
                                </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <div className="relative">
                                    <FaPhoneFlip className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="number"
                                        name="phone"
                                        placeholder="Mobile Number"
                                        value={inputs.phone}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    />
                                    </div>
                                </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <MdMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="john@example.com"
                                        value={inputs.email}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    />
                                </div>
                            </div>

                            {/* Expertise Field - Only for Instructors */}
                            {inputs.role === "instructor" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Expertise
                                    </label>
                                    <input
                                        name="expertise"
                                        value={inputs.expertise}
                                        onChange={handleChange}
                                        placeholder="e.g., Web Development, Machine Learning"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    />
                                </div>
                            )}

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Create a password"
                                        value={inputs.password}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <MdVisibilityOff className="w-5 h-5" /> : <MdVisibility className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Terms Checkbox */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="agreeTerms"
                                    checked={inputs.agreeTerms}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                />
                                <label className="text-sm text-gray-600">
                                    I agree to the{' '}
                                    <a href="#" className="text-blue-600 hover:underline font-medium">
                                        {inputs.role === "instructor" ? "Instructor Terms" : "Terms & Conditions"}
                                    </a>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3.5 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                {inputs.role === "instructor" ? (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Become an Instructor
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                        Create Account
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Sign In Link */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600 text-sm">
                                Already have an account?{' '}
                                <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                                    Login
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;