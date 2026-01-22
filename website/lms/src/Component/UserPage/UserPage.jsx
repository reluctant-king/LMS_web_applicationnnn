import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { FaPen, FaUserCircle, FaCamera, FaEnvelope, FaCalendarAlt, FaAward} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { AllCourseDetail } from '../AllCourseContext/Context'
import AddStudent from '../AddStudentDetails/AddStudent'
import { 
  FaBook, FaCertificate, FaTrophy, FaClock, FaFire, 
  FaChartLine, FaBookmark, FaPlay, FaDownload, FaShare,
  FaStar, FaCheckCircle, FaArrowRight, FaFilter
} from 'react-icons/fa';
import { MdAssignment } from 'react-icons/md'
import UserAssignment from './UserAssignment'
import SubmittingAssignment from './SubmittingAssignment'
import SubmittedAssignments from './SubmittedAssignments'

const UserPage = () => {
    const [courseFilter, setCourseFilter] = useState('all');
    const { user } = useContext(AllCourseDetail)
    const [showForm, setShowForm] = useState(false)
    const [usercourse, setUserCourse] = useState([])
    const [assignment, setAssignment] = useState([])
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(false)
    const [clickAssignment, setClickAssignment] = useState(false)
     const [clicksubmittingAssignment, setclickSubmittingAssignment] = useState(false)
      const [clickSubmittedAssignment, setClickSubmittedAssignment] = useState(false)
    const [email, setEmail] = useState(null)
    const [course, setCourse] = useState([])
     const [completed, setCompleted] = useState([])
     const [editMode, setEditMode] = useState(false);
const [editStudent, setEditStudent] = useState(null);


    const studentEnrolledCourse = async () => {
        try {
            setLoading(true)
            let res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_payment_details`)
            let allCourse = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_courses`)
            let allCourseComplete = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_completers`)
            let allAssignment = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_assignments`)
            let allStudent = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/view_students`)
            console.log(allStudent)
            console.log(res)
            console.log(allCourse)
            console.log(allCourseComplete)
              console.log(allAssignment)
            setUserCourse(res.data.paymentDetails)
            setCourse(allCourse.data.courses)
            setCompleted(allCourseComplete.data.allCourseCompleters)
            setAssignment(allAssignment.data.assignment)
            setStudents(allStudent.data.students)

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)

        }
    }

    useEffect(() => {
        studentEnrolledCourse()
        if (user?.email) {
            setEmail(user.email);
        }
    }, [user])
    const userCourses = usercourse.filter((c) => c.userEmail === email)
    const totalCourse = userCourses.length
   

    const userCompletedWithcertificate = completed.filter((c)=>c.userEmail === user?.email && c.userId === user._id)


    console.log(userCompletedWithcertificate)

    const currentStudent = students.filter((s)=>s.accoutRegisterdEmail ===user?.email )
    console.log(currentStudent)

    const isRegistDstudent = currentStudent.some((s)=>s.isExist === true)
    console.log(isRegistDstudent)
  const stats = {
    totalHours: 127,
    coursesCompleted: 8,
    coursesEnrolled: 12,
    currentStreak: 15,
    certificates: 8,
    averageScore: 91
  };

  const activities = [
    { type: 'lesson', title: 'Completed "Advanced Hooks in React"', time: '2 hours ago', course: 'Advanced React' },
    { type: 'certificate', title: 'Earned Python Certificate', time: '1 week ago', course: 'Python for Data Science' },
    { type: 'quiz', title: 'Scored 95% in UI Principles Quiz', time: '2 days ago', course: 'UI/UX Design' },
    { type: 'enrollment', title: 'Enrolled in Machine Learning', time: '3 days ago', course: 'ML Fundamentals' }
  ];




    
    console.log(completed)
    console.log(assignment)
    return (
        <div className="px-4 sm:px-6 lg:px-20 py-10 bg-gray-50 min-h-screen">
            {showForm && <AddStudent 
             setShowForm = {setShowForm}
             emailll={email} 
             editMode = {editMode}
            editStudent = {editStudent}/>}
            {clickAssignment && <UserAssignment
             setClickAssignment = {setClickAssignment} 
             assignment={assignment}
             userCourses={userCourses}
             
             />}
            {clicksubmittingAssignment && <SubmittingAssignment
             setclickSubmittingAssignment={setclickSubmittingAssignment}
             assignment={assignment}
             userCourses={userCourses}
             />}
            {clickSubmittedAssignment && <SubmittedAssignments setClickSubmittedAssignment={setClickSubmittedAssignment}/>}
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
 
       
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
             
              <div className="relative group cursor-pointer">
              
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-500 animate-pulse"></div>
                
              
                <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-6xl font-bold text-white">
                         {`${user?.firstname} ${user?.lastname}`}
                      </span>
                    </div>
                  </div>
                  
                  {/* Camera Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <FaCamera className="text-white" size={32} />
                  </div>
                </div>

            
              </div>

              {/* Info Section */}
              <div className="flex-1 text-center lg:text-left space-y-6 w-full">
                {/* Name and Edit */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center lg:justify-start gap-3 flex-wrap">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                       {`${user?.firstname} ${user?.lastname}`}
                    </h1>
                    <button
                      onClick={() =>{
                        setShowForm(true)
                         setEditMode(true)
                          setEditStudent(currentStudent)
                      }}
                      className="group/btn p-2.5 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:shadow-md"
                      aria-label="Edit profile"
                    >
                      <FaPen className="text-blue-600 group-hover/btn:rotate-12 transition-transform" size={20} />
                    </button>
                  </div>
                  
                 
                  <div className="flex justify-center lg:justify-start">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-full shadow-lg">
                      <FaAward size={14} />
                     {user?.role}
                    </span>
                  </div>
                </div>

              
                <div className="space-y-3">
                  <div className="flex items-center justify-center lg:justify-start gap-3 text-gray-600 hover:text-blue-600 transition-colors group/email cursor-pointer">
                    <div className="p-2 bg-blue-50 rounded-lg group-hover/email:bg-blue-100 transition-colors">
                      <FaEnvelope size={18} className="text-blue-600" />
                    </div>
                    <span className="text-base">  {user?.email}</span>
                  </div>
                  
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-500">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <FaCalendarAlt size={16} className="text-purple-600" />
                    </div>
                    <span className="text-sm"> Member since Jan 2023</span>
                  </div>
                </div>

               
                <div className="pt-6">
                  {isRegistDstudent === true ? (null):(<button 
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group/btn"
                    onClick={() => setShowForm(true)}
                    // disabled={isRegistDstudent === true}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Add Student Details
                      <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  </button>)}
                  
                </div>
              </div>
            </div>
          </div>
        </div>

            

 <div className="space-y-8 px-4 sm:px-6 lg:px-20 py-10 bg-gray-50">
      
   
      <section className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <FaChartLine className="text-blue-600" />
          Learning Statistics
        </h2>
        
       <div className="flex justify-center">
  <div
    className="
      grid
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      gap-6
      place-items-center
      w-full
      max-w-6xl
    "
  >
   

    {/* Completed */}
    <div className="w-full max-w-xs bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 hover:shadow-lg transition-all text-center">
      <FaCheckCircle className="text-green-600 text-2xl mb-2 mx-auto" />
      <div className="text-3xl font-bold text-green-600">
        {stats.coursesCompleted}
      </div>
      <div className="text-sm text-gray-600 mt-1">
        Completed
      </div>
    </div>

    
    <div className="w-full max-w-xs bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 hover:shadow-lg transition-all text-center">
      <FaBook className="text-purple-600 text-2xl mb-2 mx-auto" />
      <div className="text-3xl font-bold text-purple-600">
        {totalCourse}
      </div>
      <div className="text-sm text-gray-600 mt-1">
        Enrolled
      </div>
    </div>

    
    <div className="w-full max-w-xs bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 hover:shadow-lg transition-all text-center">
      <FaCertificate className="text-yellow-600 text-2xl mb-2 mx-auto" />
      <div className="text-3xl font-bold text-yellow-600">
        {userCompletedWithcertificate.length}
      </div>
      <div className="text-sm text-gray-600 mt-1">
        Certificates
      </div>
    </div>

  
    
  </div>
</div>

      </section>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Assignments</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                     onClick={()=>setClickAssignment(true)}
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition shadow-sm hover:shadow-md"
                    >
                      <MdAssignment className="text-xl" />
                      <span className="font-semibold text-sm">Assignment</span>
                    </button>

                    <button
                     onClick={()=>setclickSubmittingAssignment(true)}
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition shadow-sm hover:shadow-md"
                    >
                      <MdAssignment className="text-xl" />
                      <span className="font-semibold text-sm">Upload assignment</span>
                    </button>

                      <button
                      onClick={()=>setClickSubmittedAssignment(true)}
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition shadow-sm hover:shadow-md"
                    >
                      <MdAssignment className="text-xl" />
                      <span className="font-semibold text-sm">Submitted assignment</span>
                    </button>
      
                    
                  </div>
                </div>

      {/* My Courses */}
      <section className="bg-white rounded-3xl shadow-lg p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaBook className="text-purple-600" />
            My Courses
          </h2>
          
         
        </div>

         <div  className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">

            { userCourses && userCourses.map((c, i)=>{
                return (
            <div key={i}
              
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
            >
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
               <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                    src={course.find((co)=>co._id === c.courseId)?.image?.[0]} 
                    alt={c.courseName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                </div>
                {/* {course.status === 'completed' && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <FaCheckCircle /> Completed
                  </div>
                )} */}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {c.courseName}
                </h3>
                {/* <p className="text-gray-600 text-sm mb-4">by {course.instructor}</p> */}
                
                <div className="space-y-2 mb-4">
                  {/* <div className="flex justify-between text-sm text-gray-600">
                    <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                    <span className="font-semibold text-blue-600">{course.progress}%</span>
                  </div> */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    {/* <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div> */}
                  </div>
                  {/* <p className="text-xs text-gray-500">Last accessed: {course.lastAccessed}</p> */}
                </div>

                {/* <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 group/btn">
                  <FaPlay className="group-hover/btn:translate-x-1 transition-transform" />
                  {course.status === 'completed' ? 'Review Course' : course.status === 'not-started' ? 'Start Learning' : 'Continue Learning'}
                </button> */}
              </div>
            </div>
                )
            })}
        
           
         
        </div>
      </section>

      {/* Certificates */}
      <section className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <FaCertificate className="text-yellow-600" />
          My Certificates
        </h2>

            {userCompletedWithcertificate && userCompletedWithcertificate.map((c, i)=>{
              return(
                <div key={i} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
         
            <div
             
              className="relative bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-yellow-200 group overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200/30 to-orange-300/30 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-200/30 to-pink-300/30 rounded-full blur-2xl"></div>
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <FaTrophy className="text-yellow-600 text-4xl" />
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    score%
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{c.coursename}</h3>
                {/* <p className="text-gray-600 text-sm mb-1">by {cert.instructor}</p> */}
                <p className="text-gray-500 text-xs mb-4">Completed: 10/101/2025</p>
                {/* <p className="text-gray-400 text-xs mb-6 font-mono">ID: {cert.certificateId}</p> */}

                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm">
                    <FaDownload /> Download
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all">
                    <FaShare />
                  </button>
                </div>
              </div>
            </div>
         
        </div>
              )
            })}

        
      </section>


    </div>

          
           
        </div>
    )
}

export default UserPage
































// import React, { useState } from 'react';
// import { FaCamera, FaEnvelope, FaCalendarAlt, FaPen, FaAward } from 'react-icons/fa';

// export default function UserProfileHeader() {
//   const [showForm, setShowForm] = useState(false);
  
//   // Sample user data
//   const user = {
//     firstname: 'Sarah',
//     lastname: 'Anderson',
//     email: 'sarah.anderson@example.com',
//     memberSince: 'January 2023'
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
//       {/* Main Profile Card */}
//       <div className="max-w-5xl mx-auto">
//         {/* Background Pattern */}
//         <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
//           {/* Decorative Background */}
//           <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
//           <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
//           <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-400/10 to-orange-600/10 rounded-full blur-3xl"></div>
          
//           {/* Content */}
//           <div className="relative p-8 md:p-12">
//             <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
//               {/* Profile Photo Section */}
//               <div className="relative group cursor-pointer">
//                 {/* Animated Ring */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-all duration-500 animate-pulse"></div>
                
//                 {/* Photo Container */}
//                 <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 group-hover:scale-105 transition-transform duration-300">
//                   <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
//                     <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
//                       <span className="text-6xl font-bold text-white">
//                         {user.firstname[0]}{user.lastname[0]}
//                       </span>
//                     </div>
//                   </div>
                  
//                   {/* Camera Overlay */}
//                   <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <FaCamera className="text-white" size={32} />
//                   </div>
//                 </div>

//                 {/* Status Badge */}
//                 <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
//               </div>

//               {/* Info Section */}
//               <div className="flex-1 text-center lg:text-left space-y-6 w-full">
//                 {/* Name and Edit */}
//                 <div className="space-y-2">
//                   <div className="flex items-center justify-center lg:justify-start gap-3 flex-wrap">
//                     <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
//                       {user.firstname} {user.lastname}
//                     </h1>
//                     <button
//                       onClick={() => {/* Add edit handler */}}
//                       className="group/btn p-2.5 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:shadow-md"
//                       aria-label="Edit profile"
//                     >
//                       <FaPen className="text-blue-600 group-hover/btn:rotate-12 transition-transform" size={20} />
//                     </button>
//                   </div>
                  
//                   {/* Role Badge */}
//                   <div className="flex justify-center lg:justify-start">
//                     <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-full shadow-lg">
//                       <FaAward size={14} />
//                       Premium Member
//                     </span>
//                   </div>
//                 </div>

//                 {/* Contact Info */}
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-center lg:justify-start gap-3 text-gray-600 hover:text-blue-600 transition-colors group/email cursor-pointer">
//                     <div className="p-2 bg-blue-50 rounded-lg group-hover/email:bg-blue-100 transition-colors">
//                       <FaEnvelope size={18} className="text-blue-600" />
//                     </div>
//                     <span className="text-base">{user.email}</span>
//                   </div>
                  
//                   <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-500">
//                     <div className="p-2 bg-purple-50 rounded-lg">
//                       <FaCalendarAlt size={16} className="text-purple-600" />
//                     </div>
//                     <span className="text-sm">Member since {user.memberSince}</span>
//                   </div>
//                 </div>

//                 {/* Action Button */}
//                 <div className="pt-6">
//                   <button 
//                     className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group/btn"
//                     onClick={() => setShowForm(true)}
//                   >
//                     <span className="relative z-10 flex items-center justify-center gap-2">
//                       Add Student Details
//                       <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                       </svg>
//                     </span>
//                     <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Form Modal (placeholder) */}
//         {showForm && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
//               <h3 className="text-2xl font-bold mb-4">Add Student Details</h3>
//               <p className="text-gray-600 mb-6">Form content goes here...</p>
//               <button 
//                 onClick={() => setShowForm(false)}
//                 className="w-full px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }