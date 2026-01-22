import React, { useState, useEffect } from 'react';
import { FaHeart, FaBullseye, FaShieldAlt, FaPuzzlePiece, FaMicrophone } from "react-icons/fa";


const CourseCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Icon mapping - you can customize this based on your category names
  const iconMap = {
    'Frontend': FaHeart,
    'Backend': FaPuzzlePiece,
    'Security': FaShieldAlt,
    'Full-Stack': FaMicrophone,
    'default': FaBullseye
  };

  const getIconForCategory = (title) => {
    const Icon = iconMap[title] || iconMap.default;
    return <Icon className="w-5 h-5 sm:w-6 sm:h-6" />;
  };

  useEffect(() => {
    const getAllCategories = async () => {
      try {
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/view_All_course_categories?page=1&limit=1000`);
        const data = await response.json();
        
        if (data.data) {
          setCategories(data.data.slice(0, 7)); 
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      
        setCategories([
          {
            _id: '1',
            title: 'Web Development Intro',
            description: 'Ready to start your web development journey?',
            courseCount: 0,
            category: 'HTML, CSS & Javascript'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    getAllCategories();
  }, []);

  if (loading) {
    return (
      <div className="bg-white py-10 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 sm:h-10 bg-gray-200 rounded w-48 sm:w-64 mx-auto mb-3 sm:mb-4"></div>
            <div className="h-4 sm:h-6 bg-gray-200 rounded w-64 sm:w-96 mx-auto mb-8 sm:mb-12"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5].map(i => (
                <div 
                  key={i} 
                  className={`bg-gray-200 rounded-xl sm:rounded-2xl ${
                    i === 1 ? 'h-48 sm:h-56 lg:h-64 sm:col-span-2 sm:row-span-2' : 'h-40 sm:h-48 lg:h-64'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-10 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16 px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Courses Categories
          </h2>
          <p className="text-gray-500 text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            A comprehensive selection of courses designed to empower you with
            the skills you need to thrive in the dynamic world of web development.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {categories.map((category, index) => {
            // First card is larger and highlighted
            const isMainCard = index === 0;
            
            return (
              <div
                key={category._id}
                className={`group relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer 
                           transition-all duration-500 active:scale-[0.98] ${
                  isMainCard 
                    ? 'sm:col-span-2 sm:row-span-2 h-64 sm:h-80 md:h-[450px] lg:h-[520px]' 
                    : 'h-44 sm:h-48 md:h-56 lg:h-[250px]'
                } hover:scale-105 hover:shadow-2xl`}
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                  <img
                    src={`https://images.unsplash.com/photo-${
                      index === 0 ? '1498050108023-c5249f4df085' :
                      index === 1 ? '1487058792252-fa8eac87a087' :
                      index === 2 ? '1526374965328-7f61d4dc18c5' :
                      index === 3 ? '1555066931-4365d14bab8c' :
                      '1504384308090-c894fdcc538d'
                    }?w=800&q=80`}
                    alt={category.title}
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500"
                  />
                </div>

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                {/* Content */}
                <div className="absolute inset-0 p-4 sm:p-5 md:p-6 flex flex-col justify-between">
                  {/* Icon */}
                  <div className="flex justify-start">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 
                                    bg-white/20 backdrop-blur-sm rounded-full 
                                    flex items-center justify-center text-white 
                                    border border-white/30 
                                    group-hover:scale-110 transition-transform duration-300">
                      {getIconForCategory(category.title)}
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="text-white">
                    {category.category && (
                      <p className="text-xs sm:text-sm text-gray-300 mb-1 sm:mb-2 font-medium truncate">
                        {category.category}
                      </p>
                    )}
                    <h3 className={`font-bold mb-1 sm:mb-2 leading-snug ${
                      isMainCard 
                        ? 'text-xl sm:text-2xl md:text-3xl' 
                        : 'text-base sm:text-lg md:text-xl'
                    }`}>
                      {category.title}
                    </h3>
                    {isMainCard && category.description && (
                      <p className="text-gray-300 mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    {category.courseCount !== undefined && (
                      <p className="text-xs sm:text-sm text-gray-400">
                        {category.courseCount} Courses
                      </p>
                    )}
                    {isMainCard && (
                      <button className="mt-3 sm:mt-4 bg-white text-gray-900 
                                         px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 
                                         rounded-lg text-sm sm:text-base font-semibold 
                                         hover:bg-gray-100 active:bg-gray-200 
                                         transition-colors active:scale-95">
                        ENROLL NOW
                      </button>
                    )}
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-xl sm:rounded-2xl transition-colors duration-300"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseCategories;