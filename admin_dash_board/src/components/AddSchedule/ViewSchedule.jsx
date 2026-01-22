import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft, FaArrowRight, FaCalendarAlt } from "react-icons/fa";
import { AdminContext } from "../AdminContext/Context";
import SchedulePopup from "./SchedulePopup";

const ViewSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { handleShowPopup, showPopup } = useContext(AdminContext);

  // Get Monday as the start of the week
  const getWeekStart = (date) => {
    const day = date.getDay(); // 0 (Sun) - 6 (Sat)
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const startOfWeek = getWeekStart(new Date(currentWeek));
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const getAllSchedule = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get_all_schedule`);
      setSchedules(res.data.schedules || []);
    } catch (err) {
      console.error("Error fetching schedules:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getAllSchedule();


 
  }, []);

  const changeWeek = (direction) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + direction * 7);
    setCurrentWeek(newDate);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isWithinTimeRange = (schedule, time) => {
    return schedule.startTime <= time && schedule.endTime > time;
  };

const isMatchingDay = (schedule, day) => {
  if (!Array.isArray(schedule.days)) return false;

  const weekday = day.toLocaleDateString("en-US", { weekday: "long" });
  const start = new Date(schedule.startDate);
  const end = new Date(schedule.endDate);

  return schedule.days.includes(weekday) && day >= start && day <= end;
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {showPopup && <SchedulePopup />}

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-600" /> Weekly Schedule
            </h1>
            <p className="text-gray-600">View and manage weekly classes</p>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => changeWeek(-1)}
              className="bg-white shadow p-2 rounded-full hover:bg-gray-100"
            >
              <FaArrowLeft />
            </button>
            <div className="text-center">
              <p className="text-gray-700 font-semibold text-lg">
                {formatDate(daysOfWeek[0])} — {formatDate(daysOfWeek[6])}
              </p>
            </div>
            <button
              onClick={() => changeWeek(1)}
              className="bg-white shadow p-2 rounded-full hover:bg-gray-100"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Schedule Content */}
        {loading ? (
          <div className="text-center py-10 text-gray-600 text-lg">
            Loading schedules...
          </div>
        ) : (
          <>
            {/* Weekly Table View */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-md">
              <table className="w-full border-collapse min-w-[900px]">
                <thead>
                  <tr>
                    <th className="w-24 bg-blue-600 text-white p-3 text-left">
                      Time
                    </th>
                    {daysOfWeek.map((day, i) => (
                      <th
                        key={i}
                        className="bg-blue-600 text-white text-center p-3 border-l"
                      >
                        <div className="flex flex-col items-center">
                          <span className="font-semibold">
                            {day.toLocaleDateString("en-US", { weekday: "short" })}
                          </span>
                          <span className="text-sm opacity-90">
                            {day.getDate()}{" "}
                            {day.toLocaleDateString("en-US", { month: "short" })}{" "}
                            {day.getFullYear()}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {timeSlots.map((time, i) => (
                    <tr key={i} className="border-t hover:bg-blue-50">
                      <td className="p-3 font-semibold text-gray-700">{time}</td>
                      {daysOfWeek.map((day, j) => {
                        const schedule = schedules.find(
                          (s) => isWithinTimeRange(s, time) && isMatchingDay(s, day)
                        );
                        return (
                          <td
                            key={j}
                            className="h-24 border-l text-center align-top p-2"
                          >
                            {schedule ? (
                              <div
                                onClick={() => handleShowPopup(true, schedule._id)}
                                className="bg-blue-600 text-white rounded-lg p-2 text-sm cursor-pointer hover:bg-blue-700 transition"
                              >
                                <p className="font-semibold">{schedule.course}</p>
                                <p className="text-xs">{schedule.batch}</p>
                                <p className="text-xs">
                                  {schedule.startTime} - {schedule.endTime}
                                </p>
                              </div>
                            ) : (
                              <div className="text-gray-300 text-xs">—</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Grid Card View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
              {schedules.map((schedule, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-blue-600"
                  onClick={() => handleShowPopup(true, schedule._id)}
                >
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {schedule.course}
                  </h3>
                  <p className="text-sm text-blue-200 mb-1">
                    Batch: {schedule.batch}
                  </p>
                  <p className="text-sm text-blue-200 mb-1">
                    Instructor: {schedule.instructor}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewSchedule;
