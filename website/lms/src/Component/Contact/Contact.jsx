import React, { useState } from "react";
import { MdEmail } from "react-icons/md";
import axios from "axios";

const Contact = () => {
  const [inputs, setInputs] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const getInput = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user_enquiries`,
        inputs
      );
      console.log(res.data);

      setSuccess("We will Get In touch with you soon!");

      setInputs({ name: "", email: "", message: "" });

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error(error);
      setSuccess(
        error.response?.data?.message || "Something went wrong! Try again."
      );
      setTimeout(() => setSuccess(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col lg:flex-row items-center justify-center 
                    bg-[#f2f0fd] min-h-screen overflow-hidden">

      {/* Left Content */}
      <div className="relative z-10 w-full lg:w-[55%] bg-[#f2f0fd] flex flex-col justify-center 
                      px-4 sm:px-6 md:px-10 py-8 sm:py-12 md:py-16 
                      text-center lg:text-left">
        <h4 className="text-xs sm:text-sm font-semibold text-[#7a6fee] mb-1.5 sm:mb-2 
                       uppercase tracking-wider">
          Contact Us
        </h4>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#232129] 
                       leading-snug mb-3 sm:mb-4 px-2 sm:px-0">
          Feel Free To Contact Us Anytime
        </h2>
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 
                      max-w-lg mx-auto lg:mx-0 px-2 sm:px-0">
          Thank you for choosing our templates. We provide you best CSS
          templates absolutely free of charge.
        </p>
      </div>

      {/* Right Form Section */}
      <div
        className="
          relative w-full lg:w-[45%]
          min-h-[420px] sm:min-h-[480px] md:min-h-[520px] lg:h-[90vh]
          bg-gradient-to-tr from-[#8168e5] to-[#a38bf3]
          flex items-center justify-center
          overflow-hidden
          rounded-t-[80px] sm:rounded-t-[100px] md:rounded-t-[120px] 
          lg:rounded-l-[200px] lg:rounded-t-none
          shadow-2xl
          px-3 sm:px-4 md:px-0
          py-8 sm:py-10 lg:py-0
        "
      >
        {/* Success message */}
        {success && (
          <div className="absolute top-3 sm:top-4 md:top-5 left-1/2 -translate-x-1/2 
                          bg-white text-purple-600 font-semibold 
                          px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 
                          rounded-xl sm:rounded-2xl shadow-lg z-20 
                          text-xs sm:text-sm max-w-[90%] text-center">
            {success}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="relative z-10 w-full max-w-sm sm:max-w-md 
                     flex flex-col space-y-3 sm:space-y-4 md:space-y-5 
                     px-4 sm:px-6 md:px-8"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name..."
            value={inputs.name}
            onChange={getInput}
            className="w-full bg-[#9c89f8] bg-opacity-80 text-white placeholder-white 
                       rounded-xl sm:rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 
                       outline-none focus:bg-[#8a78ef] 
                       transition-all text-xs sm:text-sm"
            required
          />

          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Your E-mail..."
              value={inputs.email}
              onChange={getInput}
              className="w-full bg-[#9c89f8] bg-opacity-80 text-white placeholder-white 
                         rounded-xl sm:rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 pr-10 
                         outline-none focus:bg-[#8a78ef] 
                         transition-all text-xs sm:text-sm"
              required
            />
            <MdEmail
              size={16}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 
                         text-white opacity-90 sm:w-[18px] sm:h-[18px]"
            />
          </div>

          <textarea
            name="message"
            placeholder="Your Message"
            rows="3"
            value={inputs.message}
            onChange={getInput}
            className="w-full bg-[#9c89f8] bg-opacity-80 text-white placeholder-white 
                       rounded-xl sm:rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 
                       outline-none focus:bg-[#8a78ef] 
                       transition-all text-xs sm:text-sm resize-none
                       min-h-[100px] sm:min-h-[120px]"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`bg-white text-[#7a6fee] font-semibold 
                        rounded-xl sm:rounded-2xl py-2.5 sm:py-3 
                        text-xs sm:text-sm shadow-sm transition-all
                        active:scale-[0.98]
                        ${loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#edeafc] active:bg-[#e0dbf8]"
                }`}
          >
            {loading ? "Sending..." : "Send Message Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;