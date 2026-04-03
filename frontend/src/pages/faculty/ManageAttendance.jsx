import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getMyCourses, getStudents, markAttendance } from "../../services/facultyService";

function ManageAttendance() {
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const [students, setStudents] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [message, setMessage] = useState({ type: "", text: "" });

    // ─── Fetch Courses assigned to faculty ───
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getMyCourses();
                setCourses(data.courses || []);
                if (data.courses?.length > 0) {
                    setSelectedCourseId(data.courses[0]._id);
                }
            } catch (err) {
                console.error("Failed to fetch courses", err);
                setMessage({ type: "error", text: "Failed to load courses." });
            } finally {
                setLoadingCourses(false);
            }
        };
        fetchCourses();
    }, []);

    // ─── Fetch Students when course changes ───
    useEffect(() => {
        const fetchClassStudents = async () => {
            if (!selectedCourseId) return;

            const selectedCourse = courses.find(c => c._id === selectedCourseId);
            if (!selectedCourse) return;

            setLoadingStudents(true);
            try {
                const data = await getStudents({
                    department: selectedCourse.department,
                    semester: selectedCourse.semester
                });

                // Initialize attendance array
                const studentsWithStatus = (data.students || []).map(student => ({
                    ...student,
                    present: true // default present
                }));

                setStudents(studentsWithStatus);
                setMessage({ type: "", text: "" }); // clear messages when class changes
            } catch (err) {
                console.error("Failed to fetch students", err);
                setMessage({ type: "error", text: "Failed to load students for this class." });
                setStudents([]);
            } finally {
                setLoadingStudents(false);
            }
        };

        fetchClassStudents();
    }, [selectedCourseId, courses]);

    const toggleAttendance = (id) => {
        setStudents(students.map(student =>
            student._id === id
                ? { ...student, present: !student.present }
                : student
        ));
    };

    const markAllPresent = () => setStudents(students.map(s => ({ ...s, present: true })));
    const markAllAbsent = () => setStudents(students.map(s => ({ ...s, present: false })));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (!selectedCourseId) {
            setMessage({ type: "error", text: "Please select a course." });
            return;
        }
        if (students.length === 0) {
            setMessage({ type: "error", text: "No students to mark." });
            return;
        }

        const selectedCourse = courses.find(c => c._id === selectedCourseId);

        const records = students.map(s => ({
            student: s._id,
            status: s.present ? "present" : "absent"
        }));

        const payload = {
            subject: selectedCourse.title,
            date: selectedDate,
            records
        };

        setSubmitting(true);
        try {
            await markAttendance(payload);
            setMessage({ type: "success", text: `Successfully marked attendance for ${records.length} students.` });
        } catch (err) {
            console.error("Submit attendance error:", err);
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to submit attendance." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fadeIn">
                <h1 className="text-2xl font-bold text-slate-800">
                    Manage Attendance
                </h1>

                {/* ═══ Header / Filters ═══ */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Select Course <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            disabled={loadingCourses}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm bg-slate-50 disabled:opacity-60"
                        >
                            {loadingCourses && <option value="">Loading courses...</option>}
                            {!loadingCourses && courses.map(c => (
                                <option key={c._id} value={c._id}>
                                    {c.courseCode} - {c.title} (Sem {c.semester})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:w-1/3">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Date <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            max={new Date().toISOString().split('T')[0]} // cannot mark future attendance usually
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm bg-slate-50"
                        />
                    </div>
                </div>

                {/* ═══ Messages ═══ */}
                {message.text && (
                    <div className={`p-4 rounded-xl text-sm font-medium border ${message.type === "error"
                            ? "bg-red-50 text-red-600 border-red-100"
                            : "bg-emerald-50 text-emerald-700 border-emerald-100"
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* ═══ Students List ═══ */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b flex items-center justify-between bg-slate-50/50">
                        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            Student List
                            {!loadingStudents && students.length > 0 && (
                                <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                                    {students.length}
                                </span>
                            )}
                        </h2>

                        {!loadingStudents && students.length > 0 && (
                            <div className="flex gap-2">
                                <button type="button" onClick={markAllPresent} className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition">All Present</button>
                                <button type="button" onClick={markAllAbsent} className="px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-lg transition">All Absent</button>
                            </div>
                        )}
                    </div>

                    {loadingStudents ? (
                        <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                            Loading students...
                        </div>
                    ) : students.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            No students found for this class.
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto hidden md:block">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50 text-slate-600">
                                        <tr>
                                            <th className="p-4 text-left font-semibold">Roll No.</th>
                                            <th className="p-4 text-left font-semibold">Student Name</th>
                                            <th className="p-4 text-center font-semibold w-32">Present</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {students.map(student => (
                                            <tr key={student._id} className="hover:bg-slate-50/50 transition cursor-pointer" onClick={() => toggleAttendance(student._id)}>
                                                <td className="p-4 text-slate-600 font-medium">
                                                    {student.enrollmentNo}
                                                </td>
                                                <td className="p-4 text-slate-800 font-medium">
                                                    {student.name}
                                                </td>
                                                <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={student.present}
                                                            onChange={() => toggleAttendance(student._id)}
                                                        />
                                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                                    </label>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card Layout */}
                            <div className="block md:hidden p-4 space-y-4">
                                {students.map(student => (
                                    <div key={student._id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-semibold text-slate-800 text-sm">
                                                    {student.name}
                                                </h3>
                                                <p className="text-xs text-slate-500 mt-1">Roll No: {student.enrollmentNo}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${student.present ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                                                    }`}>
                                                    {student.present ? "Present" : "Absent"}
                                                </span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={student.present}
                                                        onChange={() => toggleAttendance(student._id)}
                                                    />
                                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 border-t bg-slate-50/50 flex justify-end">
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all flex items-center gap-2"
                                >
                                    {submitting && (
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    {submitting ? "Saving..." : "Submit Attendance"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default ManageAttendance;