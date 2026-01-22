import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

const Mentors = () => {
  const MentorCard = ({ instructor }) => (
    <div className="min-w-[260px] xs:min-w-[280px] sm:min-w-[300px] bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-purple-100 text-center flex-shrink-0 hover:shadow-xl transition-all duration-300">
      {/* Avatar */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-purple-100 shadow mx-auto mb-3 sm:mb-4">
        <img
          src={
            instructor.image ||
            instructor.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.name)}&size=256&background=7c3aed&color=fff`
          }
          alt={instructor.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.name)}&size=256&background=7c3aed&color=fff`;
          }}
        />
      </div>
      
      {/* Title/Role */}
      <p className="text-purple-600 font-semibold uppercase tracking-wider text-xs sm:text-sm mb-1">
        {instructor.title || instructor.role || 'Instructor'}
      </p>
      
      {/* Name */}
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 line-clamp-1">
        {instructor.name}
      </h3>
      
      {/* Social Links */}
      <div className="flex justify-center gap-2 sm:gap-3">
        <a
          href={instructor.social?.facebook || '#'}
          className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 hover:bg-purple-600 hover:text-white transition-colors duration-200"
          aria-label="Facebook"
        >
          <FaFacebook className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </a>
        <a
          href={instructor.social?.twitter || '#'}
          className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 hover:bg-purple-600 hover:text-white transition-colors duration-200"
          aria-label="Twitter"
        >
          <FaTwitter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </a>
        <a
          href={instructor.social?.linkedin || '#'}
          className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 hover:bg-purple-600 hover:text-white transition-colors duration-200"
          aria-label="LinkedIn"
        >
          <FaLinkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </a>
      </div>
    </div>
  );

  const styleSheet = `
    @keyframes scrollLeft {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }
    
    /* Custom breakpoint for extra small devices */
    @media (min-width: 360px) {
      .xs\\:min-w-\\[280px\\] {
        min-width: 280px;
      }
    }
  `;

  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/view_instructor`, {
          params: { page: 1, limit: 1000 },
        });
        setInstructors(res.data.data || []);
      } catch {
        setInstructors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 text-center bg-gradient-to-br from-slate-50 to-purple-50 min-h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading instructors...</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (!instructors.length) {
    return (
      <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 text-center bg-gradient-to-br from-slate-50 to-purple-50 min-h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">No instructors found.</p>
        </div>
      </div>
    );
  }

  const instructorsForScroll = [...instructors, ...instructors];

  // Responsive animation duration based on number of instructors
  const animationDuration = Math.max(20, instructors.length * 5);

  const scrollAnimationStyle = {
    animationName: 'scrollLeft',
    animationDuration: `${animationDuration}s`,
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationPlayState: isPaused ? 'paused' : 'running',
  };

  return (
    <>
      <style>{styleSheet}</style>
      <div className="bg-gradient-to-br from-slate-50 to-purple-50 py-12 sm:py-16 md:py-20 overflow-hidden">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16 px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 leading-tight">
            Meet Our Expert Instructors
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed">
            Learn from industry professionals with years of experience in their respective fields.
          </p>
        </div>

        {/* Scrolling Cards Container */}
        <div className="px-2 sm:px-4 md:px-6">
          <div
            className="flex gap-3 sm:gap-4 md:gap-6 w-max"
            style={scrollAnimationStyle}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {instructorsForScroll.map((instructor, index) => (
              <MentorCard 
                key={`${instructor.id || instructor.name}-${index}`} 
                instructor={instructor} 
              />
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-8 sm:mt-10 md:mt-12 px-4">
          <button className="bg-gradient-to-r from-blue-600 to-pink-600 text-white font-semibold sm:font-bold px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base hover:shadow-xl hover:scale-105 active:scale-100 transition-all duration-300 w-full sm:w-auto max-w-xs sm:max-w-none">
            View All Instructors
          </button>
        </div>
      </div>
    </>
  );
};

export default Mentors;