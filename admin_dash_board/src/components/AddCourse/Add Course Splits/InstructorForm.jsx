import React, { useEffect, useState } from "react";
import axios from "axios";

const InstructorForm = ({ data, updateData }) => {
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/view_instructor`);
        setInstructors(res.data.data); 
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };
    fetchInstructors();
  }, []);

  const handleSelectInstructor = (e) => {
    const selectedId = e.target.value;
    const selectedInstructor = instructors.find((inst) => inst._id === selectedId);
    if (selectedInstructor) {
      updateData("instructorDetails", selectedInstructor);
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
        C. Instructor Details
      </h3>

      <div className="space-y-4">
        <select
          value={data.instructorDetails?._id || ""}
          onChange={handleSelectInstructor}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Instructor</option>
          {instructors.map((inst) => (
            <option key={inst._id} value={inst._id}>
              {inst.name}
            </option>
          ))}
        </select>

        {data.instructorDetails?.name && (
          <div className="p-4 border border-gray-300 rounded-2xl bg-white shadow-sm space-y-2">
            <div className="flex items-center gap-4">
              {data.instructorDetails.image && (
                <img
                  src={data.instructorDetails.image}
                  alt={data.instructorDetails.name}
                  className="w-16 h-16 rounded-full object-cover border border-gray-200"
                />
              )}
              <div>
                <p className="text-lg font-semibold text-gray-800">{data.instructorDetails.name}</p>
                <p className="text-sm text-gray-500">{data.instructorDetails.bio}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
              {data.instructorDetails.specialization && (
                <p><strong>Specialization:</strong> {data.instructorDetails.specialization}</p>
              )}
              {data.instructorDetails.experience && (
                <p><strong>Experience:</strong> {data.instructorDetails.experience}</p>
              )}
              {data.instructorDetails.qualification && (
                <p><strong>Qualification:</strong> {data.instructorDetails.qualification}</p>
              )}
              {data.instructorDetails.linkedin && (
                <p><strong>LinkedIn:</strong> <a href={data.instructorDetails.linkedin} target="_blank" className="text-blue-500 underline">{data.instructorDetails.linkedin}</a></p>
              )}
              {data.instructorDetails.github && (
                <p><strong>GitHub:</strong> <a href={data.instructorDetails.github} target="_blank" className="text-blue-500 underline">{data.instructorDetails.github}</a></p>
              )}
              {data.instructorDetails.facebook && (
                <p><strong>Facebook:</strong> <a href={data.instructorDetails.facebook} target="_blank" className="text-blue-500 underline">{data.instructorDetails.facebook}</a></p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorForm;
