import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  FaBook, 
  FaUsers, 
  FaStar, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaPlus,
  FaSearch,
  FaThLarge,
  FaList,
  FaChevronLeft,
  FaChevronRight,
  FaDollarSign,
  FaGraduationCap,
  FaChartLine,
  FaEllipsisH,
  FaPlayCircle,
  FaFilter,
  FaTimes
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); 

  // Pagination state
  const [page, setPage] = useState(1);
  const limit = 6;
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sort: 'newest'
  });

  const [showFilters, setShowFilters] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    avgRating: 0
  });

  useEffect(() => {
    fetchCourses();
  }, [page, filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/my-courses`, {
        params: {
          page,
          limit,
          search: filters.search,
          status: filters.status !== 'all' ? filters.status : undefined,
          sortBy: filters.sort,
          sortOrder: filters.sort === 'oldest' ? 'asc' : 'desc'
        },
        withCredentials: true,
      });

      console.log("API Response:", res.data);

      if (res.data.success) {
        setCourses(res.data.courses || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalCourses(res.data.totalCourses || res.data.courses?.length || 0);
        
        if (res.data.stats) {
          setStats(res.data.stats);
        } else {
          calculateStats(res.data.courses || []);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);
    }
  };

  const calculateStats = (coursesData) => {
    const totalStudents = coursesData.reduce((sum, c) => sum + (c.students_count || 0), 0);
    const totalRevenue = coursesData.reduce((sum, c) => sum + (c.total_revenue || 0), 0);
    const publishedCourses = coursesData.filter(c => c.status === 'published').length;
    const ratings = coursesData.filter(c => c.avg_rating).map(c => parseFloat(c.avg_rating));
    const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    
    setStats({
      totalCourses: coursesData.length,
      publishedCourses,
      totalStudents,
      totalRevenue,
      avgRating: avgRating.toFixed(1)
    });
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/get_course/${courseId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setCourses(courses.filter(c => c._id !== courseId));
        setTotalCourses(prev => prev - 1);
        alert('Course deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert(error.response?.data?.message || 'Failed to delete course');
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      sort: 'newest'
    });
    setPage(1);
  };

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.sort !== 'newest';

  // Loading State
  if (loading && courses.length === 0) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Title Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg sm:rounded-xl">
                    <FaGraduationCap className="text-lg sm:text-xl lg:text-2xl text-indigo-600" />
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    My Courses
                  </h1>
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs sm:text-sm font-semibold">
                    {totalCourses} {totalCourses === 1 ? 'Course' : 'Courses'}
                  </span>
                </div>
                <p className="text-gray-500 text-sm sm:text-base ml-0 sm:ml-10 lg:ml-14">
                  Manage your courses and track performance
                </p>
              </div>
              
              <Link
                to="/create_course"
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-indigo-700 font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-sm sm:text-base w-full sm:w-auto"
              >
                <FaPlus className="text-xs sm:text-sm" />
                Create Course
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
              <StatCard 
                icon={<FaBook className="text-indigo-600 text-sm sm:text-base" />}
                label="Total Courses"
                value={totalCourses}
                bgColor="bg-indigo-50"
              />
              <StatCard 
                icon={<FaUsers className="text-emerald-600 text-sm sm:text-base" />}
                label="Total Students"
                value={stats.totalStudents}
                bgColor="bg-emerald-50"
              />
              <StatCard 
                icon={<FaDollarSign className="text-amber-600 text-sm sm:text-base" />}
                label="Total Revenue"
                value={`$${stats.totalRevenue?.toLocaleString() || 0}`}
                bgColor="bg-amber-50"
              />
              <StatCard 
                icon={<FaStar className="text-pink-600 text-sm sm:text-base" />}
                label="Avg Rating"
                value={stats.avgRating || 'N/A'}
                bgColor="bg-pink-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Filters Bar */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 mb-4 sm:mb-6">
          {/* Mobile Filter Toggle */}
          <div className="flex items-center gap-2 sm:hidden mb-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search courses..."
                value={filters.search}
                onChange={(e) => {
                  setFilters({ ...filters, search: e.target.value });
                  setPage(1);
                }}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-lg border transition-colors ${
                showFilters || hasActiveFilters 
                  ? 'bg-indigo-100 border-indigo-200 text-indigo-600' 
                  : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}
            >
              <FaFilter className="text-sm" />
            </button>
            {/* View Toggle - Mobile */}
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                <FaThLarge className="text-sm" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                <FaList className="text-sm" />
              </button>
            </div>
          </div>

          {/* Mobile Expandable Filters */}
          <div className={`sm:hidden ${showFilters ? 'block' : 'hidden'}`}>
            <div className="flex flex-col gap-2 pb-3 border-b border-gray-100 mb-3">
              <select
                value={filters.status}
                onChange={(e) => {
                  setFilters({ ...filters, status: e.target.value });
                  setPage(1);
                }}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 font-medium"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={filters.sort}
                onChange={(e) => {
                  setFilters({ ...filters, sort: e.target.value });
                  setPage(1);
                }}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 font-medium"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="students">Most Students</option>
                <option value="revenue">Highest Revenue</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2.5 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <FaTimes className="text-xs" />
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="hidden sm:flex flex-col lg:flex-row gap-3 lg:gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={filters.search}
                onChange={(e) => {
                  setFilters({ ...filters, search: e.target.value });
                  setPage(1);
                }}
                className="w-full pl-10 lg:pl-11 pr-4 py-2.5 lg:py-3 bg-gray-50 border border-gray-200 rounded-lg lg:rounded-xl text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-2 lg:gap-3">
              {/* Status Filter */}
              <select
                value={filters.status}
                onChange={(e) => {
                  setFilters({ ...filters, status: e.target.value });
                  setPage(1);
                }}
                className="px-3 lg:px-4 py-2.5 lg:py-3 bg-gray-50 border border-gray-200 rounded-lg lg:rounded-xl text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 font-medium cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              {/* Sort */}
              <select
                value={filters.sort}
                onChange={(e) => {
                  setFilters({ ...filters, sort: e.target.value });
                  setPage(1);
                }}
                className="px-3 lg:px-4 py-2.5 lg:py-3 bg-gray-50 border border-gray-200 rounded-lg lg:rounded-xl text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 font-medium cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="students">Most Students</option>
                <option value="revenue">Highest Revenue</option>
              </select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 lg:px-4 py-2.5 lg:py-3 text-red-600 hover:bg-red-50 rounded-lg lg:rounded-xl font-medium transition-colors flex items-center gap-2 text-sm lg:text-base"
                >
                  <FaTimes className="text-xs sm:text-sm" />
                  Clear
                </button>
              )}

              {/* View Toggle - Desktop */}
              <div className="flex bg-gray-100 rounded-lg lg:rounded-xl p-1 ml-auto">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 lg:p-2.5 rounded-md lg:rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Grid View"
                >
                  <FaThLarge className="text-sm lg:text-base" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 lg:p-2.5 rounded-md lg:rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="List View"
                >
                  <FaList className="text-sm lg:text-base" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
              <span className="text-xs sm:text-sm text-gray-500">Active filters:</span>
              {filters.search && (
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                  Search: "{filters.search}"
                  <button onClick={() => setFilters({...filters, search: ''})}>
                    <FaTimes className="text-[10px] sm:text-xs" />
                  </button>
                </span>
              )}
              {filters.status !== 'all' && (
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                  Status: {filters.status}
                  <button onClick={() => setFilters({...filters, status: 'all'})}>
                    <FaTimes className="text-[10px] sm:text-xs" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
            Showing <span className="font-semibold text-gray-900">{courses.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{totalCourses}</span> courses
            {page > 1 && ` (Page ${page})`}
          </p>
        </div>

        {/* Courses Display */}
        {loading ? (
          <div className="flex justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : courses.length === 0 ? (
          <EmptyState hasFilters={hasActiveFilters} onClearFilters={clearFilters} />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {courses.map((course) => (
              <CourseCardGrid
                key={course._id}
                course={course}
                onDelete={handleDeleteCourse}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {courses.map((course) => (
              <CourseCardList
                key={course._id}
                course={course}
                onDelete={handleDeleteCourse}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination 
            page={page} 
            totalPages={totalPages} 
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, label, value, bgColor }) => (
  <div className={`${bgColor} rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 border border-gray-100`}>
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="p-1.5 sm:p-2 lg:p-2.5 bg-white rounded-md sm:rounded-lg shadow-sm flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide truncate">{label}</p>
        <p className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 truncate">{value}</p>
      </div>
    </div>
  </div>
);

// Loading State
const LoadingState = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-gray-200 rounded-lg w-36 sm:w-48 mb-2"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-48 sm:w-64"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mt-4 sm:mt-6 lg:mt-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 sm:h-18 lg:h-20 bg-gray-200 rounded-lg sm:rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm animate-pulse">
            <div className="h-36 sm:h-44 lg:h-48 bg-gray-200"></div>
            <div className="p-3 sm:p-4 lg:p-5">
              <div className="h-4 sm:h-5 bg-gray-200 rounded mb-2 sm:mb-3 w-3/4"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2 w-full"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded mb-3 sm:mb-4 w-2/3"></div>
              <div className="flex gap-2">
                <div className="h-9 sm:h-10 bg-gray-200 rounded-lg sm:rounded-xl flex-1"></div>
                <div className="h-9 sm:h-10 bg-gray-200 rounded-lg sm:rounded-xl w-9 sm:w-10"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ hasFilters, onClearFilters }) => (
  <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 text-center border border-gray-100">
    <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
      {hasFilters ? (
        <FaSearch className="text-xl sm:text-2xl lg:text-3xl text-indigo-500" />
      ) : (
        <FaGraduationCap className="text-xl sm:text-2xl lg:text-3xl text-indigo-500" />
      )}
    </div>
    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
      {hasFilters ? 'No courses found' : 'No courses yet'}
    </h3>
    <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6 max-w-md mx-auto">
      {hasFilters
        ? 'Try adjusting your search or filters to find what you\'re looking for'
        : 'Create your first course and start sharing your knowledge with students'}
    </p>
    {hasFilters ? (
      <button
        onClick={onClearFilters}
        className="inline-flex items-center gap-2 px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 bg-gray-100 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-200 font-semibold transition-colors text-sm sm:text-base"
      >
        <FaTimes /> Clear Filters
      </button>
    ) : (
      <Link
        to="/create_course"
        className="inline-flex items-center gap-2 px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-lg sm:rounded-xl hover:bg-indigo-700 font-semibold shadow-lg shadow-indigo-200 transition-all text-sm sm:text-base"
      >
        <FaPlus /> Create Your First Course
      </Link>
    )}
  </div>
);

// Pagination Component
const Pagination = ({ page, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const showPages = window.innerWidth < 640 ? 3 : 5;
    let start = Math.max(1, page - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);
    
    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center mt-6 sm:mt-8 lg:mt-10 gap-1.5 sm:gap-2">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl bg-white border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-600"
      >
        <FaChevronLeft className="text-xs sm:text-sm" />
      </button>

      <div className="flex gap-1 sm:gap-1.5">
        {getPageNumbers().map(num => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all ${
              page === num 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl bg-white border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-600"
      >
        <FaChevronRight className="text-xs sm:text-sm" />
      </button>
    </div>
  );
};

// Grid View Course Card
const CourseCardGrid = ({ course, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  const statusConfig = {
    published: { 
      bg: 'bg-emerald-100', 
      text: 'text-emerald-700', 
      dot: 'bg-emerald-500',
      label: 'Published'
    },
    draft: { 
      bg: 'bg-amber-100', 
      text: 'text-amber-700', 
      dot: 'bg-amber-500',
      label: 'Draft'
    },
    archived: { 
      bg: 'bg-gray-100', 
      text: 'text-gray-600', 
      dot: 'bg-gray-400',
      label: 'Archived'
    },
  };

  const status = statusConfig[course.status] || statusConfig.draft;

  const getCourseThumbnail = () => {
    if (course.image && course.image.length > 0 && course.image[0]) {
      return course.image[0];
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title || 'Course')}&background=6366f1&color=fff&size=400&font-size=0.3`;
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200">
      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        <img
          src={getCourseThumbnail()}
          alt={course.title}
          className="w-full h-36 sm:h-44 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title || 'C')}&background=6366f1&color=fff&size=400`;
          }}
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link 
            to={`/course/${course._id}`}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="bg-white text-indigo-600 px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:bg-indigo-50 transition-colors text-xs sm:text-sm lg:text-base">
              <FaPlayCircle /> Preview
            </span>
          </Link>
        </div>

        {/* Status Badge */}
        <div className={`absolute top-2 sm:top-3 left-2 sm:left-3 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 ${status.bg} ${status.text}`}>
          <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${status.dot}`}></span>
          {status.label}
        </div>

        {/* More Actions Button */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowActions(!showActions);
            }}
            className="p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-md sm:rounded-lg shadow hover:bg-white transition-colors"
          >
            <FaEllipsisH className="text-gray-600 text-xs sm:text-sm" />
          </button>

          {/* Dropdown Menu */}
          {showActions && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowActions(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-36 sm:w-44 bg-white rounded-lg sm:rounded-xl shadow-xl border border-gray-100 py-1 z-20">
                <Link
                  to={`/course/${course._id}`}
                  className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 hover:bg-gray-50 transition-colors text-xs sm:text-sm"
                >
                  <FaEye className="text-gray-400" /> View Course
                </Link>
                <Link
                  to={`/course_analytics/${course._id}`}
                  className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 hover:bg-gray-50 transition-colors text-xs sm:text-sm"
                >
                  <FaChartLine className="text-gray-400" /> Analytics
                </Link>
                <Link
                  to={`/course_students/${course._id}`}
                  className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 hover:bg-gray-50 transition-colors text-xs sm:text-sm"
                >
                  <FaUsers className="text-gray-400" /> Students
                </Link>
                <hr className="my-1" />
                <button
                  onClick={() => {
                    setShowActions(false);
                    onDelete(course._id);
                  }}
                  className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-red-600 hover:bg-red-50 transition-colors text-xs sm:text-sm"
                >
                  <FaTrash className="text-red-400" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 lg:p-5">
        <h3 className="font-bold text-gray-900 mb-1.5 sm:mb-2 line-clamp-2 min-h-[2.25rem] sm:min-h-[2.5rem] lg:min-h-[2.75rem] leading-snug text-sm sm:text-base group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
          <span className="flex items-center gap-1 sm:gap-1.5">
            <FaUsers className="text-blue-500 text-[10px] sm:text-xs" />
            {course.students_count || 0}
          </span>
          <span className="flex items-center gap-1 sm:gap-1.5">
            <FaStar className="text-amber-500 text-[10px] sm:text-xs" />
            {course.avg_rating ? parseFloat(course.avg_rating).toFixed(1) : 'N/A'}
          </span>
          <span className="flex items-center gap-1 sm:gap-1.5">
            <FaBook className="text-purple-500 text-[10px] sm:text-xs" />
            {course.lessons_count || course.courseModules?.length || 0}
          </span>
        </div>

        {/* Price/Revenue */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-base sm:text-lg font-bold text-emerald-600">
            ${course.price || 0}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-400">
            {formatDate(course.createdAt)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/edit_course/${course._id}`}
            className="flex-1 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg sm:rounded-xl hover:bg-indigo-700 font-semibold text-center transition-all text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2"
          >
            <FaEdit className="text-[10px] sm:text-xs" /> Edit Course
          </Link>
          <Link
            to={`/course_students/${course._id}`}
            className="p-2 sm:p-2.5 bg-gray-100 text-gray-600 rounded-lg sm:rounded-xl hover:bg-gray-200 transition-all"
            title="View Students"
          >
            <FaUsers className="text-xs sm:text-sm" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// List View Course Card
const CourseCardList = ({ course, onDelete }) => {
  const statusConfig = {
    published: { 
      bg: 'bg-emerald-100', 
      text: 'text-emerald-700', 
      label: 'Published'
    },
    draft: { 
      bg: 'bg-amber-100', 
      text: 'text-amber-700', 
      label: 'Draft'
    },
    archived: { 
      bg: 'bg-gray-100', 
      text: 'text-gray-600', 
      label: 'Archived'
    },
  };

  const status = statusConfig[course.status] || statusConfig.draft;

  const getCourseThumbnail = () => {
    if (course.image && course.image.length > 0 && course.image[0]) {
      return course.image[0];
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title || 'Course')}&background=6366f1&color=fff&size=200`;
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-indigo-200">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Thumbnail */}
        <div className="relative flex-shrink-0">
          <img
            src={getCourseThumbnail()}
            alt={course.title}
            className="w-full sm:w-32 lg:w-40 h-24 sm:h-24 lg:h-28 object-cover rounded-lg sm:rounded-xl"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title || 'C')}&background=6366f1&color=fff&size=200`;
            }}
          />
          <span className={`absolute top-1.5 sm:top-2 left-1.5 sm:left-2 px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold ${status.bg} ${status.text}`}>
            {status.label}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-2 mb-1.5 sm:mb-2">
            <h3 className="font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1 text-sm sm:text-base">
              {course.title}
            </h3>
            <span className="text-base sm:text-lg font-bold text-emerald-600 whitespace-nowrap">
              ${course.price || 0}
            </span>
          </div>
          
          <p className="text-xs sm:text-sm text-gray-500 line-clamp-1 mb-2 sm:mb-3">
            {course.description || 'No description'}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
            <span className="flex items-center gap-1 sm:gap-1.5">
              <FaUsers className="text-blue-500 text-[10px] sm:text-xs" />
              {course.students_count || 0} students
            </span>
            <span className="flex items-center gap-1 sm:gap-1.5">
              <FaStar className="text-amber-500 text-[10px] sm:text-xs" />
              {course.avg_rating ? parseFloat(course.avg_rating).toFixed(1) : 'N/A'}
            </span>
            <span className="flex items-center gap-1 sm:gap-1.5">
              <FaBook className="text-purple-500 text-[10px] sm:text-xs" />
              {course.lessons_count || course.courseModules?.length || 0} lessons
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-gray-400">
              {formatDate(course.createdAt)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <Link
              to={`/edit_course/${course._id}`}
              className="px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-indigo-600 text-white rounded-md sm:rounded-lg hover:bg-indigo-700 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1 sm:gap-1.5"
            >
              <FaEdit className="text-[10px] sm:text-xs" /> Edit
            </Link>
            <Link
              to={`/course_analytics/${course._id}`}
              className="px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 rounded-md sm:rounded-lg hover:bg-gray-200 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1 sm:gap-1.5"
            >
              <FaChartLine className="text-[10px] sm:text-xs" /> Analytics
            </Link>
            <Link
              to={`/course_students/${course._id}`}
              className="px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-blue-50 text-blue-600 rounded-md sm:rounded-lg hover:bg-blue-100 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1 sm:gap-1.5"
            >
              <FaUsers className="text-[10px] sm:text-xs" /> Students
            </Link>
            <button
              onClick={() => onDelete(course._id)}
              className="px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-red-50 text-red-600 rounded-md sm:rounded-lg hover:bg-red-100 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1 sm:gap-1.5"
            >
              <FaTrash className="text-[10px] sm:text-xs" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;