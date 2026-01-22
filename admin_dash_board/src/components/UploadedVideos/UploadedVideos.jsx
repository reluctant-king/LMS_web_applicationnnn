import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaSearch, FaVideo, FaPlus, FaPlay, FaEye } from 'react-icons/fa';
import Delete from '../TableActions/Delete';
import PaginationButton from '../PaginationButton/PaginationButton';
import Edit from '../TableActions/Edit';

const UploadedVideos = () => {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState('');
  const [deleteClick, setDeleteClick] = useState(false);
  const deleteCont = "Are you sure that you delete recorded video";
  let [currentPage, setCurrentPage] = useState(1)
  let [itemPerPage, setitemPerPage] = useState(6)
  let indexOfLastProduct = currentPage * itemPerPage
  let indexOfFirstnumber = indexOfLastProduct - itemPerPage
  const [showEditPopop, setShowEditPopup] = useState(false)
  const [id, setId] = useState("")
  const videoFields = [
    {
      label: "Select video",
      name: "video",
      type: "file",
      required: true,
    },
    {
      label: "Title",
      name: "title",
      type: "text",
      placeholder: "Enter video title",
      required: true,
    },
    {
      label: "Description",
      name: "description",
      type: "text",
      placeholder: "Enter video description",
      required: true,
    },
    {
      label: "Thumbnail",
      name: "image",
      type: "file",
      required: true,
    },
  ];
  const updateInput = {
    video: null,
    title: "",
    description: "",
    image: null
  }


  const getAllVideos = async (page = 1) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_records`);
      setVideos(res.data.totalItems || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  useEffect(() => {

    getAllVideos(1);
  }, [search]);

  let showrecordedvideos = videos.slice(indexOfFirstnumber, indexOfLastProduct)
  const handleEdit = (id) => {
    setId(id)
  }

  const handleDelete = () => setDeleteClick(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {deleteClick && <Delete setDeleteClick={setDeleteClick} deleteCont={deleteCont} />}
      {showEditPopop && <Edit
        field={videoFields}
        setShowEditPopup={setShowEditPopup}
        api_end_point={`${import.meta.env.VITE_API_URL}/api/v1/get_recoeded_video`}
        id={id}
        updateInput={updateInput}
        reRender={getAllVideos}
      />}
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
            <FaVideo className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Video Library</h2>
            <p className="text-gray-600">Manage and organize all uploaded videos</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              placeholder="Search videos..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-2 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-600">Total Videos</p>
              <p className="text-2xl font-bold text-blue-600">{videos.length}</p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transition transform hover:scale-105 flex items-center gap-2">
              <FaPlus /> Upload Video
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h3 className="text-xl font-semibold text-white">All Uploaded Videos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">#</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Video Details</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Description</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase">Video Link</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {showrecordedvideos.length > 0 ? (
                  showrecordedvideos.map((v, i) => (
                    <tr key={i} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{(currentPage - 1) * itemPerPage + (i + 1)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="relative group">
                          <img src={v.image} alt={v.title} className="w-24 h-16 rounded-lg object-cover border-2 border-blue-200 shadow-md" />

                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{v.title}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs line-clamp-2">{v.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {v.description}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {v.video ? (
                          <a href={v.video} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-lg shadow-md transition transform hover:scale-105">
                            <FaPlay className="text-sm" /> View Video
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 font-medium rounded-lg">No Video</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition group">
                            <FaEdit className="group-hover:scale-110 transition" onClick={() => {
                              setShowEditPopup(true);
                              handleEdit(v._id)
                            }} />
                          </button>
                          <button className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition group" onClick={handleDelete}>
                            <FaTrash className="group-hover:scale-110 transition" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <FaVideo className="text-gray-400 text-2xl" />
                        </div>
                        <p className="text-gray-500 font-medium">No videos found</p>
                        <p className="text-gray-400 text-sm">Upload your first video to get started</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <PaginationButton items={videos} itemPerPage={itemPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} />

      </div>
    </div>
  );
};

export default UploadedVideos;
