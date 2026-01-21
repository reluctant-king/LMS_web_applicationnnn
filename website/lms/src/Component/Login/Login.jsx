import axios from 'axios';
import React, { useState, useContext } from 'react';
import { IoMdEye, IoMdEyeOff, IoMdMail } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { MdLock, MdVerified } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AllCourseDetail } from '../AllCourseContext/Context';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [inputs, setInputs] = useState({
        emailOrPhone: "",
        password: "",
        rememberMe: false
    });
    const [message, setMessage] = useState("");
    // const { getUserData } = useContext(AllCourseDetail);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setInputs({ ...inputs, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/login`, {
                email: inputs.emailOrPhone,
                password: inputs.password
            }, {
                withCredentials: true
            });

            if (res.data.success && res.data.isAuthentication) {
                console.log(res.data.message)
                toast.success(res.data.message);
                setMessage(res.data.message);
                await new Promise((r) => setTimeout(r, 2000));
                
                const role = res.data?.user?.role; // <-- Get user role

                if (role === "instructor") {
                    navigate("/instructor_landing");
                } else {
                    navigate("/");
                }

                window.location.reload();
                

            } else {
                toast.error(res.data.message || "Login failed");
            }
        } catch (error) {
            console.error(error);
            
            toast.error(error.response?.data?.message || "Something went wrong");
            // console.log(error.response?.data?.message)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 p-4">
            <ToastContainer />
            <div className="w-full max-w-5xl flex bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Left Side - Hero Section */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 to-purple-500 p-12 flex-col justify-center relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                                        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
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
                            {["10,000+ Premium Courses", "Expert Instructors Worldwide", "Lifetime Access to Content", "Certificates of Completion"].map((text, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MdVerified className='w-10 h-15 text-yellow-500' />
                                    </div>
                                    <span className="text-white text-lg font-medium">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side - Form Section */}
                <div className="w-full lg:w-1/2 p-8 md:p-12 flex items-center justify-center">
                    <div className="max-w-md w-full">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
                            <p className="text-gray-500">Please login to your account</p>
                        </div>

                        {/* Form */}
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <IoMdMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="emailOrPhone"
                                        placeholder="Enter your email"
                                        value={inputs.emailOrPhone}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Enter your password"
                                        value={inputs.password}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <IoMdEyeOff className="w-5 h-5" /> : <IoMdEye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={inputs.rememberMe}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                    />
                                    <span className="text-sm text-gray-600">Remember me</span>
                                </label>
                                <Link to="/enter_email" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition">
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Success Message */}
                            {message && (
                                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg">
                                    <p className="font-medium">{message}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3.5 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                Login
                            </button>

                            {/* Sign Up Link */}
                            <div className="mt-6 text-center">
                                <p className="text-gray-600 text-sm">
                                    Don't have an account?{' '}
                                    <Link
                                        to="/sign_up"
                                        className="text-blue-600 hover:text-blue-700 font-semibold transition">
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
