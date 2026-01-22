import React, { useState } from 'react'
import axios from "axios"
import { AdminContext } from '../AdminContext/Context'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';




const LoginInstitution = () => {
    const { isAdminLogedIn } = useContext(AdminContext);
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [inputs, setInputs] = useState({
        email: "",
        password: "",

    })
    const handleInput = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/login_institute`,
        {
            email: inputs.email,
            adminPassword: inputs.password
        },
        { withCredentials: true }
        );

        if (res.data.success) {
        const institutionStatus = res.data.institute?.status;

        if (institutionStatus === "approved") {
            toast.success("Login successful");

            isAdminLogedIn(true);   
            navigate("/");         

        } else if (institutionStatus === "pending") {
            toast.warn("Institution verification is pending.");
        } else if (institutionStatus === "rejected") {
            toast.error("Your institution account was rejected.");
        } else {
            toast.error("Invalid institution status.");
        }
        } else {
        toast.error(res.data.message || "Login failed");
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Login failed");
    }
    };

    console.log(inputs);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
            <ToastContainer />
            <div className="w-full max-w-6xl flex bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Left Side - Admin Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full -ml-48 -mb-48"></div>

                    <div className="relative z-10">
                        {/* Logo */}
                        <div className="mb-8">
                            <img
                                src="https://res.cloudinary.com/dnqlt6cit/image/upload/v1759216251/bextfn8k3unismqm5bz2.jpg"
                                alt="Admin Logo"
                                className="w-48 h-auto object-contain bg-white rounded-2xl p-4 shadow-lg"
                            />
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-4 leading-tight">Admin Dashboard</h1>
                        <p className="text-blue-200 text-lg">Manage your platform with powerful tools</p>
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg mb-1">Advanced Analytics</h3>
                                <p className="text-blue-200 text-sm">Track performance and insights</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg mb-1">User Management</h3>
                                <p className="text-blue-200 text-sm">Control and monitor all users</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg mb-1">Secure Access</h3>
                                <p className="text-blue-200 text-sm">Enterprise-grade security</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 p-8 md:p-12">
                    <div className="max-w-md mx-auto flex flex-col justify-center min-h-full">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-slate-700 to-blue-900 rounded-2xl mb-4">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h2>
                            <p className="text-gray-600">Access your administrative dashboard</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-5">
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="admin@example.com"
                                            value={inputs.email}
                                            onChange={handleInput}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Enter your password"
                                            value={inputs.password}
                                            onChange={handleInput}
                                            className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                                    </label>
                                    <a href="#" className="text-sm text-slate-600 hover:text-slate-800 font-medium transition">
                                        Forgot password?
                                    </a>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-slate-700 to-blue-900 text-white py-3.5 rounded-xl font-semibold hover:from-slate-800 hover:to-blue-950 transition shadow-lg hover:shadow-xl transform hover:scale-[1.01] active:scale-[0.99]"
                                >
                                    Access Dashboard
                                </button>
                            </div>

                            {/* Admin Notice */}
                            <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm text-amber-800">
                                        <span className="font-semibold">Admin Access Only:</span> This portal is restricted to authorized administrators.
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-6 text-center">
                                <p className="text-gray-600 text-sm">
                                    Not an admin?{' '}
                                    <a
                                        href="/register"
                                        className="text-slate-600 hover:text-slate-800 font-semibold transition"
                                    >
                                        Register as User
                                    </a>
                                </p>
                            </div>

                            <div className="mt-4 text-center">
                                <p className="text-gray-500 text-xs">
                                    Protected by enterprise security standards
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default LoginInstitution