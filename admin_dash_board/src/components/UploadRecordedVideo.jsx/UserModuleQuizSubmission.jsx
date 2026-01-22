import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaSearch, FaClipboardList, FaEye } from 'react-icons/fa';
import ModuleQuizAnswerDetails from './ModuleQuizAnswerDetails';


const UserModuleQuizSubmission = () => {
  // const { moduleId } = useParams(); // <-- get module ID from URL
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [clickDetails, setClickDetails] = useState(false)
  const [courseName, setCourseName] = useState("")
  const [email, setEmail] = useState("")


  const getAllQuizSubmiters = async () => {
    try {
      setLoading(true)
      let res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_userSubmited_answer`)
      console.log(res)
      setResults(res.data.userSubmitedQquiz)

    } catch (error) {

    } finally {
      setLoading(false)

    }
  }

  useEffect(() => {
    getAllQuizSubmiters()
  }, [])



  // const handleViewDetails = (result) => {
  //   setSelectedResult(result);
  //   setShowModal(true);
  // };

  // const getScoreColor = (score, total) => {
  //   const percentage = (score / total) * 100;
  //   if (percentage === 100) return 'text-green-600';
  //   if (percentage >= 70) return 'text-blue-600';
  //   return 'text-orange-600';
  // };

  const getScoreBadgeColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage === 100) return 'bg-green-100 text-green-700 border-green-200';
    if (percentage >= 70) return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-orange-100 text-orange-700 border-orange-200';
  };

  const handleDetails = (courseNme, email) => {
    setClickDetails(true)
    setCourseName(courseNme)
    setEmail(email)
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {clickDetails &&
        <ModuleQuizAnswerDetails
          results={results}
          setClickDetails={setClickDetails}
          courseName={courseName}
          email={email}
        />}

      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
            <FaClipboardList className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {moduleName ? `${moduleName} - Quiz Submissions` : "Module Quiz Submissions"}
            </h2>
            <p className="text-gray-600">View all quiz attempts for this module</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              placeholder="Search by name or email..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>


        </div>


        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h3 className="text-xl font-semibold text-white">All Submissions for This Module</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">No</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Course name</th>

                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {[...new Map(results.map(item => [item.email, item])).values()].map((r, i) => {
                  return (
                    <tr key={i} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{i + 1}</span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-semibold text-gray-900">{r.userName}</p>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-600">{r.email}</p>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-600">{r.courseName}</p>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button

                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition font-medium text-sm"
                          onClick={() => handleDetails(r.courseName, r.email)}
                        >
                          <FaEye />
                          View Details
                        </button>
                      </td>
                    </tr>
                  )
                })}




              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModuleQuizSubmission;
