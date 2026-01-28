import React, { useState } from 'react';
import { Save, Upload, Trash2, Plus, GripVertical } from 'lucide-react';

const EditCoursePage = () => {
  const [course, setCourse] = useState({
    title: 'Complete Web Development Bootcamp',
    description: 'Learn web development from scratch with HTML, CSS, JavaScript, React, and Node.js',
    price: 99.99,
    category: 'Web Development',
    image: '',
    modules: [
      { id: 1, title: 'Introduction to HTML', duration: '2 hours' },
      { id: 2, title: 'CSS Fundamentals', duration: '3 hours' },
      { id: 3, title: 'JavaScript Basics', duration: '4 hours' }
    ]
  });

  const [newModule, setNewModule] = useState({ title: '', duration: '' });

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const addModule = () => {
    if (newModule.title && newModule.duration) {
      setCourse({
        ...course,
        modules: [...course.modules, { ...newModule, id: Date.now() }]
      });
      setNewModule({ title: '', duration: '' });
    }
  };

  const removeModule = (id) => {
    setCourse({
      ...course,
      modules: course.modules.filter(m => m.id !== id)
    });
  };

  const handleSave = () => {
    alert('Course updated successfully!');
    console.log('Saved course:', course);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Image uploaded:', file.name);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-6 lg:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 lg:p-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Edit Course</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Update your course information and content</p>
        </div>
        
        {/* Basic Info */}
        <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
          {/* Course Title */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              Course Title
            </label>
            <input
              type="text"
              name="title"
              value={course.title}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={course.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
            />
          </div>

          {/* Price & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={course.price}
                onChange={handleChange}
                step="0.01"
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Category
              </label>
              <select
                name="category"
                value={course.category}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white transition-all"
              >
                <option>Web Development</option>
                <option>Mobile Development</option>
                <option>Data Science</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Business</option>
              </select>
            </div>
          </div>

          {/* Course Image */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              Course Image
            </label>
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 sm:gap-4">
              <label className="flex items-center justify-center w-full xs:w-auto px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition cursor-pointer text-sm sm:text-base">
                <Upload className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <span className="text-xs sm:text-sm text-gray-500 truncate max-w-full">
                {course.image || 'No file selected'}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4 sm:my-6"></div>

        {/* Modules Section */}
        <div className="mb-5 sm:mb-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Course Modules</h2>
            <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
              {course.modules.length} modules
            </span>
          </div>
          
          {/* Module List */}
          <div className="space-y-2 sm:space-y-3 mb-4">
            {course.modules.length === 0 ? (
              <div className="text-center py-8 sm:py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <p className="text-gray-500 text-sm sm:text-base">No modules yet. Add your first module below.</p>
              </div>
            ) : (
              course.modules.map((module, index) => (
                <div
                  key={module.id}
                  className="flex items-start sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition group"
                >
                  {/* Drag Handle - Hidden on mobile */}
                  <div className="hidden sm:flex items-center text-gray-400">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  
                  {/* Module Number */}
                  <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                    {index + 1}
                  </div>
                  
                  {/* Module Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-700 text-sm sm:text-base truncate">
                      {module.title}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {module.duration}
                    </p>
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => removeModule(module.id)}
                    className="flex-shrink-0 p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Remove module"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add Module Form */}
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100">
            <p className="text-xs sm:text-sm font-medium text-blue-700 mb-2 sm:mb-3">Add New Module</p>
            <div className="flex flex-col gap-2 sm:gap-3">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <input
                  type="text"
                  placeholder="Module title"
                  value={newModule.title}
                  onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g., 2 hours)"
                  value={newModule.duration}
                  onChange={(e) => setNewModule({ ...newModule, duration: e.target.value })}
                  className="w-full sm:w-40 lg:w-48 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                />
              </div>
              <button
                onClick={addModule}
                disabled={!newModule.title || !newModule.duration}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition font-semibold text-sm sm:text-base"
              >
                <Plus className="w-4 h-4" />
                Add Module
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-200">
          <button
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-bold text-sm sm:text-base shadow-md hover:shadow-lg"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCoursePage;