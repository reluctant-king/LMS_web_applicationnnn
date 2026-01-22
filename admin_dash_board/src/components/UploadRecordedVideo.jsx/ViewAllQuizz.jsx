import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaSearch, FaQuestionCircle, FaRegEye, FaTimes } from 'react-icons/fa';
import Delete from '../TableActions/Delete';
import PaginationButton from '../PaginationButton/PaginationButton';
import Edit from '../TableActions/Edit';
import { useNavigate } from 'react-router-dom';

const ViewAllQuizz = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [search, setSearch] = useState('');
    const [deleteClick, setDeleteClick] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [id, setId] = useState('');
    const navigate = useNavigate()
    const deleteCont = 'Are you sure you want to delete this quiz?';

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage] = useState(5);
    const indexOfLast = currentPage * itemPerPage;
    const indexOfFirst = indexOfLast - itemPerPage;

    const getAllQuizzes = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_module_quizz`);
            if (res.data.success) {
                setQuizzes(res.data.quizes || []);
            }
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
    };

    useEffect(() => {
        getAllQuizzes();
    }, []);

    const handleViewDetails = (quiz) => {
        setSelectedQuiz(quiz);
        setShowDetailsPopup(true);
    };

    const closeDetailsPopup = () => {
        setShowDetailsPopup(false);
        setSelectedQuiz(null);
    };


    const handleEdit = (q) => {

    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            <div className="w-full max-w-7xl mx-auto">
                <div className="mb-8 flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-xl">
                        <FaQuestionCircle className="text-white text-2xl" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Quiz Library</h2>
                        <p className="text-gray-600">Manage and organize all uploaded quizzes</p>
                    </div>
                </div>

                {/* Search and total */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by course name..."
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 px-4 py-2 rounded-xl border border-purple-200">
                            <p className="text-sm text-gray-600">Total Quizzes</p>
                            <p className="text-2xl font-bold text-indigo-600">{quizzes.length}</p>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                        <h3 className="text-xl font-semibold text-white">All Uploaded Quizzes</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">#</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Course</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Module</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Question</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {quizzes.map((quiz, i) => (
                                    <tr
                                        key={quiz._id}
                                        className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-200"
                                    >
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                                            {i + 1}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{quiz.course}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{quiz.courseId}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{quiz.moduleQuizz.length} questions</td>

                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                                                    onClick={() => handleViewDetails(quiz)}
                                                >
                                                    <FaRegEye />
                                                </button>
                                                <button
                                                    className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition"
                                                    onClick={() => navigate(`/upload_module_quizz/${quiz._id}`)}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                                                    onClick={() => alert(`Delete quiz ${quiz._id}`)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            {showDetailsPopup && selectedQuiz && (
                <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">

                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-white">{selectedQuiz.course}</h3>
                                <p className="text-indigo-100 text-sm">Course ID: {selectedQuiz.courseId}</p>
                            </div>
                            <button
                                onClick={closeDetailsPopup}
                                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>


                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                            <div className="mb-4">
                                <p className="text-gray-600 font-semibold">Total Questions: <span className="text-indigo-600">{selectedQuiz.moduleQuizz.length}</span></p>
                            </div>


                            <div className="space-y-6">
                                {selectedQuiz.moduleQuizz.map((mq, index) => (
                                    <div key={mq._id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">

                                        <div className="mb-4">
                                            <div className="flex items-start gap-3">
                                                <span className="bg-indigo-600 text-white font-bold px-3 py-1 rounded-lg text-sm">
                                                    Q{index + 1}
                                                </span>
                                                <div className="flex-1">
                                                    <p className="text-sm text-indigo-600 font-semibold mb-1">{mq.module}</p>
                                                    <p className="text-gray-900 font-medium text-lg">{mq.question}</p>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="space-y-2 mb-4">
                                            {Object.entries(mq.options).map(([key, value]) => (
                                                <div
                                                    key={key}
                                                    className={`p-3 rounded-lg border-2 ${mq.rightAnswer === key
                                                        ? 'bg-green-50 border-green-500'
                                                        : 'bg-white border-gray-200'
                                                        }`}
                                                >
                                                    <span className="font-bold text-gray-700">{key}:</span>
                                                    <span className="ml-2 text-gray-900">{value}</span>
                                                    {mq.rightAnswer === key && (
                                                        <span className="ml-3 text-green-600 font-semibold text-sm">✓ Correct Answer</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>


                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewAllQuizz;