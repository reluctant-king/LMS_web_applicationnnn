import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaSave, FaTimes } from 'react-icons/fa'
import { toast, ToastContainer } from 'react-toastify'

const AddStudentFee = ({ setShowForm }) => {
    let [students, setStudents] = useState([])
    let [courses, setCourses] = useState([])
    let [users, setUsers] = useState([])
    let [loading, setLoading] = useState(false)
    let paymentModes = ["cash", "upi", "card", "netbank"]
    const [input, setInput] = useState({
        studentName: "",
        courseName: "",
        totalFee: 0,
        amountPaid: "",
        modeOfPayment: "",
        paymentDate: "",
        remarks: "",
        country: "",
        Appartment: "",
        City: "",
        statue: "",
        zipcode: "",
        address: ""
    })

    const getAllData = async () => {
        setLoading(true)
        try {
            let getallStudent = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/view_students`)
            let getallCourse = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_courses`, {
                withCredentials: true
            })
            let getAllUsers = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_user`)

            console.log(getallStudent);
            setStudents(getallStudent.data.students)
            console.log(students)
            console.log(getallCourse)
            setCourses(getallCourse.data.courses)
            console.log(getAllUsers)
            setUsers(getAllUsers.data.users)
            console.log(users);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllData()
    }, [])


    const handleInputChange = (e) => {
        const { name, value } = e.target

        if (name === "courseName") {
            const selectedCourse = courses.find((c) => c.title === value)
            const coursePrice = selectedCourse && typeof selectedCourse.price === "number" ? selectedCourse.price : 0;
            setInput({ ...input, [name]: value, totalFee: coursePrice })
        } else {
            setInput({
                ...input,
                [name]: value,
              
            });
        }
    }


    const studentId = students.find((s) => s.name === input.studentName)?.studentId
    const studentEmail = students.find((s) => s.name === input.studentName)?.accoutRegisterdEmail
    console.log(studentEmail)
    const userId = users.find((u) => u.email === studentEmail)?._id
    const firstName = users.find((u) => u.email === studentEmail)?.firstname
    const lastname = users.find((u) => u.email === studentEmail)?.lastname
    const phone = users.find((u) => u.email === studentEmail)?.phone
    console.log(userId);
    console.log(firstName)
    console.log(lastname)
    console.log(phone)


    const handleSubmit = async (e) => {
        e.preventDefault(e)
        setLoading(true)
        try {
            let payload = {
                razorpay_order_id: null,
                razorpay_payment_id: null,
                studentName: input.studentName,
                studentId: studentId,
                userId: userId,
                courseId: courses.find((c) => c.title === input.courseName)?._id,
                courseName: input.courseName,
                username: students.find((s) => s.name === input.studentName)?.name,
                userEmail: students.find((s) => s.name === input.studentName)?.accoutRegisterdEmail,
                hasMonthlyPayment: input.amountPaid ? true : false,
                monthlyAmount: input.amountPaid,
                amount: input.totalFee,
                date: new Date().toLocaleDateString("en-US"),
                status: "success",
                paymentMethod: input.modeOfPayment,
                billingDetails: {
                    firstName: firstName,
                    lastName: lastname,
                    email: students.find((s) => s.name === input.studentName)?.accoutRegisterdEmail,
                    phone: phone,
                    country: input.country,
                    address: input.address,
                    apartment: input.Appartment,
                    city: input.City,
                    state: input.statue,
                    zipCode: input.zipcode
                }
            }




            const [feeres, paymentRes] = await Promise.all([
                axios.post(`${import.meta.env.VITE_API_URL}/api/v1/add_student_fee_structore`, payload),
                axios.post(`${import.meta.env.VITE_API_URL}/api/v1/save_db`, payload)
            ])
            console.log(feeres, paymentRes)
            if (feeres.data.success && paymentRes.data.success) {
                toast.success("Successfully purchases course")
                setShowForm(false)
            }
        } catch (error) {
            console.log(error.message)
        } finally {
            setLoading(false)
        }
    }

    console.log(input);

    return (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
            <ToastContainer />
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-[999] relative">
                <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">
                            Add New Payment
                        </h2>
                        <button
                            onClick={() => setShowForm(false)}
                            className="text-white hover:bg-green-800 p-2 rounded-lg transition-colors"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Student Name */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Student Name *
                            </label>
                            <select
                                name="studentName"
                                // value={formData.studentName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Select Student</option>
                                {students && students.map((s, i) => {
                                    return (
                                        <option key={i}>{s.name}</option>
                                    )
                                })}
                            </select>
                        </div>

                        {/* Course (Auto-fetched) */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Course*
                            </label>
                            <select
                                name="courseName"
                                // value={formData.studentName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Select course</option>
                                {courses && courses.map((c, i) => {
                                    return (
                                        <option key={i}>{c.title}</option>
                                    )
                                })}
                            </select>
                        </div>

                        {/* Batch */}
                        {/* <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Batch
                            </label>
                            <select
                                name="batch"
                                // value={formData.batch}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Select Batch (Optional)</option>
                                {batches && batches.map((b, i) => {
                                    return (
                                        <option key={i}>{b.batchName}</option>
                                    )
                                })}
                            </select>
                        </div> */}

                        {/* Total Fee (Auto-fetched) */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Total Fee
                            </label>
                            <input
                                type="text"
                                name="totalFee"
                                value={`₹${input.totalFee.toLocaleString()}`}
                                readOnly
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 font-bold"
                            />
                        </div>

                        {/* Amount Paid */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Amount Paid *
                            </label>
                            <input
                                type="number"
                                name="amountPaid"
                                // value={formData.amountPaid}
                                onChange={handleInputChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter amount paid"
                            />
                        </div>

                        {/* Balance (Auto-calculated) */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Balance
                            </label>
                            <input
                                type="text"
                                // value={`₹${calculateBalance().toLocaleString()}`}
                                readOnly
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-yellow-50 text-slate-800 font-bold"
                            />
                        </div>

                        {/* Mode of Payment */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Mode of Payment *
                            </label>
                            <select
                                name="modeOfPayment"
                                // value={formData.modeOfPayment}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option>Select payment mode</option>

                                {paymentModes.map(mode => (
                                    <option key={mode} value={mode}>
                                        {mode}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Payment Date */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Payment Date *
                            </label>
                            <input
                                type="date"
                                name="paymentDate"
                                // value={formData.paymentDate}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Country *
                            </label>
                            <input
                                type="text"
                                name="country"
                                // value={formData.amountPaid}
                                onChange={handleInputChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter amount paid"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Address *
                            </label>
                            <input
                                type="text"
                                name="address"
                                // value={formData.amountPaid}
                                onChange={handleInputChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter amount paid"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Appartment *
                            </label>
                            <input
                                type="text"
                                name="Appartment"
                                // value={formData.amountPaid}
                                onChange={handleInputChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter amount paid"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                City *
                            </label>
                            <input
                                type="text"
                                name="City"
                                // value={formData.amountPaid}
                                onChange={handleInputChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter amount paid"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                State *
                            </label>
                            <input
                                type="text"
                                name="statue"
                                // value={formData.amountPaid}
                                onChange={handleInputChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter amount paid"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Zip code *
                            </label>
                            <input
                                type="text"
                                name="zipcode"
                                // value={formData.amountPaid}
                                onChange={handleInputChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter amount paid"
                            />
                        </div>
                        {/* Remarks */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Remarks / Note
                            </label>
                            <textarea
                                name="remarks"
                                // value={formData.remarks}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Optional note (e.g., 'Paid in 2 parts')"
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-3 justify-end  mt-6">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                        >
                            <FaTimes /> Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-[30%] flex items-center justify-center bg-green-500  text-white font-semibold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
                        >
                            {loading && (
                                <div className="h-5 mr-2 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {loading ? "creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddStudentFee