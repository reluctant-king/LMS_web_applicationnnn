import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Search, Filter, X, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import CourseCard from "./CourseCard";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCourses: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 8
  });

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const getAllCourses = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (debouncedSearch) params.append('title', debouncedSearch);
      if (category) params.append('category', category);
      if (price) params.append('price', price);
      if (duration) params.append('duration', duration);
      params.append('page', page);
      params.append('limit', 8);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/get_all_courses?${params.toString()}`,
        { withCredentials: true }
      );

      setCourses(res.data.courses);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, price, duration, sortBy, sortOrder]);

  useEffect(() => {
    getAllCourses(1);
  }, [debouncedSearch, category, price, duration, sortBy, sortOrder]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      getAllCourses(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClearFilter = () => {
    setSearch("");
    setCategory("");
    setPrice("");
    setDuration("");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const activeFiltersCount = [category, price, duration].filter(Boolean).length;

  const renderPagination = () => {
    const { currentPage, totalPages } = pagination;
    const pages = [];
    
    // Generate page numbers to show
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages);
    }
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(1, totalPages - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-10 md:mt-12 
                      flex-wrap px-2">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className={`flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 
                      rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 
                      active:scale-95 ${
            pagination.hasPrevPage
              ? 'bg-white text-purple-600 hover:bg-purple-50 border border-purple-200 shadow-sm hover:shadow'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* First page */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg text-xs sm:text-sm 
                         font-medium transition-all duration-200 bg-white text-gray-700 
                         hover:bg-purple-50 border border-gray-200 active:scale-95"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-1 sm:px-2 text-gray-400 text-sm">...</span>
            )}
          </>
        )}

        {/* Page Numbers */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg text-xs sm:text-sm 
                        font-medium transition-all duration-200 active:scale-95 ${
              currentPage === page
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200'
                : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Last page */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-1 sm:px-2 text-gray-400 text-sm">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg text-xs sm:text-sm 
                         font-medium transition-all duration-200 bg-white text-gray-700 
                         hover:bg-purple-50 border border-gray-200 active:scale-95"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className={`flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 
                      rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 
                      active:scale-95 ${
            pagination.hasNextPage
              ? 'bg-white text-purple-600 hover:bg-purple-50 border border-purple-200 shadow-sm hover:shadow'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 
                      text-white py-10 sm:py-12 md:py-16 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4">
            Explore Our Courses
          </h1>
          <p className="text-purple-100 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
            Discover world-class courses taught by industry experts. Start your learning journey today.
          </p>
          
          {/* Search Bar */}
          <div className="mt-5 sm:mt-6 md:mt-8 max-w-2xl mx-auto px-1">
            <div className="relative">
              <Search 
                className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                size={18} 
              />
              <input
                type="text"
                placeholder="Search by title or instructor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 md:py-4 
                           rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-800 
                           shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-300 
                           transition-all duration-200 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-5 sm:py-6 md:py-8">
        {/* Filter Toggle for Mobile */}
        <div className="lg:hidden mb-3 sm:mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 
                       bg-white rounded-lg shadow-sm border border-gray-200 
                       text-sm sm:text-base active:scale-95 transition-transform"
          >
            <SlidersHorizontal size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-purple-600 text-white text-[10px] sm:text-xs 
                               px-1.5 sm:px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Filters Section */}
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block 
                         bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 
                         p-4 sm:p-5 md:p-6 mb-5 sm:mb-6 md:mb-8`}>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Filter size={18} className="text-purple-600 sm:w-5 sm:h-5" />
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Filters</h3>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearFilter}
                className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm 
                           text-purple-600 hover:text-purple-800 transition-colors
                           active:scale-95"
              >
                <X size={14} className="sm:w-4 sm:h-4" />
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-200 px-3 sm:px-4 py-2 sm:py-2.5 
                           rounded-lg bg-gray-50 text-sm sm:text-base
                           focus:outline-none focus:ring-2 focus:ring-purple-400 
                           focus:bg-white transition-all"
              >
                <option value="">All Categories</option>
                <option value="Programming">Programming</option>
                <option value="Designing">Designing</option>
                <option value="Marketing">Marketing</option>
                <option value="Business">Business</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Price Range
              </label>
              <select
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-200 px-3 sm:px-4 py-2 sm:py-2.5 
                           rounded-lg bg-gray-50 text-sm sm:text-base
                           focus:outline-none focus:ring-2 focus:ring-purple-400 
                           focus:bg-white transition-all"
              >
                <option value="">All Prices</option>
                <option value="0-500">Under ₹500</option>
                <option value="500-1000">₹500 - ₹1,000</option>
                <option value="1000-2000">₹1,000 - ₹2,000</option>
                <option value="2000-5000">₹2,000 - ₹5,000</option>
                <option value="5000-10000">Above ₹5,000</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border border-gray-200 px-3 sm:px-4 py-2 sm:py-2.5 
                           rounded-lg bg-gray-50 text-sm sm:text-base
                           focus:outline-none focus:ring-2 focus:ring-purple-400 
                           focus:bg-white transition-all"
              >
                <option value="">All Durations</option>
                <option value="Short">Short (&lt; 2 months)</option>
                <option value="Medium">Medium (3-4 months)</option>
                <option value="Long">Long (6-12 months)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-200 px-3 sm:px-4 py-2 sm:py-2.5 
                           rounded-lg bg-gray-50 text-sm sm:text-base
                           focus:outline-none focus:ring-2 focus:ring-purple-400 
                           focus:bg-white transition-all"
              >
                <option value="createdAt">Newest First</option>
                <option value="price">Price</option>
                <option value="title">Title</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full border border-gray-200 px-3 sm:px-4 py-2 sm:py-2.5 
                           rounded-lg bg-gray-50 text-sm sm:text-base
                           focus:outline-none focus:ring-2 focus:ring-purple-400 
                           focus:bg-white transition-all"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center 
                        justify-between gap-1 sm:gap-2 mb-4 sm:mb-5 md:mb-6 px-1">
          <p className="text-gray-600 text-xs sm:text-sm md:text-base">
            Showing <span className="font-semibold text-gray-900">{courses.length}</span> of{" "}
            <span className="font-semibold text-gray-900">{pagination.totalCourses}</span> courses
          </p>
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
                          gap-4 sm:gap-5 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl sm:rounded-2xl shadow-sm 
                                       overflow-hidden animate-pulse">
                <div className="h-40 sm:h-44 md:h-48 bg-gray-200" />
                <div className="p-3 sm:p-4 md:p-5">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2 sm:mb-3" />
                  <div className="h-2.5 sm:h-3 bg-gray-200 rounded w-1/2 mb-1.5 sm:mb-2" />
                  <div className="h-2.5 sm:h-3 bg-gray-200 rounded w-2/3 mb-3 sm:mb-4" />
                  <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    <div className="h-5 sm:h-6 bg-gray-200 rounded-full w-14 sm:w-16" />
                    <div className="h-5 sm:h-6 bg-gray-200 rounded-full w-16 sm:w-20" />
                  </div>
                  <div className="h-7 sm:h-8 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <CourseCard courses={courses} />
            {pagination.totalPages > 1 && renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;