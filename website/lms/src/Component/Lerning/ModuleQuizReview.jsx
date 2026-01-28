import React, { useContext } from "react";
import { AllCourseDetail } from "../AllCourseContext/Context";

const ModuleQuizReview = ({ currentReview, onBack }) => {

    if (!currentReview || currentReview.length === 0) return null;

    const review = currentReview[0];
    const totalQuestions = review.answer?.length || 0;

    const percentage = ((review.score / totalQuestions) * 100).toFixed(0);
    const isPassed = percentage >= 70;

    console.log(isPassed);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8 relative animate-fadeIn border border-indigo-100">

                {/* Close Button */}
                <button
                    onClick={() => onBack(false)}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 p-1.5 sm:p-2 rounded-full transition-all"
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <div className="text-center mb-4 sm:mb-6 pr-8 sm:pr-0">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-700 leading-tight">
                        {review.moduleName}
                    </h2>
                    <p className="text-indigo-500 text-sm sm:text-base font-medium mt-1">Quiz Review</p>
                    <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-lg font-medium">
                        by {review.userName}
                    </p>
                </div>

                {/* Score Card */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 border border-indigo-100 shadow-sm text-center">
                    <h3 className="text-base sm:text-xl font-semibold text-indigo-700">Your Score</h3>
                    
                    {/* Score Display */}
                    <div className="my-3 sm:my-4">
                        <p className="text-4xl sm:text-5xl font-bold text-indigo-600">
                            {review.score}
                            <span className="text-slate-400 text-lg sm:text-2xl ml-1">/ {totalQuestions}</span>
                        </p>
                    </div>

                    {/* Percentage Bar */}
                    <div className="w-full max-w-xs mx-auto mb-3 sm:mb-4">
                        <div className="h-2 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                    isPassed ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-rose-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Percentage Text */}
                    <p className="text-sm sm:text-lg text-slate-600">
                        Percentage:{" "}
                        <span className="font-semibold text-indigo-700">{percentage}%</span>
                    </p>

                    {/* Pass/Fail Status */}
                    <div className={`mt-3 sm:mt-4 inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${
                        isPassed ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                        <span className="text-lg sm:text-xl">{isPassed ? '✅' : '❌'}</span>
                        <span className={`text-sm sm:text-lg font-semibold ${
                            isPassed ? "text-green-600" : "text-red-500"
                        }`}>
                            {isPassed ? "Passed" : "Failed"}
                        </span>
                    </div>

                    {/* Motivational Message */}
                    <p className="text-slate-600 mt-3 sm:mt-4 text-sm sm:text-base">
                        {review.score === totalQuestions
                            ? "🎉 Perfect Score!"
                            : isPassed
                                ? "👏 Great effort! You passed."
                                : "💪 Keep practicing and try again!"}
                    </p>
                </div>

                {/* Stats Summary - Mobile Friendly */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <div className="bg-blue-50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
                        <p className="text-lg sm:text-2xl font-bold text-blue-600">{totalQuestions}</p>
                        <p className="text-[10px] sm:text-xs text-blue-600 font-medium">Questions</p>
                    </div>
                    <div className="bg-green-50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
                        <p className="text-lg sm:text-2xl font-bold text-green-600">{review.score}</p>
                        <p className="text-[10px] sm:text-xs text-green-600 font-medium">Correct</p>
                    </div>
                    <div className="bg-red-50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
                        <p className="text-lg sm:text-2xl font-bold text-red-600">{totalQuestions - review.score}</p>
                        <p className="text-[10px] sm:text-xs text-red-600 font-medium">Wrong</p>
                    </div>
                </div>

                {/* Answer Review Section (Commented in original) */}
                {/* 
                <div className="max-h-[300px] sm:max-h-[400px] overflow-y-auto space-y-3 sm:space-y-4">
                    {review.answer.map((item, index) => (
                        <div
                            key={index}
                            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all ${
                                item.selectedOption === item.rightAnswer
                                    ? "border-green-400 bg-green-50"
                                    : "border-red-400 bg-red-50"
                            }`}
                        >
                            <p className="font-semibold text-slate-800 text-sm sm:text-base">
                                Q{index + 1}. {item.question}
                            </p>

                            <div className="mt-2 text-xs sm:text-sm space-y-1">
                                <p>
                                    <span className="font-semibold text-slate-700">
                                        Your Answer:{" "}
                                    </span>
                                    <span
                                        className={`${
                                            item.selectedOption === item.rightAnswer
                                                ? "text-green-600 font-semibold"
                                                : "text-red-600 font-semibold"
                                        }`}
                                    >
                                        {item.selectedOption}
                                    </span>
                                    {item.selectedOption === item.rightAnswer ? " ✓" : " ✗"}
                                </p>
                                {item.selectedOption !== item.rightAnswer && (
                                    <p>
                                        <span className="font-semibold text-slate-700">
                                            Correct Answer:{" "}
                                        </span>
                                        <span className="text-green-700 font-semibold">
                                            {item.rightAnswer}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                */}

                {/* Submission Time */}
                <div className="text-center mt-4 sm:mt-6 text-[10px] sm:text-xs text-slate-500">
                    Submitted on {new Date(review.submittedAt).toLocaleString()}
                </div>

                {/* Close Button */}
                <div className="text-center mt-4 sm:mt-6">
                    <button
                        onClick={() => onBack()}
                        className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl hover:scale-[1.02] sm:hover:scale-105 transition-transform shadow-md text-sm sm:text-base"
                    >
                        Close Review
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModuleQuizReview;