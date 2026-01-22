import React, { useEffect, useState } from "react";

const AttendanceListing = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [batch, setBatch] = useState("");
  const [allStudents, setAllStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceId, setAttendanceId] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [session, setSession] = useState("Morning (9:00 AM)");
  const [subject, setSubject] = useState("");
  const [room, setRoom] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const sessions = ["Morning (9:00 AM)", "Afternoon (2:00 PM)", "Evening (6:00 PM)"];
  // const API_BASE = "https://lms-web-application-backend-e6yj.onrender.com/api/v1";

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/get_all_courses`);
        const data = await res.json();
        if (data.success) setCourses(data.data);
      } catch {
        setError("Failed to fetch courses");
      }
    };
    fetchCourses();
  }, []);

  // Fetch batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/get_all_batches`);
        const data = await res.json();
        if (data.success) setBatches(data.data);
      } catch {
        setError("Failed to fetch batches");
      }
    };
    fetchBatches();
  }, []);

  // Fetch all students once
useEffect(() => {
  const fetchAllStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/view_students`);
      const data = await res.json();
      if (data.success) {
        const uniqueStudents = Array.from(new Map(data.data.map((s) => [s._id, s])).values());
        setAllStudents(uniqueStudents);

        setStudents(
          uniqueStudents.map((s) => ({
            id: s._id,
            name: s.name,
            rollNo: s.rollNo || "-",
            email: s.email,
            status: "unmarked",
            time: "--:--",
            avatar: getInitials(s.name),
          }))
        );
      }
    } catch {
      setError("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };
  fetchAllStudents();
}, []);

// Filter students by batch (only if a batch is selected)
useEffect(() => {
  if (!allStudents.length) return;

  if (!batch) {
    // No batch selected, show all students
    setStudents(
      allStudents.map((s) => ({
        id: s._id,
        name: s.name,
        rollNo: s.rollNo || "-",
        email: s.email,
        status: "unmarked",
        time: "--:--",
        avatar: getInitials(s.name),
      }))
    );
    setAttendanceId(null);
    return;
  }

  // Batch is selected, fetch students for that batch
  const fetchBatchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/students_by_batch/${batch}`);
      const data = await res.json();
      if (data.success) {
        setStudents(
          data.data.map((s) => ({
            id: s._id,
            name: s.name,
            rollNo: s.rollNo || "-",
            email: s.email,
            status: "unmarked",
            time: "--:--",
            avatar: getInitials(s.name),
          }))
        );
        setAttendanceId(null);
      }
    } catch {
      setError("Failed to fetch batch students");
    } finally {
      setLoading(false);
    }
  };
  fetchBatchStudents();
}, [batch, allStudents]);

  // Fetch existing attendance
  const fetchOrCreateAttendance = async () => {
    if (!batch) return;

    try {
      setLoading(true);
      const params = new URLSearchParams({ batchId: batch, date, session });
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/get_attendance?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.data) {
        const attendance = data.data;
        setAttendanceId(attendance._id);
        setSubject(attendance.subject || "");
        setRoom(attendance.room || "");

        setStudents((prev) =>
          prev.map((student) => {
            const record = attendance.records.find((r) => r.studentId._id === student.id);
            return record
              ? { ...student, status: record.status, time: record.markedTime || "--:--" }
              : student;
          })
        );
      } else {
        setAttendanceId(null);
      }
    } catch {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrCreateAttendance();
  }, [batch, date, session]);

  
  const createAttendanceSession = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/create_session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchId: batch, date, session, subject, room }),
      });
      const data = await res.json();
      if (data.success) setAttendanceId(data.data._id);
      return data.data._id;
    } catch {
      setError("Failed to create attendance session");
      return null;
    }
  };

  const markAttendance = async (studentId, status) => {
    try {
      let currentAttendanceId = attendanceId || (await createAttendanceSession());
      if (!currentAttendanceId) return;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/mark_attendance`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendanceId: currentAttendanceId, studentId, status }),
      });
      const data = await res.json();
      if (data.success) {
        const currentTime =
          status !== "unmarked"
            ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "--:--";
        setStudents((prev) =>
          prev.map((s) => (s.id === studentId ? { ...s, status, time: currentTime } : s))
        );
      }
    } catch {
      setError("Failed to mark attendance");
    }
  };

  const markAll = async (status) => {
    try {
      let currentAttendanceId = attendanceId || (await createAttendanceSession());
      if (!currentAttendanceId) return;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/mark_bulk`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendanceId: currentAttendanceId, status }),
      });
      const data = await res.json();
      if (data.success) {
        const currentTime =
          status !== "unmarked"
            ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "--:--";
        setStudents((prev) => prev.map((s) => ({ ...s, status, time: currentTime })));
      }
    } catch {
      setError("Failed to mark bulk attendance");
    }
  };

  const resetAll = () => markAll("unmarked");

  const submitAttendance = async () => {
    if (!attendanceId) await createAttendanceSession();
    alert("Attendance submitted successfully!");
    const nextIndex = batches.findIndex((b) => b._id === batch) + 1;
    if (nextIndex < batches.length) setBatch(batches[nextIndex]._id);
  };

  const getStats = () => {
    const total = students.length;
    const present = students.filter((s) => s.status === "present").length;
    const absent = students.filter((s) => s.status === "absent").length;
    const late = students.filter((s) => s.status === "late").length;
    return { total, present, absent, late };
  };

  const stats = getStats();

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.includes(searchTerm) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSubject(value);
    setShowDropdown(!!value);
    setFilteredCourses(courses.filter((c) => c.name.toLowerCase().includes(value.toLowerCase())));
  };

  const selectCourse = (name) => {
    setSubject(name);
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative">
            <span>{error}</span>
            <button onClick={() => setError("")} className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <span className="text-2xl">&times;</span>
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Take Attendance</h1>
          </div>
          <p className="text-blue-100 text-sm md:text-base ml-0 md:ml-14">
            Mark attendance for your class session
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Batch */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Batch/Class</label>
              <select
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium disabled:bg-gray-100"
              >
                <option value="">Select Batch</option>
                {batches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.batchName || b.batchId}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
              />
            </div>

            {/* Session */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Session</label>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
              >
                {sessions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subject/Topic</label>
              <input
                type="text"
                value={subject}
                onChange={handleInputChange}
                placeholder="Search or select a course..."
                className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              />
              {showDropdown && filteredCourses.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                  {filteredCourses.map((c) => (
                    <li
                      key={c._id}
                      onClick={() => selectCourse(c.name)}
                      className="px-3 py-2 hover:bg-blue-500 hover:text-white cursor-pointer"
                    >
                      {c.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Room */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Room</label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Lab 101"
                className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              />
            </div>
          </div>

          {/* Bulk Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => markAll("present")}
              disabled={loading || !students.length}
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              ✓ Mark All Present
            </button>
            <button
              onClick={() => markAll("absent")}
              disabled={loading || !students.length}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              ✕ Mark All Absent
            </button>
            <button
              onClick={resetAll}
              disabled={loading || !students.length}
              className="px-5 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              🔄 Reset All
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-4 md:p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-sm opacity-90">Total Students</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
              <div className="text-3xl font-bold">{stats.present}</div>
              <div className="text-sm opacity-90">Present</div>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white">
              <div className="text-3xl font-bold">{stats.absent}</div>
              <div className="text-sm opacity-90">Absent</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
              <div className="text-3xl font-bold">{stats.late}</div>
              <div className="text-sm opacity-90">Late</div>
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by name, roll no, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="unmarked">Unmarked</option>
            </select>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
              <thead className="bg-blue-600 text-white text-left">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Student</th>
                  <th className="px-4 py-2">Roll No</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, idx) => (
                  <tr key={s.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2 flex items-center gap-2">
                      <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                        {s.avatar}
                      </div>
                      {s.name}
                    </td>
                    <td className="px-4 py-2">{s.rollNo}</td>
                    <td className="px-4 py-2">{s.email}</td>
                    <td className="px-4 py-2 font-semibold capitalize">{s.status}</td>
                    <td className="px-4 py-2">{s.time}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => markAttendance(s.id, "present")}
                        className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => markAttendance(s.id, "absent")}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        ✕
                      </button>
                      <button
                        onClick={() => markAttendance(s.id, "late")}
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        🕒
                      </button>
                      <button
                        onClick={() => markAttendance(s.id, "unmarked")}
                        className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        ↺
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Submit Button */}
          <div className="mt-6 text-right">
            <button
              onClick={submitAttendance}
              disabled={loading || !students.length}
              className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50"
            >
              Submit Attendance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceListing;
