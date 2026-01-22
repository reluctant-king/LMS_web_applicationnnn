import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEdit, FaEnvelope, FaPhone, FaGlobe, FaMapMarkerAlt, FaUsers, FaBriefcase, FaBook, FaCertificate } from "react-icons/fa";
import { AdminContext } from '../AdminContext/Context';
import EditProfile from './EditProfile';

const MyProfile = () => {
  let [profile, setProfile] = useState([])
  const [showEdit, setShowEdit] = useState(false)
  const [id, setId] = useState("")
  const { admin } = useContext(AdminContext)
  const getProfile = async () => {
    let res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_profile_details`, {
      withCredentials: true
    })
    setProfile(res.data.profile)
    console.log(res);
  }

  useEffect(() => {
    getProfile()
  }, [])

  const handleEdit = (id) => {
    console.log(id)
    setShowEdit(true)
    setId(id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      {/* Top Header with Button */}
      {showEdit && <EditProfile setShowEdit={setShowEdit} id={id} />}
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Institute Profile
          </h2>
          <p className="text-gray-600 mt-1">Manage your institution's information</p>
        </div>


        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 " onClick={() => handleEdit(admin?._id)}>
          + Create Profile
        </button>


      </div>


    
       
         
            <div
            
              className="relative max-w-6xl w-full mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm bg-opacity-95"
            >

              <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>



              <button className="absolute top-6 right-6 p-3 bg-white text-green-600 rounded-full shadow-lg hover:shadow-xl hover:text-green-700 hover:scale-110 transition-all duration-200 z-10"
                 onClick={() => handleEdit(admin?._id)}
              >
                <FaEdit size={20} />
              </button>



              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center md:items-center gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-50"></div>
                    <img
                      src=""
                      alt="Institute Logo"
                      className="relative w-32 h-32 md:w-40 md:h-40 object-cover rounded-2xl border-4 border-white shadow-2xl"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
                      {admin?.institutionName || "N/A"}
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 mb-4 font-light">
                      Empowering students with knowledge & innovation
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <span className="px-4 py-2  bg-opacity-20 backdrop-blur-md text-white rounded-full text-sm font-medium border border-white border-opacity-30">
                        <FaCertificate className="inline mr-2" />
                        AICTE Accredited
                      </span>
                      <span className="px-4 py-2  bg-opacity-20 backdrop-blur-md text-white rounded-full text-sm font-medium border border-white border-opacity-30">
                        Est. {admin?.founded || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>


              <div className="p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                      <span className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full mr-3"></span>
                      Contact Information
                    </h2>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3 text-gray-700 hover:text-blue-600 transition-colors">
                        <FaMapMarkerAlt className="mt-1 text-blue-600 flex-shrink-0" size={18} />
                        <span className="font-medium">{admin?.address || "N/A"}</span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors">
                        <FaEnvelope className="text-purple-600 flex-shrink-0" size={18} />
                        <span className="font-medium">{admin?.email}</span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors">
                        <FaPhone className="text-green-600 flex-shrink-0" size={18} />
                        <span className="font-medium">{admin?.phone || "N/A"}</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <FaGlobe className="text-indigo-600 flex-shrink-0" size={18} />
                        <a
                          href={admin?.websiteUrl}
                          className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {admin?.websiteUrl}
                        </a>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <span className="mt-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold flex-shrink-0">GSTIN</span>
                        <span className="font-medium">{admin?.gstin || "N/A"}</span>
                      </li>
                    </ul>
                  </div>


                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                      <span className="w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full mr-3"></span>
                      Academic Excellence
                    </h2>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <FaBook className="mt-1 text-purple-600 flex-shrink-0" size={18} />
                        <div>
                          <span className="block text-sm text-gray-600 mb-1">Courses Offered</span>
                          <span className="font-semibold text-gray-800"> {admin?.courses?.join(", ") || "N/A"}</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <FaUsers className="mt-1 text-indigo-600 flex-shrink-0" size={18} />
                        <div>
                          <span className="block text-sm text-gray-600 mb-1">Student Strength</span>
                          <span className="font-semibold text-gray-800">{admin?.students || "N/A"}</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <FaBriefcase className="mt-1 text-green-600 flex-shrink-0" size={18} />
                        <div>
                          <span className="block text-sm text-gray-600 mb-1">Placement Rate</span>
                          <span className="font-semibold text-gray-800">{admin?.placement || "N/A"}</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <FaCertificate className="mt-1 text-pink-600 flex-shrink-0" size={18} />
                        <div>
                          <span className="block text-sm text-gray-600 mb-1">Facilities</span>
                          <span className="font-semibold text-gray-800">{admin?.accreditation || "N/A"}</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Stats Cards */}
                {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white text-center shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-3xl font-bold mb-1">{admin.students || "N/A"}</div>
                    <div className="text-sm text-blue-100">Students</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white text-center shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-3xl font-bold mb-1">{admin.placement  || "N/A"}</div>
                    <div className="text-sm text-purple-100">Placements</div>
                  </div>
                  <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-6 rounded-xl text-white text-center shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-3xl font-bold mb-1"> {admin.founded || "N/A"}</div>
                    <div className="text-sm text-pink-100">Established</div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl text-white text-center shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-3xl font-bold mb-1">{admin.courses?.join(", ") || "N/A"}</div>
                    <div className="text-sm text-indigo-100">Courses</div>
                  </div>
                </div> */}
              </div>

              {/* Footer */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 text-center border-t border-gray-200">
                <p className="text-gray-600 text-sm font-medium">
                  © 2025 {admin?.institutionName}. All rights reserved.
                </p>
              </div>
            </div>
          
       
    </div>
  )
}

export default MyProfile