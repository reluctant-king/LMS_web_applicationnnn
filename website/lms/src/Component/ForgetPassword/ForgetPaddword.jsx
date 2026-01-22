import React, { useEffect } from 'react'
import axios from "axios"
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import { MdCreateNewFolder, MdOutlineSecurity, MdQuickreply } from 'react-icons/md';
import { RiAccountPinCircleFill } from "react-icons/ri";


const ForgetPaddword = () => {
  const navigate = useNavigate()
  let [password, setPassword] = useState("")
  let [confirmPassword, setConfirmPassword] = useState("")
  let [error, setError] = useState("")
  let [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { token } = useParams()


  const validatePassword = (pwd) => {
    if (pwd.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(pwd)) return "Password must include at least one uppercase letter.";
    if (!/[a-z]/.test(pwd)) return "Password must include at least one lowercase letter.";
    if (!/\d/.test(pwd)) return "Password must include at least one number.";
    if (!/[@$!%*?&]/.test(pwd)) return "Password must include at least one special character (@$!%*?&).";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Frontend validation
    const pwdError = validatePassword(password);
    if (pwdError) return setError(pwdError);

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/reset_password/${token}`, { password });

      if (res.data.success) {
        toast.success(res.data.message);
        setSuccess(res.data.message);
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (err) {
      // Display backend validation message
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
                    bg-gradient-to-br from-yellow-400 via-white-500 to-purple-600 
                    p-3 sm:p-4">
      <ToastContainer />
      <div className="w-full max-w-5xl flex flex-col lg:flex-row bg-white 
                      rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-500 via-white-500 to-yellow-600 
                        p-8 xl:p-12 flex-col justify-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full -ml-48 -mb-48"></div>
          
          <div className="relative z-10 mb-8">
            <div className="w-14 h-14 xl:w-16 xl:h-16 bg-white bg-opacity-20 rounded-2xl 
                            flex items-center justify-center mb-6 xl:mb-8 backdrop-blur-sm">
              <MdCreateNewFolder className='w-7 h-7 xl:w-10 xl:h-10 text-white' />
            </div>
            <h1 className="text-3xl xl:text-5xl font-bold text-white mb-3 xl:mb-4 leading-tight">
              Create a New Password
            </h1>
            <p className="text-blue-100 text-base xl:text-lg">
              Choose a strong password to secure your account
            </p>
          </div>

          <div className="relative z-10 space-y-4 xl:space-y-6">
            <div className="flex items-start space-x-3 xl:space-x-4">
              <div className="w-10 h-10 xl:w-12 xl:h-12 bg-white bg-opacity-10 rounded-lg xl:rounded-xl 
                              flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                <MdOutlineSecurity className='w-5 h-5 xl:w-6 xl:h-6 text-yellow-400' />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base xl:text-lg mb-0.5 xl:mb-1">
                  Strong Security
                </h3>
                <p className="text-blue-100 text-xs xl:text-sm">
                  Use a mix of letters, numbers & symbols
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 xl:space-x-4">
              <div className="w-10 h-10 xl:w-12 xl:h-12 bg-white bg-opacity-10 rounded-lg xl:rounded-xl 
                              flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                <RiAccountPinCircleFill className='w-5 h-5 xl:w-6 xl:h-6 text-blue-400'/>
              </div>
              <div>
                <h3 className="text-white font-semibold text-base xl:text-lg mb-0.5 xl:mb-1">
                  Protected Account
                </h3>
                <p className="text-blue-100 text-xs xl:text-sm">
                  Keep your data safe and secure
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 xl:space-x-4">
              <div className="w-10 h-10 xl:w-12 xl:h-12 bg-white bg-opacity-10 rounded-lg xl:rounded-xl 
                              flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                <MdQuickreply className='w-5 h-5 xl:w-6 xl:h-6 text-green-400'/>
              </div>
              <div>
                <h3 className="text-white font-semibold text-base xl:text-lg mb-0.5 xl:mb-1">
                  Quick Process
                </h3>
                <p className="text-blue-100 text-xs xl:text-sm">
                  Get back to learning in seconds
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="w-full lg:w-1/2 p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12">
          <div className="max-w-md mx-auto flex flex-col justify-center min-h-full">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 
                              bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl 
                              mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                Reset Your Password
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Enter your new password below
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 sm:space-y-5">
                {/* New Password */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 sm:pl-11 pr-11 sm:pr-12 py-2.5 sm:py-3 
                                 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl 
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 
                                 text-gray-400 hover:text-gray-600 p-1 active:scale-90 transition"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-10 sm:pl-11 pr-11 sm:pr-12 py-2.5 sm:py-3 
                                 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl 
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 
                                 text-gray-400 hover:text-gray-600 p-1 active:scale-90 transition"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

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

                {/* Success Message */}
                {success && (
                  <div className="bg-green-50 border-l-4 border-green-500 text-green-700 
                                  p-3 sm:p-4 rounded-lg">
                    <div className="flex items-start">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="font-medium text-xs sm:text-sm">{success}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
                             py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold 
                             text-sm sm:text-base
                             hover:from-blue-700 hover:to-indigo-700 transition 
                             shadow-lg hover:shadow-xl 
                             transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  Update Password
                </button>
              </div>

              {/* Footer */}
              <div className="mt-5 sm:mt-6 text-center">
                <p className="text-gray-600 text-xs sm:text-sm">
                  Remember your password?{' '}
                  <a
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 font-semibold 
                               transition active:text-blue-800"
                  >
                    Sign in
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgetPaddword