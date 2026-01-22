import React, { useEffect, useState } from 'react'
import {
    MdClose,
    MdSave,
    MdBusiness,
    MdLocationOn,
    MdEmail,
    MdPhone,
    MdVerifiedUser,
    MdStars,
    MdCalendarToday,
    MdSchool,
    MdPeople,
    MdTrendingUp,
    MdApartment,
    MdLanguage,
    MdPerson
} from "react-icons/md";
import axios from 'axios'





const EditProfile = ({ setShowEdit, id }) => {
    const [input, setInput] = useState({
        institutionName: "",
        address: "",
        adminFullName: "",
        websiteUrl: "",
        image: null,
        adminEmail: "",
        phone: "",
        gstin: "",
        accreditation: "",
        founded: "founded",
        courses: "",
        students: "",
        placement: "",
        facilities: "",
    })

    const handleChange = () => {

    }

    const getInstitute = async () => {
        try {
            let res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_institute/${id}`)
            console.log(res)
            setInput(res.data.institute)

        } catch (error) {

        }
    }

    useEffect(() => {
        getInstitute()
    }, [id])

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn"
          
        >
            <div
                className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-slideUp"

            >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-6 py-5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
                            <MdBusiness className="text-white text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                            <p className="text-white/80 text-sm">Update your institution information</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowEdit(false)}
                        className="text-white/80 hover:text-white hover:bg-white/20 transition-all rounded-lg p-2"
                    >
                        <MdClose size={24} />
                    </button>
                </div>

                {/* Scrollable Form Content */}
                <div className="overflow-y-auto px-6 py-6 flex-1 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Institution Name */}
                        <div className="group">
                            <label className="block text-gray-700 font-semibold mb-2 text-xs uppercase tracking-wider">
                                Institution Name
                            </label>
                            <div className="relative">
                                <MdBusiness className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    name="institutionName"
                                    value={input.institutionName}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
                                    placeholder="Enter institution name"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="group">
                            <label className="block text-gray-700 font-semibold mb-2 text-xs uppercase tracking-wider">
                                Address
                            </label>
                            <div className="relative">
                                <MdLocationOn className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    name="address"
                                    // value={formData.address}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
                                    placeholder="Enter address"
                                />
                            </div>
                        </div>



                        <div className="group">
                            <label className="block text-gray-700 font-semibold mb-2 text-xs uppercase tracking-wider">
                                Admin Full Name
                            </label>
                            <div className="relative">
                                <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    name="adminFullName"
                                    onChange={handleChange}

                                    className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
                                    placeholder="Enter admin full name"
                                />
                            </div>
                        </div>

                        {/* Website URL */}
                        <div className="group">
                            <label className="block text-gray-700 font-semibold mb-2 text-xs uppercase tracking-wider">
                                Website URL
                            </label>
                            <div className="relative">
                                <MdLanguage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    name="websiteUrl"
                                    value={input.websiteUrl}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
                                    placeholder="https://www.example.com"
                                />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="md:col-span-2 group">
                            <label className="block text-gray-700 font-semibold mb-2 text-xs uppercase tracking-wider">
                                Institution Image / Logo
                            </label>
                            <div className="flex items-center gap-3">
                                <label className="cursor-pointer bg-indigo-50 border border-indigo-300 text-indigo-600 px-4 py-2.5 rounded-lg hover:bg-indigo-100 transition-all text-sm font-medium">
                                    <input type="file" accept="image/*" className="hidden" name='image' onChange={handleChange} />
                                    Choose Image
                                </label>
                                <span className="text-gray-500 text-sm">No file chosen</span>
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-gray-700 font-semibold mb-2 text-xs uppercase tracking-wider">
                                Email
                            </label>
                            <div className="relative">
                                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="email"
                                    name="adminEmail"
                                    value={input.adminEmail}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
                                    placeholder="institution@email.com"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="group">
                            <label className="block text-gray-700 font-semibold mb-2 text-xs uppercase tracking-wider">
                                Phone
                            </label>
                            <div className="relative">
                                <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    name="phone"
                                    // value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>
                        </div>

                        {/* GSTIN */}
                        <div className="group">
                            <label className="block text-gray-700 font-semibold mb-2 text-xs uppercase tracking-wider">
                                GSTIN
                            </label>
                            <div className="relative">
                                <MdVerifiedUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    name="gstin"
                                    // value={formData.gstin}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
                                    placeholder="Enter GSTIN"
                                />
                            </div>
                        </div>

                        {/* Accreditation */}
                        <div className="group">
                            <label className="block text-gray-700 font-semibold mb-2 text-xs uppercase tracking-wider">
                                Accreditation
                            </label>
                            <div className="relative">
                                <MdStars className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    name="accreditation"
                                    // value={formData.accreditation}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
                                    placeholder="NAAC, NBA, etc."
                                />
                            </div>
                        </div>

                        {/* Founded */}
                        <div className="group">
                            <label className="block text-gray-700 font-semibold mb-2 text-xs uppercase tracking-wider">
                                Founded
                            </label>
                            <div className="relative">
                                <MdCalendarToday className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    name="founded"
                                    // value={formData.founded}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
                                    placeholder="YYYY"
                                />
                            </div>
                        </div>

                        {/* Courses */}
                        <div className="group">
                            <label className="block text-gray-700 font-semibold mb-2 text-xs uppercase tracking-wider">
                                Courses
                            </label>
                            <div className="relative">
                                <MdSchool className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    name="courses"
                                    // value={formData.courses}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
                                    placeholder="B.Tech, MBA, MCA"
                                />
                            </div>
                        </div>

                        {/* Students */}
                        <div className="group">
                            <label className="block text-gray-700 font-semibold mb-2 text-xs uppercase tracking-wider">
                                Students
                            </label>
                            <div className="relative">
                                <MdPeople className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    name="students"
                                    // value={formData.students}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
                                    placeholder="Total number of students"
                                />
                            </div>
                        </div>

                        {/* Placement */}
                        <div className="group">
                            <label className="block text-gray-700 font-semibold mb-2 text-xs uppercase tracking-wider">
                                Placement Rate
                            </label>
                            <div className="relative">
                                <MdTrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    name="placement"
                                    // value={formData.placement}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
                                    placeholder="Placement percentage"
                                />
                            </div>
                        </div>

                        {/* Facilities - Full Width */}
                        <div className="md:col-span-2 group">
                            <label className="block text-gray-700 font-semibold mb-2 text-xs uppercase tracking-wider">
                                Facilities
                            </label>
                            <div className="relative">
                                <MdApartment className="absolute left-3 top-3 text-gray-400 text-lg group-focus-within:text-indigo-500 transition-colors" />
                                <textarea
                                    name="facilities"
                                    // value={formData.facilities}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none text-sm"
                                    placeholder="Library, laboratories, hostel, sports complex, cafeteria, etc."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="bg-white px-6 py-4 flex justify-end items-center border-t border-gray-200 gap-3">
                    <button
                        onClick={() => setShowEdit(false)}
                        className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        // onClick={handleSave}
                        // disabled={isSaving}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MdSave size={18} />
                        {/* {isSaving ? "Saving..." : "Save Changes"} */}"Save Changes"
                    </button>
                </div>
            </div>

        </div>
    )
}

export default EditProfile