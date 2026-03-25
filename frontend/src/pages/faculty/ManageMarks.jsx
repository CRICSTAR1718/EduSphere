import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getMyCourses, getStudents, uploadMarks } from "../../services/facultyService";

function ManageMarks() {
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [examType, setExamType] = useState("internal");
    
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
                
                // Initialize marks array
                const studentsWithMarks = (data.students || []).map(student => ({
                    ...student,
                    score: "" 
                }));
                
                setStudents(studentsWithMarks);
                setMessage({ type: "", text: "" });
            } catch (err) {
                console.error("Failed to fetch students", err);
                setMessage({ type: "error", text: "Failed to load students." });
                setStudents([]);
            } finally {
                setLoadingStudents(false);
            }
        };

        fetchClassStudents();
    }, [selectedCourseId, courses]);

    const updateScore = (id, value) => {
        setStudents(students.map(student =>
            student._id === id ? { ...student, score: value } : student
        ));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });
        
        if (!selectedCourseId) {
            setMessage({ type: "error", text: "Please select a course." });
            return;
        }
        
        const validMarks = students.filter(s => s.score !== "" && s.score !== null);
        
        if (validMarks.length === 0) {
            setMessage({ type: "error", text: "Please enter marks for at least one student." });
            return;
        }

        const selectedCourse = courses.find(c => c._id === selectedCourseId);
        
        const records = validMarks.map(s => {
            const numScore = Number(s.score);
            let grade = "F";
            if (numScore >= 90) grade = "A+";
            else if (numScore >= 80) grade = "A";
            else if (numScore >= 70) grade = "B+";
            else if (numScore >= 60) grade = "B";
            else if (numScore >= 50) grade = "C";

            return {
                student: s._id,
                marks: numScore,
                totalMarks: 100, // Assuming 100 for now
                grade
            };
        });

        const payload = {
            subject: selectedCourse.title,
            semester: selectedCourse.semester,
            examType,
            marks: records
        };

        setSubmitting(true);
        try {
            await uploadMarks(payload);
            setMessage({ type: "success", text: `Successfully uploaded marks for ${records.length} students.` });
        } catch (err) {
            console.error("Upload marks error:", err);
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to upload marks." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fadeIn">
                <h1 className="text-2xl font-bold text-slate-800">
                    Upload Marks
                </h1>

                {/* ═══ Filters ═══ */}
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
                            Exam Type <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={examType}
                            onChange={(e) => setExamType(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm bg-slate-50"
                        >
                            <option value="internal">Internal Assessment</option>
                            <option value="midterm">Midterm Exam</option>
                            <option value="final">Final Exam</option>
                        </select>
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

                {/* ═══ Students List ═══ */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b flex items-center justify-between bg-slate-50/50">
                        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            Enter Marks (out of 100)
                        </h2>
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
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50 text-slate-600">
                                        <tr>
                                            <th className="p-4 text-left font-semibold">Roll No.</th>
                                            <th className="p-4 text-left font-semibold">Student Name</th>
                                            <th className="p-4 text-left font-semibold w-48">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {students.map(student => (
                                            <tr key={student._id} className="hover:bg-slate-50/50 transition">
                                                <td className="p-4 text-slate-600 font-medium">
                                                    {student.enrollmentNo}
                                                </td>
                                                <td className="p-4 text-slate-800 font-medium">
                                                    {student.name}
                                                </td>
                                                <td className="p-4">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        placeholder="Marks"
                                                        value={student.score}
                                                        onChange={(e) => updateScore(student._id, e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all font-medium text-slate-700"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
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
                                    {submitting ? "Uploading..." : "Upload Marks"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default ManageMarks;