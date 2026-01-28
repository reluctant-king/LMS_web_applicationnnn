import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, BookOpen, MessageCircle, HelpCircle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { name: 'Courses', path: '/allcourses', icon: BookOpen },
    { name: 'Contact', path: '/contact', icon: MessageCircle },
    { name: 'Help', path: '/help', icon: HelpCircle },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-3 sm:px-4 md:px-6 py-6 sm:py-8 lg:py-12">
      <div className="max-w-6xl w-full mx-auto">
        <div className="text-center">
          
          {/* 404 GIF Background Section */}
          <div className="relative mb-4 sm:mb-6 lg:mb-8">
            <div 
              className="h-[220px] xs:h-[260px] sm:h-[320px] md:h-[400px] lg:h-[450px] bg-center bg-no-repeat mx-auto flex items-center justify-center rounded-xl overflow-hidden"
              style={{
                backgroundImage: 'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                maxWidth: '100%',
              }}
            >
              <h1 
                className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-gray-700/90 select-none" 
                style={{ fontFamily: 'Arvo, serif' }}
              >
                404
              </h1>
            </div>
          </div>

          {/* Content Box */}
          <div className="max-w-3xl mx-auto -mt-4 sm:-mt-8 md:-mt-12 lg:-mt-16">
            <h3 
              className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 sm:mb-3 lg:mb-4 leading-tight px-2" 
              style={{ fontFamily: 'Arvo, serif' }}
            >
              Look like you're lost
            </h3>
            
            <p className="text-gray-600 text-sm xs:text-base sm:text-lg md:text-xl mb-5 sm:mb-6 lg:mb-8 px-4 max-w-md mx-auto">
              The page you are looking for is not available!
            </p>
            
            {/* Main Buttons */}
            <div className="flex flex-col xs:flex-row gap-2.5 sm:gap-3 lg:gap-4 justify-center items-stretch xs:items-center mb-6 sm:mb-8 lg:mb-12 px-4 sm:px-2">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center justify-center gap-2 
                           px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-3.5 
                           bg-green-600 hover:bg-green-700 active:bg-green-800 
                           text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-md 
                           transition-all duration-200 shadow-lg hover:shadow-xl 
                           transform hover:scale-105 active:scale-95
                           focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                style={{ fontFamily: 'Arvo, serif' }}
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>Go to Home</span>
              </button>
              
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center gap-2 
                           px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-3.5 
                           bg-gray-100 hover:bg-gray-200 active:bg-gray-300 
                           text-gray-700 font-semibold text-sm sm:text-base rounded-lg sm:rounded-md 
                           transition-all duration-200 shadow-md hover:shadow-lg active:scale-95
                           focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                style={{ fontFamily: 'Arvo, serif' }}
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>Go Back</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-4 px-4 mb-4 sm:mb-6">
              <div className="flex-1 max-w-[100px] sm:max-w-[150px] h-px bg-gray-200"></div>
              <span className="text-xs sm:text-sm text-gray-400 font-medium whitespace-nowrap">
                or explore
              </span>
              <div className="flex-1 max-w-[100px] sm:max-w-[150px] h-px bg-gray-200"></div>
            </div>

            {/* Quick Links */}
            <div className="px-4 sm:px-2">
              <div className="flex flex-col xs:flex-row flex-wrap gap-2 sm:gap-2.5 lg:gap-3 justify-center items-stretch xs:items-center">
                {quickLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => navigate(link.path)}
                    className="inline-flex items-center justify-center gap-2 
                               px-4 sm:px-5 py-2.5 sm:py-2.5 
                               bg-white hover:bg-green-50 active:bg-green-100 
                               text-gray-600 hover:text-green-700 
                               text-sm font-medium
                               rounded-lg sm:rounded-md transition-all duration-200
                               border border-gray-200 hover:border-green-300
                               shadow-sm hover:shadow-md
                               active:scale-95
                               focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1"
                  >
                    <link.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{link.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Help Text */}
            <p className="mt-6 sm:mt-8 lg:mt-10 text-xs sm:text-sm text-gray-400 px-4">
              Need help? <button onClick={() => navigate('/contact')} className="text-green-600 hover:text-green-700 underline underline-offset-2">Contact Support</button>
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NotFound;