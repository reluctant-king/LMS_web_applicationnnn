import React from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom'

const PurchaseSucccessCard = () => {
    const navigate = useNavigate()
    const querry = new URLSearchParams(useLocation().search)
    const reference = querry.get("reference")

    const handleDone = () => {
        navigate('/my-courses') // or wherever you want to redirect
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-5 sm:p-8 md:p-12 max-w-md w-full transform hover:scale-[1.02] sm:hover:scale-105 transition-transform duration-300">
                
                {/* Success Icon */}
                <div className="flex justify-center mb-4 sm:mb-6">
                    <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-3 sm:p-4 shadow-lg animate-bounce">
                        <FaCheckCircle className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white" />
                    </div>
                </div>

                <div className="text-center space-y-4 sm:space-y-6">
                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                        Payment Successful!
                    </h1>

                    {/* Divider */}
                    <div className="h-0.5 sm:h-1 w-16 sm:w-20 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full"></div>

                    {/* Message */}
                    <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed px-2 sm:px-0">
                        Thank you for your payment. Your transaction was successful.
                    </p>

                    {/* Reference ID Box */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-100">
                        <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1 sm:mb-2">
                            Reference ID
                        </p>
                        <p className="text-base sm:text-lg md:text-xl font-mono font-bold text-gray-800 tracking-wide break-all">
                            {reference || 'N/A'}
                        </p>
                    </div>

                    {/* Additional Info - Optional */}
                    <div className="flex items-center justify-center gap-2 text-green-600">
                        <svg 
                            className="w-4 h-4 sm:w-5 sm:h-5" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                            />
                        </svg>
                        <span className="text-xs sm:text-sm">
                            Confirmation sent to your email
                        </span>
                    </div>

                    {/* Done Button */}
                    <button 
                        onClick={handleDone}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold text-sm sm:text-base py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 transition-all duration-200"
                    >
                        Continue to My Courses
                    </button>

                    {/* Secondary Action - Optional */}
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full text-gray-500 hover:text-gray-700 font-medium text-xs sm:text-sm py-2 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PurchaseSucccessCard