import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getMyCourses, getStudents, markAttendance } from "../../services/facultyService";

function MultiLectureAttendance() {
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [lectures, setLectures] = useState([{ id: 1, slot: "" }]);
    const [students, setStudents] = useState([]);
    
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // ─── Fetch Courses ───
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

    // ─── Fetch Students ───
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
                
                // For multi-lecture, we need an attendance array matching the length of lectures
                const studentsWithStatus = (data.students || []).map(student => ({
                    ...student,
                    attendance: lectures.map(() => "Present") // Initial status for each lecture slot
                }));
                
                setStudents(studentsWithStatus);
                setMessage({ type: "", text: "" });
            } catch (err) {
                console.error("Failed to fetch students", err);
                setMessage({ type: "error", text: "Failed to load students." });
                setStudents([]);
            } finally {
                setLoadingStudents(false);
            }
        };

        // Delay slighty if lectures structure changes but normally we fetch once
        fetchClassStudents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCourseId, courses]); // only re-fetch when course changes

    const addLectureSlot = () => {
        setLectures([...lectures, { id: Date.now(), slot: "" }]);
        setStudents(students.map(s => ({
            ...s,
            attendance: [...s.attendance, "Present"] // Add a new present status
        })));
    };

    const updateLectureSlot = (id, value) => {
        setLectures(
            lectures.map(l =>
                l.id === id ? { ...l, slot: value } : l
            )
        );
    };

    const toggleStudentAttendance = (studentId, lectureIndex, status) => {
        setStudents(students.map(s => {
            if (s._id === studentId) {
                const newAttendance = [...s.attendance];
                newAttendance[lectureIndex] = status;
                return { ...s, attendance: newAttendance };
            }
            return s;
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });
        
        if (!selectedCourseId) {
            setMessage({ type: "error", text: "Please select a course." });
            return;
        }

        const missingSlots = lectures.some(l => !l.slot.trim());
        if (missingSlots) {
            setMessage({ type: "error", text: "Please enter time slots for all lectures." });
            return;
        }

        const selectedCourse = courses.find(c => c._id === selectedCourseId);
        
        setSubmitting(true);
        try {
            // We need to submit one batch per lecture slot, assuming backend takes 1 date + subject
            // If backend handles multiple slots uniquely, we'd need a different API. 
            // For now, we will just submit them all back-to-back or in sequence for the same date.
            
            for (let i = 0; i < lectures.length; i++) {
                const recordsForThisLecture = students.map(s => ({
                    student: s._id,
                    status: s.attendance[i].toLowerCase()
                }));
                
                // For multiple lectures on same day, we append the slot string to the date or just assume the backend allows multiple marking per day. 
                // The backend models allow multiple, but let's submit them iteratively.
                await markAttendance({
                    subject: selectedCourse.title,
                    date,
                    records: recordsForThisLecture
                });
            }

            setMessage({ type: "success", text: `Successfully marked attendance for ${lectures.length} lectures.` });
        } catch (err) {
            console.error("Submit attendance error:", err);
            setMessage({ type: "error", text: "Failed to submit attendance for all lectures." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn">
                <h1 className="text-2xl font-bold text-slate-800">
                    Multi-Lecture Attendance
                </h1>

                {/* ═══ Selection Section ═══ */}
                <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4 border border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
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

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Date <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="date"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm bg-slate-50"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                    </div>

                    {/* Lecture Slots */}
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                        <h3 className="font-semibold text-slate-800">Lecture Slots</h3>

                        {lectures.map((lecture, index) => (
                            <div key={lecture.id} className="flex items-center gap-3">
                                <span className="text-sm font-medium text-slate-500 w-24">Lecture {index + 1}</span>
                                <input
                                    type="text"
                                    placeholder="Enter Time Slot (e.g. 10:00 - 11:00)"
                                    className="flex-1 w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-300 outline-none text-sm"
                                    value={lecture.slot}
                                    onChange={(e) => updateLectureSlot(lecture.id, e.target.value)}
                                />
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addLectureSlot}
                            className="mt-2 text-indigo-600 font-medium text-sm hover:text-indigo-700 hover:underline flex items-center gap-1"
                        >
                            <span>+</span> Add Another Lecture Slot
                        </button>
                    </div>
                </div>

                {/* ═══ Messages ═══ */}
                {message.text && (
                    <div className={`p-4 rounded-xl text-sm font-medium border ${
                        message.type === "error" 
                            ? "bg-red-50 text-red-600 border-red-100" 
                            : "bg-emerald-50 text-emerald-700 border-emerald-100"
                    }`}>
                        {message.text}
                    </div>
                )}

                {/* ═══ Student Attendance Table ═══ */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b flex items-center justify-between bg-slate-50/50">
                        <h3 className="font-semibold text-slate-800">
                            Mark Attendance
                        </h3>
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
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
                                    <tr>
                                        <th className="p-4 text-left font-semibold">Roll No.</th>
                                        <th className="p-4 text-left font-semibold">Student Name</th>
                                        {lectures.map((lecture, index) => (
                                            <th key={lecture.id} className="p-4 text-center font-semibold text-indigo-700">
                                                Lec {index + 1}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {students.map(student => (
                                        <tr key={student._id} className="hover:bg-slate-50/50 transition">
                                            <td className="p-4 text-slate-600 font-medium whitespace-nowrap">
                                                {student.enrollmentNo}
                                            </td>
                                            <td className="p-4 text-slate-800 font-medium whitespace-nowrap">
                                                {student.name}
                                            </td>

                                            {lectures.map((lecture, index) => (
                                                <td key={lecture.id} className="p-4 text-center">
                                                    <select 
                                                        className={`border rounded-lg text-xs font-semibold px-2 py-1 outline-none ${
                                                            student.attendance[index] === "Present" 
                                                                ? "border-emerald-200 text-emerald-700 bg-emerald-50"
                                                                : "border-rose-200 text-rose-700 bg-rose-50"
                                                        }`}
                                                        value={student.attendance[index]}
                                                        onChange={(e) => toggleStudentAttendance(student._id, index, e.target.value)}
                                                    >
                                                        <option value="Present">Present</option>
                                                        <option value="Absent">Absent</option>
                                                    </select>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        
                            <div className="p-6 border-t bg-slate-50/50 flex justify-end">
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all flex items-center gap-2"
                                >
                                    {submitting && (
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    {submitting ? "Uploading..." : "Submit All Attendance"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </DashboardLayout>
    );
}

export default MultiLectureAttendance;