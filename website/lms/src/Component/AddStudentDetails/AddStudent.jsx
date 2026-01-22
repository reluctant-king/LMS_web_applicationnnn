import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AllCourseDetail } from "../AllCourseContext/Context";
import { toast, ToastContainer } from "react-toastify";
import { FaTimes } from "react-icons/fa";

const AddStudent = ({ setShowForm, emailll, editMode, editStudent }) => {

    const { user } = useContext(AllCourseDetail)
    const navigate = useNavigate()
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])
    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        phone: "",
        age: "",
        gender: "",
        profileImage: null,
        courseEnrolled: "",
        address: "",
        batch: "",
    });

    const preset_key = "arsmfwi7";
    const cloud_name = "dnqlt6cit";

    const getAllUsers = async () => {
        try {
            setLoading(true)
            let res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_user`)
            console.log(res)
            setUsers(res.data.users)


        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)

        }

    }

    useEffect(() => {

        getAllUsers()

        axios
            .get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_batches`)
            .then((res) => setBatches(res.data.data || []))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        if (editMode && editStudent) {
            setInputs({
                name: editStudent.name || "",
                email: editStudent.email || "",
                phone: editStudent.phone || "",
                age: editStudent.age || "",
                gender: editStudent.gender || "",
                profileImage: null,
                courseEnrolled: editStudent.courseEnrolled || "",
                address: editStudent.address || "",
                batch: editStudent.batch || "",
            })
        }
    }, [editMode, editStudent])


    const handleChange = (e) => {
        const { name, files, value } = e.target;
        if (files && files.length > 0) setInputs({ ...inputs, [name]: files[0] });
        else setInputs({ ...inputs, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let img_url = null;
            if (inputs.profileImage) {
                const formData = new FormData();
                formData.append("file", inputs.profileImage);
                formData.append("upload_preset", preset_key);
                const res = await axios.post(
                    `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
                    formData
                );
                img_url = res.data.secure_url;
            }

            const payload = {
                accoutRegisterdEmail: emailll,
                name: inputs.name,
                email: inputs.email,
                phone: inputs.phone,
                age: inputs.age,
                gender: inputs.gender,
                profileImage: img_url || null,
                courseEnrolled: inputs.courseEnrolled,
                address: inputs.address,
                batch: inputs.batch || null,
            }
            let res

            if(editMode){
                 res = await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/get_student${editStudent._id}`, payload)
            } else {
                res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/add_student`, payload)
            console.log(res)
            if (res.data.success) {
                toast.success(res.data.messsage)
                setShowForm(false)
                await new Promise((back) => setTimeout(back, 2000))
                navigate("/user_page")
            }
            }
          
        } catch (error) {
            console.error(error);
            alert("Error adding student");
        }
    };
    console.log(inputs);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 
                        p-0 sm:p-4">
            <ToastContainer />
            <div className="relative bg-white w-full h-full sm:h-auto sm:rounded-3xl shadow-2xl 
                            sm:max-w-2xl sm:max-h-[90vh] overflow-y-auto">
                
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 
                                text-white p-4 sm:p-6 sm:rounded-t-3xl z-10 shadow-lg">
                    <div className="flex justify-between items-start sm:items-center gap-2">
                        <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1">
                            <div className="p-1.5 sm:p-2 bg-white bg-opacity-20 rounded-full flex-shrink-0 mt-0.5 sm:mt-0">
                                <svg
                                    className="w-4 h-4 sm:w-6 sm:h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-lg sm:text-2xl font-bold truncate">
                                    {editMode ? "Update Student" : "Add Student"}
                                </h2>
                                <p className="text-blue-100 text-xs sm:text-sm">
                                    Enter student details below
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowForm(false)}
                            className="text-white hover:bg-white hover:bg-opacity-20 
                                       p-2 rounded-lg transition-colors flex-shrink-0 active:scale-95"
                        >
                            <FaTimes size={18} className="sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-3 sm:p-6 space-y-4 sm:space-y-6">
                    
                    {/* Personal Info Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl 
                                    p-4 sm:p-6 shadow-sm space-y-3 sm:space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 
                                       flex items-center gap-2">
                            <span className="w-1 h-4 sm:h-5 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
                            Personal Information
                        </h3>

                        <div className="grid gap-3 sm:gap-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter full name"
                                    value={inputs.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base
                                               bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl 
                                               focus:ring-4 focus:ring-blue-200 focus:border-blue-500 
                                               outline-none hover:border-blue-400 transition"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="student@example.com"
                                        value={inputs.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base
                                                   bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl 
                                                   focus:ring-4 focus:ring-blue-200 focus:border-blue-500 
                                                   outline-none hover:border-blue-400 transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        placeholder="Phone number"
                                        value={inputs.phone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base
                                                   bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl 
                                                   focus:ring-4 focus:ring-blue-200 focus:border-blue-500 
                                                   outline-none hover:border-blue-400 transition"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info Section */}
                    <div className="bg-gradient-to-r from-indigo-50 to-pink-50 rounded-xl sm:rounded-2xl 
                                    p-4 sm:p-6 shadow-sm space-y-3 sm:space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 
                                       flex items-center gap-2">
                            <span className="w-1 h-4 sm:h-5 bg-gradient-to-b from-indigo-600 to-pink-600 rounded-full"></span>
                            Additional Details
                        </h3>

                        <div className="grid gap-3 sm:gap-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        name="age"
                                        placeholder="Age"
                                        value={inputs.age}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base
                                                   bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl 
                                                   focus:ring-4 focus:ring-purple-200 focus:border-purple-500 
                                                   outline-none hover:border-purple-400 transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                        Gender
                                    </label>
                                    <select
                                        name="gender"
                                        value={inputs.gender}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base
                                                   bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl 
                                                   focus:ring-4 focus:ring-purple-200 focus:border-purple-500 
                                                   outline-none hover:border-purple-400 transition"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                    Profile Image
                                </label>
                                <input
                                    type="file"
                                    name="profileImage"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm
                                               bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl 
                                               focus:ring-4 focus:ring-blue-200 focus:border-blue-500 
                                               outline-none hover:border-blue-400 transition 
                                               file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 
                                               file:px-3 sm:file:px-4 file:rounded-lg file:border-0 
                                               file:text-xs sm:file:text-sm file:font-semibold 
                                               file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                        Course Enrolled
                                    </label>
                                    <input
                                        type="text"
                                        name="courseEnrolled"
                                        placeholder="Course name"
                                        value={inputs.courseEnrolled}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base
                                                   bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl 
                                                   focus:ring-4 focus:ring-purple-200 focus:border-purple-500 
                                                   outline-none hover:border-purple-400 transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                        Batch
                                    </label>
                                    <select
                                        name="batch"
                                        value={inputs.batch}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base
                                                   bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl 
                                                   focus:ring-4 focus:ring-purple-200 focus:border-purple-500 
                                                   outline-none hover:border-purple-400 transition"
                                    >
                                        <option value="">Select Batch</option>
                                        {batches.map((b) => (
                                            <option key={b._id} value={b._id}>
                                                {b.batchName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                    Address
                                </label>
                                <textarea
                                    name="address"
                                    placeholder="Enter full address"
                                    value={inputs.address}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base
                                               bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl 
                                               focus:ring-4 focus:ring-purple-200 focus:border-purple-500 
                                               outline-none hover:border-purple-400 transition resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 justify-end pt-2 
                                    sticky bottom-0 bg-white pb-2 sm:pb-0 sm:static">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 
                                       text-sm sm:text-base bg-slate-200 text-slate-700 rounded-lg sm:rounded-xl 
                                       hover:bg-slate-300 active:bg-slate-400 transition-colors font-medium
                                       active:scale-95"
                        >
                            <FaTimes /> Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base
                                       bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 
                                       text-white rounded-lg sm:rounded-xl font-bold transition-all 
                                       shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 
                                       flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {editMode ? "Update Student" : "Add Student"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddStudent