import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { AllCourseDetail } from "../AllCourseContext/Context";
import { toast, ToastContainer } from 'react-toastify'

const CheckoutPage = () => {

  const { courseDetail, user } = useContext(AllCourseDetail)
  console.log("courseDetail", courseDetail)
  console.log("user", user)

  const navigate = useNavigate();
  const [studentDetails, setStudentDetails] = useState([])
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    country: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [errors, setErrors] = useState({});

  const studeDetail = async () => {

    try {
      setLoading(true)
      let studentDetail = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/view_students`)
      console.log(studentDetail);
      setStudentDetails(studentDetail.data.students)
    } catch (error) {

    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    studeDetail()
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };
  console.log(formData);

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-600 text-lg font-medium">Loading user details...</p>
      </div>
    );
  }

  const studentName = studentDetails.find((n) => n.accoutRegisterdEmail === user.email)?.name
  const studentId = studentDetails.find((n) => n.accoutRegisterdEmail === user.email)?.studentId




  //console.log("student:", student);
  console.log("studentName:", studentName);
  console.log("studentId:", studentId);


  console.log("name", studentName);
  console.log("id", studentId);
  const handlePay = async () => {
    if (!courseDetail) return toast.warning("Course not loaded yet");



    if (courseDetail.isFree === false) {
      const { data: keyData } = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_key`)
      const { key } = keyData
      console.log("key:", key);

      const orderRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/create_payment`, {
        amount: courseDetail.price,

      })
      console.log(orderRes);
      const orderId = orderRes.data.order.id;

      console.log("key:", key);
      console.log("order:", orderRes.data);

      const options = {
        key,
        amount: Number(courseDetail.price) * 100,
        currency: "INR",
        name: "LMS_LERNING",
        description: "course enrollment",
        order_id: orderId,
        prefill: {
          name: user.firstname,
          email: user.email,
          contact: user.phone
        },
        theme: { color: "#8b5cf6" },

        handler: async function (response) {
          const paymentInfo = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            studentName: studentName,
            studentId: studentId,
            userId: user._id,
            courseId: courseDetail._id,
            courseName: courseDetail.title,
            username: `${user.firstname} ${user.lastname}`,
            userEmail: user.email,
            hasMonthlyPayment: courseDetail.hasMonthlyPayment,
            monthlyAmount: courseDetail.monthlyAmount,
            amount: courseDetail.price,
            date: new Date().toLocaleDateString("en-US"),
            status: "success",
            billingDetails: {
              firstName: user.firstname,
              lastName: user.lastname,
              email: user.email,
              phone: user.phone,
              country: formData.country,
              address: formData.address,
              apartment: formData.apartment,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode
            },
          }
          try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/save_db`, paymentInfo)
            console.log(res)
            window.location.href = `/payment_success?reference=${response.razorpay_payment_id}`;
            console.log(res);

          } catch (error) {
            console.error("Free enrollment error:", error);
            toast.warning("Something went wrong while enrolling in the free course.");
          }


        }

      }
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else if (courseDetail.isFree === true) {
      const paymentInfo = {
        razorpay_order_id: "FREE_COURSE_" + Date.now(),
        razorpay_payment_id: "FREE_" + Math.random().toString(36).substr(2, 9),
        studentName: studentName,
        studentId: studentId,
        userId: user._id,
        courseId: courseDetail._id,
        courseName: courseDetail.title,
        username: `${user.firstname} ${user.lastname}`,
        userEmail: user.email,
        hasMonthlyPayment: courseDetail.hasMonthlyPayment,
        monthlyAmount: courseDetail.monthlyAmount,
        amount: 0,
        date: new Date().toLocaleDateString("en-US"),
        status: "success",
        billingDetails: {
          firstName: user.firstname,
          lastName: user.lastname,
          email: user.email,
          phone: user.phone,
          country: formData.country,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
      }
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/save_db`, paymentInfo)
        console.log(res)
        window.location.href = `/payment_success?reference=${paymentInfo.razorpay_payment_id}`;
        console.log(res);

      } catch (error) {
        console.error("Free enrollment error:", error);
        toast.warning("Something went wrong while enrolling in the free course.");
      }
    }
  };

  const handleBack = () => navigate(-1);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading course details...</p>
        </div>
      </div>
    );
  }

  const coursePrice = courseDetail?.price || 0;
  const tax = Math.round(coursePrice * 0.18);
  const total = coursePrice + tax;
  console.log(formData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <ToastContainer/>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Secure Checkout
          </h1>
          <p className="text-gray-600 text-lg">
            Complete your purchase for <span className="font-semibold text-purple-600">{courseDetail?.title}</span>
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-600 font-medium">SSL Secured Payment</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Section - Billing Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              {/* Contact Information */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                    <p className="text-sm text-gray-500">We'll use this to send you updates</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={user?.email || ""}
                      onChange={handleChange}
                      className={`w-full border-2 ${errors.email ? 'border-red-300' : 'border-gray-200'} rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={user?.phone}
                      className={`w-full border-2 ${errors.phone ? 'border-red-300' : 'border-gray-200'} rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition`}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Billing Details */}
              <div>
                <div className="flex items-center gap-3 mb-6 pt-6 border-t border-gray-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Billing Details</h2>
                    <p className="text-sm text-gray-500">Enter your billing address</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First name <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="firstName"
                        value={user?.firstname}
                        onChange={handleChange}
                        className={`w-full border-2 ${errors.firstName ? 'border-red-300' : 'border-gray-200'} rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition`}
                        placeholder="John"
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last name <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="lastName"
                        value={user?.lastname}
                        onChange={handleChange}
                        className={`w-full border-2 ${errors.lastName ? 'border-red-300' : 'border-gray-200'} rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition`}
                        placeholder="Doe"
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Country / Region <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="country"
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-white outline-none transition"
                    >
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Street address <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="address"
                      placeholder="House number and street name"
                      onChange={handleChange}
                      className={`w-full border-2 ${errors.address ? 'border-red-300' : 'border-gray-200'} rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition`}
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Apartment, suite, etc. (optional)
                    </label>
                    <input
                      name="apartment"
                      placeholder="Apartment, suite, unit, etc."
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Town / City <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="city"
                        onChange={handleChange}
                        className={`w-full border-2 ${errors.city ? 'border-red-300' : 'border-gray-200'} rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition`}
                        placeholder="Mumbai"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="state"
                        onChange={handleChange}
                        className={`w-full border-2 ${errors.state ? 'border-red-300' : 'border-gray-200'} rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-white outline-none transition`}
                      >
                        <option value="">Select...</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Others">Others</option>
                      </select>
                      {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ZIP Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="zipCode"
                        onChange={handleChange}
                        className={`w-full border-2 ${errors.zipCode ? 'border-red-300' : 'border-gray-200'} rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition`}
                        placeholder="400001"
                      />
                      {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
                  <p className="text-sm text-gray-500">Review your purchase</p>
                </div>
              </div>

              {/* Course Card */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-5 mb-6 border-2 border-purple-100 shadow-sm">
                <div className="flex items-start mb-4">
                  <img
                    src={courseDetail?.thumbnail || "https://via.placeholder.com/80"}
                    alt={courseDetail?.title}
                    className="w-20 h-20 rounded-xl mr-4 object-cover shadow-md"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 mb-1 leading-tight">{courseDetail?.title}</p>
                    <p className="text-sm text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {courseDetail?.category || "Course"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Course Price</span>
                  <span className="font-semibold">₹{courseDetail.price}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">GST (18%)</span>
                  <span className="font-semibold">₹{tax}</span>
                </div>
                <div className="border-t-2 border-gray-200 my-3"></div>
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-purple-600">₹{courseDetail.price}</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Secure Payment</p>
                    <p className="text-xs text-blue-700">Your payment information is encrypted and secure</p>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePay}
                className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:via-purple-800 hover:to-blue-700 transform hover:scale-105 active:scale-95 transition shadow-lg hover:shadow-2xl"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  {courseDetail.price ? `Complete Payment ₹${courseDetail.price}` : "Start Learning"}
                </span>
              </button>

              <button
                onClick={handleBack}
                className="w-full mt-4 text-gray-600 hover:text-gray-900 font-semibold py-3 transition flex items-center justify-center gap-2 hover:bg-gray-50 rounded-xl"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Course
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>SSL Secure</span>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;