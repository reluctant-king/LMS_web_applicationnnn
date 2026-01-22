import React, { useEffect, useState, useContext } from 'react';
import {
  FaBook,
  FaUsers,
  FaDollarSign,
  FaStar,
  FaChartLine,
  FaPlus,
  FaEdit,
  FaEye,
  FaClock,
  FaBell,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaSass
} from 'react-icons/fa';
import { MdAssignment } from "react-icons/md";
import { Link } from 'react-router-dom';
import axios from 'axios';
import AddInstructors from '../Instructors/AddInstructors'
import UploadAssignment from './UploadAssignment';
import { AllCourseDetail } from '../AllCourseContext/Context';
import UserSubmittedAssignments from './UserSubmittedAssignments';

const InstructorPage = () => {
  const { user } = useContext(AllCourseDetail);

  // const [instructorData, setInstructorData] = useState(null);
  const [instructors, setInstructors] = useState(false)
  const [feeDetail, setFeeDetail] = useState([])
  const [email, setEmail] = useState(null);
  const [instructorDetails, setInstructorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [clickCreateAssignMent, setClickCreateAssignment] = useState(false)
   const [clickUserAssignMent, setClickUserAssignment] = useState(false)
  const [course, setCourse] = useState([])

  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEarnings: 0,
    averageRating: 0
  });



  // const fetchInstructorData = async () => {
  //   try {
  //     const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/me`, {
  //       withCredentials: true
  //     });

  //     if (res.data.success) {
  //       setInstructorData(res.data.user);
  //       setEmail(res.data.user.email);
  //       console.log('Instructor Data (User):', res.data.user);
  //     }
  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching instructor data:', error);
  //     setLoading(false);
  //   }
  // };

  const fetchInstructorDetails = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_courses`);
      const instrectors = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_approved_instrectors`)
      let paymentRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_payment_details`)
   
      setCourse(res.data.courses)
      setInstructors(instrectors.data.instrecters)
      setFeeDetail(paymentRes.data.paymentDetails)
      console.log(res)
      console.log(instrectors)
      console.log(paymentRes)
      if (res.data.success && res.data.courses) {
        setCourse(res.data.courses)
      }
    } catch (error) {
      console.error('Error fetching instructor details:', error);
    } finally {
      setLoading(false)
    }
  };


  useEffect(() => {
    // fetchInstructorData();
    fetchInstructorDetails();
  }, []);

  const filtered = course.filter(
    (item) => item.instructoremail === user?.email
  );

  const totalCourse = filtered.length
  console.log(filtered)
  console.log(feeDetail)

const instructorname = filtered.map((c)=>c.title)
console.log(instructorname)

const students = feeDetail.filter((p) =>
  instructorname.includes(p.courseName)
);

console.log(students)


  const recentStudents = [
    { id: 1, name: 'John Doe', course: 'React Masterclass', enrolledDate: '2024-01-10' },
    { id: 2, name: 'Jane Smith', course: 'Node.js Backend', enrolledDate: '2024-01-09' },
    { id: 3, name: 'Mike Johnson', course: 'Full Stack', enrolledDate: '2024-01-08' },
  ];

  const upcomingSchedule = [
    { id: 1, title: 'Live Session: React Hooks', time: '10:00 AM', date: 'Today' },
    { id: 2, title: 'Q&A Session', time: '2:00 PM', date: 'Tomorrow' },
    { id: 3, title: 'Course Review Meeting', time: '4:00 PM', date: 'Jan 15' },
  ];

  console.log("Instructor Email:", user?.email);
  console.log("Courses:", course);




  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600">Failed to load instructor data</p>
          <button
            onClick={fetchInstructorData}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>

      {showForm && <AddInstructors setShowForm={setShowForm} emailll={email} />}
      {clickCreateAssignMent && <UploadAssignment
        setClickCreateAssignment={setClickCreateAssignment}
        clickCreateAssignMent={clickCreateAssignMent}
        course={filtered}
        students={students}
      />}
      { clickUserAssignMent && <UserSubmittedAssignments setClickUserAssignment={setClickUserAssignment}/>}

     
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
         
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-6 text-white">
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex-1 min-w-[300px]">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Welcome back, {user.firstname} {user.lastname}! 👋
                </h1>
                <p className="text-blue-100 text-lg">
                  {instructorDetails?.specialization
                    ? `Expert in ${instructorDetails.specialization}`
                    : 'Ready to inspire minds today?'}
                </p>
              </div>

           
              <div className="flex-shrink-0">
                {instructorDetails?.image ? (
                  <img
                    src={instructorDetails.image}
                    alt={user.firstname}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4  shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white bg-opacity-30 flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-4xl md:text-5xl font-bold">
                      {user.firstname?.[0]}{user.lastname?.[0]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          
          {!instructorDetails && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6 rounded-lg shadow">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-yellow-600 text-2xl">⚠️</div>
                  <div>
                    <h3 className="text-yellow-800 font-semibold text-lg">Complete Your Instructor Profile</h3>
                    <p className="text-yellow-700 text-sm">Add your details to start teaching and attract more students</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Complete Profile
                </button>
              </div>
            </div>
          )}

         
          {instructorDetails && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Instructor Profile</h2>
                <button
                  onClick={() => setShowForm(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                >
                  <FaEdit /> Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">Contact Information</h3>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaEnvelope className="text-blue-600" />
                    <span className="text-sm">{instructorDetails.email || user.email}</span>
                  </div>
                  {(instructorDetails?.phone || user.phone) && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaPhone className="text-blue-600" />
                      <span className="text-sm">{instructorDetails.phone || user.phone}</span>
                    </div>
                  )}
                </div>

               
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">Qualifications</h3>
                  {instructorDetails.qualification && (
                    <div className="text-gray-700">
                      <p className="text-sm font-medium">🎓 {instructorDetails.qualification}</p>
                    </div>
                  )}
                  {instructorDetails.experience && (
                    <div className="text-gray-700">
                      <p className="text-sm font-medium">💼 {instructorDetails.experience} years experience</p>
                    </div>
                  )}
                </div>

                
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">Social Links</h3>
                  <div className="flex gap-3">
                    {instructorDetails.linkedin && (
                      <a
                        href={instructorDetails.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg flex items-center justify-center transition"
                      >
                        <FaLinkedin className="text-xl" />
                      </a>
                    )}
                    {instructorDetails.github && (
                      <a
                        href={instructorDetails.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center transition"
                      >
                        <FaGithub className="text-xl" />
                      </a>
                    )}
                    {instructorDetails.website && (
                      <a
                        href={instructorDetails.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg flex items-center justify-center transition"
                      >
                        <FaGlobe className="text-xl" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              {instructorDetails?.bio && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">About</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{instructorDetails.bio}</p>
                </div>
              )}
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Courses</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{totalCourse}</h3>
                  <p className="text-green-600 text-xs mt-1">↑ 2 this month</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaBook className="text-blue-600 text-2xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Students</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalStudents || 1245}</h3>
                  <p className="text-green-600 text-xs mt-1">↑ 89 this month</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <FaUsers className="text-green-600 text-2xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Earnings</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">${stats.totalEarnings || '12,480'}</h3>
                  <p className="text-green-600 text-xs mt-1">↑ $2,340 this month</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <FaDollarSign className="text-yellow-600 text-2xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Average Rating</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.averageRating || 4.8}</h3>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar key={star} className="text-yellow-500 text-xs" />
                    ))}
                  </div>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FaStar className="text-purple-600 text-2xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/instructor/create-course"
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow-sm hover:shadow-md"
              >
                <FaPlus className="text-xl" />
                <span className="font-semibold text-sm">Create Course</span>
              </Link>

              <Link
                to="/instructor/courses"
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition shadow-sm hover:shadow-md"
              >
                <FaEdit className="text-xl" />
                <span className="font-semibold text-sm">Manage Courses</span>
              </Link>

              <button
                onClick={() => setClickCreateAssignment(true)}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition shadow-sm hover:shadow-md"
              >
                <MdAssignment className="text-xl" />
                <span className="font-semibold text-sm">Upload Assignment</span>
              </button>

              <button
              onClick={()=>setClickUserAssignment(true)}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition shadow-sm hover:shadow-md"
              >
                <FaCalendarAlt className="text-xl" />
                <span className="font-semibold text-sm">User Assignments</span>
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Courses and Students */}
            <div className="lg:col-span-2 space-y-6">
              {/* My Courses */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
                  <Link
                    to="/instructor/courses"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    View All →
                  </Link>
                </div>

                <div className="space-y-3">
                  {filtered && filtered.map((course, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FaBook className="text-white text-lg" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">{course.title}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-600 flex items-center gap-1">
                              <FaUsers className="text-xs" /> 0
                            </span>
                            <span className="text-xs text-gray-600 flex items-center gap-1">
                              <FaStar className="text-yellow-500 text-xs" /> 0
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${course.status === 'Published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                            }`}
                        >
                          {course.status}
                        </span>
                        <button className="p-2 hover:bg-gray-200 rounded-lg transition">
                          <FaEye className="text-gray-600 text-sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Students */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Students</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase">
                          Student
                        </th>
                        <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase">
                          Course
                        </th>
                        <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase">
                          Enrolled
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {students && students.map((student, i) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 text-sm">{student.studentName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-gray-600 text-sm">{student.courseName}</td>
                          <td className="py-3 px-2 text-gray-600 text-sm">{student.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Account Status */}
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-md p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Account Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Verification</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.verificationStatus === 'approved'
                      ? 'bg-green-500'
                      : user.verificationStatus === 'pending'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                      }`}>
                      {user.verificationStatus?.toUpperCase()}
                    </span>
                  </div>
                  {user.isApproved && (
                    <p className="text-xs text-blue-100">✓ Verified Instructor</p>
                  )}
                </div>
              </div>

              {/* Upcoming Schedule */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Schedule</h2>
                  <FaCalendarAlt className="text-blue-600" />
                </div>
                <div className="space-y-3">
                  {upcomingSchedule.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-600"
                    >
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <FaClock />
                        <span>{item.time}</span>
                        <span className="text-gray-400">•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                  View Full Schedule
                </button>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
                  <FaBell className="text-yellow-600" />
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <p className="text-sm text-gray-900 font-medium">New student enrolled</p>
                    <p className="text-xs text-gray-600 mt-1">5 minutes ago</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <p className="text-sm text-gray-900 font-medium">Course review received</p>
                    <p className="text-xs text-gray-600 mt-1">2 hours ago</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm text-gray-900 font-medium">Payment received</p>
                    <p className="text-xs text-gray-600 mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorPage;