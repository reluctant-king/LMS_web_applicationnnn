import axios from "axios"
import React, { useState } from 'react';
import { SiQuicklook } from "react-icons/si";
import { MdMail, MdArrowBack, MdLock, MdCheckCircle } from 'react-icons/md';
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { FaShippingFast, FaUserLock } from "react-icons/fa";

const FoegetPasswordOne = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/forgot_password`, {
                email
            });
            console.log('Password reset requested for:', email);
            setMessage("Password reset link sent! Check your email.");
            setError("");
        } catch (error) {
            setError("Failed to send reset link. Please try again.");
            setMessage("");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center 
                        bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 
                        p-3 sm:p-4">
            <div className="w-full max-w-5xl flex flex-col lg:flex-row bg-white 
                            rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
                
                {/* Left Side - Hero Section */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 
                                p-8 xl:p-12 flex-col justify-center relative overflow-hidden">
                    <div className="relative z-10">
                        {/* Logo and Title */}
                        <div className="mb-6 xl:mb-8">
                            <div className="flex items-center gap-2 xl:gap-3 mb-4 xl:mb-6">
                                <div className="w-10 h-10 xl:w-12 xl:h-12 bg-white rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 xl:w-8 xl:h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                                        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                                    </svg>
                                </div>
                                <h1 className="text-2xl xl:text-3xl font-bold text-white">EduLearn</h1>
                            </div>

                            <h2 className="text-3xl xl:text-4xl font-bold text-white mb-3 xl:mb-4">
                                Reset Your Password
                            </h2>
                            <p className="text-white text-opacity-90 text-base xl:text-lg">
                                We'll help you get back to learning in no time
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="relative z-10 space-y-4 xl:space-y-6">
                            <div className="flex items-start space-x-3 xl:space-x-4">
                                <div className="w-10 h-10 xl:w-12 xl:h-12 bg-white bg-opacity-20 rounded-lg xl:rounded-xl 
                                                flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                                    <MdOutlineMarkEmailRead className='w-5 h-5 xl:w-6 xl:h-6 text-green-500' />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-base xl:text-lg mb-0.5 xl:mb-1">
                                        Check Your Email
                                    </h3>
                                    <p className="text-blue-100 text-xs xl:text-sm">
                                        We'll send you a reset link
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3 xl:space-x-4">
                                <div className="w-10 h-10 xl:w-12 xl:h-12 bg-white bg-opacity-20 rounded-lg xl:rounded-xl 
                                                flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                                    <FaUserLock className='w-5 h-5 xl:w-6 xl:h-6 text-purple-500' />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-base xl:text-lg mb-0.5 xl:mb-1">
                                        Secure Process
                                    </h3>
                                    <p className="text-blue-100 text-xs xl:text-sm">
                                        Your account security is our priority
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3 xl:space-x-4">
                                <div className="w-10 h-10 xl:w-12 xl:h-12 bg-white bg-opacity-20 rounded-lg xl:rounded-xl 
                                                flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                                    <FaShippingFast className='w-5 h-5 xl:w-6 xl:h-6 text-yellow-500' />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-base xl:text-lg mb-0.5 xl:mb-1">
                                        Quick Recovery
                                    </h3>
                                    <p className="text-blue-100 text-xs xl:text-sm">
                                        Get back to your courses instantly
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form Section */}
                <div className="w-full lg:w-1/2 p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 
                                flex items-center justify-center">
                    <div className="max-w-md w-full">
                        {/* Back to Login Link */}
                        <a
                            href="/login"
                            className="inline-flex items-center text-xs sm:text-sm text-blue-600 
                                       hover:text-blue-700 font-medium transition mb-4 sm:mb-6
                                       active:text-blue-800 py-1"
                        >
                            <MdArrowBack className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                            Back to login
                        </a>

                        {/* Header */}
                        <div className="text-center mb-6 sm:mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 
                                            bg-gradient-to-br from-purple-500 to-indigo-600 
                                            rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
                                <MdLock className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                                Forgot Password?
                            </h2>
                            <p className="text-gray-500 text-sm sm:text-base px-2">
                                No worries! Enter your email and we'll send you reset instructions
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <MdMail className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                                       w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={handleEmail}
                                        required
                                        className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 
                                                   text-sm sm:text-base
                                                   border border-gray-300 rounded-lg sm:rounded-xl 
                                                   focus:outline-none focus:ring-2 focus:ring-purple-500 
                                                   focus:border-transparent transition
                                                   placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Success Message */}
                            {message && (
                                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 
                                                p-3 sm:p-4 rounded-lg">
                                    <div className="flex items-start">
                                        <MdCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 mt-0.5 flex-shrink-0" />
                                        <p className="font-medium text-xs sm:text-sm">{message}</p>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 
                                                p-3 sm:p-4 rounded-lg">
                                    <div className="flex items-start">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <p className="font-medium text-xs sm:text-sm">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white 
                                           py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold 
                                           text-sm sm:text-base
                                           hover:from-purple-700 hover:to-indigo-700 
                                           active:from-purple-800 active:to-indigo-800
                                           transition shadow-lg hover:shadow-xl 
                                           flex items-center justify-center gap-2
                                           active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" 
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" 
                                                    stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" 
                                                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <MdMail className="w-4 h-4 sm:w-5 sm:h-5" />
                                        Send Reset Link
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="mt-5 sm:mt-6 text-center">
                            <p className="text-gray-600 text-xs sm:text-sm">
                                Don't have an account?{' '}
                                <a 
                                    href="/sign_up" 
                                    className="text-blue-600 hover:text-blue-700 active:text-blue-800 
                                               font-semibold transition"
                                >
                                    Sign up
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoegetPasswordOne;