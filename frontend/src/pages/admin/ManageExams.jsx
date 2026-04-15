import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { 
    getExams, 
    createExam, 
    updateExam, 
    deleteExam, 
    getCourses 
} from "../../services/adminService";

const blankForm = {
    course: "",
    department: "",
    semester: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    examType: "Regular",
};

function ManageExams() {
    const [exams, setExams] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters and Search
    const [search, setSearch] = useState("");
    const [deptFilter, setDeptFilter] = useState("all");
    const [semFilter, setSemFilter] = useState("all");

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingExam, setEditingExam] = useState(null); // null = add, object = edit
    const [formData, setFormData] = useState({ ...blankForm });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");

    // Delete confirmation
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // ─── Fetch data ───
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [examsData, coursesData] = await Promise.all([
                getExams(),
                getCourses()
            ]);

            setExams(examsData.exams || examsData);
            setCourses(coursesData.courses || coursesData);
        } catch (err) {
            console.error(err);
            setError("Failed to load exam data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ─── Open modal for add ───
    const openAddModal = () => {
        setEditingExam(null);
        setFormData({ ...blankForm });
        setFormError("");
        setShowModal(true);
    };

    // ─── Open modal for edit ───
    const openEditModal = (exam) => {
        setEditingExam(exam);
        setFormData({
            course: exam.course?._id || exam.course || "",
            department: exam.department || "",
            semester: exam.semester || "",
            date: exam.date ? new Date(exam.date).toISOString().split('T')[0] : "",
            startTime: exam.startTime || "",
            endTime: exam.endTime || "",
            venue: exam.venue || "",
            examType: exam.examType || "Regular",
        });
        setFormError("");
        setShowModal(true);
    };

    // ─── Form change ───
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const newData = { ...prev, [name]: value };
            
            // Auto-fill department and semester if course changes
            if (name === "course") {
                const selectedCourse = courses.find(c => c._id === value);
                if (selectedCourse) {
                    newData.department = selectedCourse.department;
                    newData.semester = selectedCourse.semester;
                }
            }
            return newData;
        });
    };

    // ─── Submit (create or update) ───
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setSaving(true);
        try {
            if (editingExam) {
                await updateExam(editingExam._id, formData);
            } else {
                if (!formData.course || !formData.date || !formData.startTime || !formData.endTime || !formData.venue) {
                    setFormError("All fields are required.");
                    setSaving(false);
                    return;
                }
                await createExam(formData);
            }
            setShowModal(false);
            fetchData();
        } catch (err) {
            setFormError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setSaving(false);
        }
    };

    // ─── Delete ───
    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteExam(deleteTarget._id);
            setDeleteTarget(null);
            fetchData();
        } catch {
            alert("Failed to delete exam.");
        } finally {
            setDeleting(false);
        }
    };

    // ─── Filter & Search Logic ───
    const filteredExams = exams.filter((exam) => {
        const title = exam.course?.title || "";
        const code = exam.course?.courseCode || "";
        const searchRegex = new RegExp(search, "i");
        const matchesSearch = searchRegex.test(title) || searchRegex.test(code);
        const matchesDept = deptFilter === "all" || exam.department === deptFilter;
        const matchesSem = semFilter === "all" || exam.semester?.toString() === semFilter;
        return matchesSearch && matchesDept && matchesSem;
    });

    const departments = [...new Set(exams.map(e => e.department).filter(Boolean))].sort();
    const semesters = [...new Set(exams.map(e => e.semester).filter(Boolean))].sort((a, b) => a - b);

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-2xl font-bold text-slate-800">
                        Exam Schedule Management
                    </h1>
                    <button
                        onClick={openAddModal}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Schedule Exam
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <div className="relative flex-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by subject or code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm bg-slate-50 transition-all"
                        />
                    </div>
                    <div className="flex gap-4">
                        <select
                            value={deptFilter}
                            onChange={(e) => setDeptFilter(e.target.value)}
                            className="w-full md:w-48 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm bg-slate-50"
                        >
                            <option value="all">All Departments</option>
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <select
                            value={semFilter}
                            onChange={(e) => setSemFilter(e.target.value)}
                            className="w-full md:w-40 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm bg-slate-50"
                        >
                            <option value="all">All Semesters</option>
                            {semesters.map(s => <option key={s} value={s}>Sem {s}</option>)}
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center py-20 animate-pulse">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-16 text-red-500">{error}</div>
                    ) : filteredExams.length === 0 ? (
                        <div className="text-center py-16 text-slate-400">No exams scheduled.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider">
                                    <tr>
                                        <th className="p-4 font-semibold">Date</th>
                                        <th className="p-4 font-semibold">Subject</th>
                                        <th className="p-4 font-semibold">Time</th>
                                        <th className="p-4 font-semibold">Venue</th>
                                        <th className="p-4 font-semibold text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredExams.map((exam) => (
                                        <tr key={exam._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-slate-800">
                                                    {new Date(exam.date).toLocaleDateString('en-GB')}
                                                </div>
                                                <div className="text-xs text-indigo-600 font-medium">
                                                    {exam.examType}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium text-slate-900">{exam.course?.title}</div>
                                                <div className="text-xs text-slate-500">{exam.course?.courseCode} • {exam.department} • Sem {exam.semester}</div>
                                            </td>
                                            <td className="p-4 text-slate-700 font-medium">
                                                {exam.startTime} - {exam.endTime}
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100">
                                                    {exam.venue}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button 
                                                        onClick={() => openEditModal(exam)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </button>
                                                    <button 
                                                        onClick={() => setDeleteTarget(exam)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingExam ? "Edit Exam Schedule" : "Schedule New Exam"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {formError && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{formError}</div>}
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Select Course</label>
                                <select 
                                    name="course" 
                                    value={formData.course} 
                                    onChange={handleChange} 
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-300 outline-none transition-all"
                                    required
                                >
                                    <option value="">-- Choose Course --</option>
                                    {courses.map(c => <option key={c._id} value={c._id}>{c.courseCode} - {c.title}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                                    <input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
                                    <input type="number" name="semester" value={formData.semester} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none" required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Exam Date</label>
                                <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-300" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                                    <input type="text" name="startTime" value={formData.startTime} onChange={handleChange} placeholder="e.g. 10:00 AM" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-300" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                                    <input type="text" name="endTime" value={formData.endTime} onChange={handleChange} placeholder="e.g. 01:00 PM" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-300" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Venue</label>
                                    <input type="text" name="venue" value={formData.venue} onChange={handleChange} placeholder="e.g. Hall A" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-300" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Exam Type</label>
                                    <select name="examType" value={formData.examType} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-300">
                                        <option value="Regular">Regular</option>
                                        <option value="Carry Over">Carry Over</option>
                                        <option value="Ex-Student">Ex-Student</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                                <button type="submit" disabled={saving} className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl shadow-lg hover:bg-indigo-500 disabled:opacity-50">
                                    {saving ? "Scheduling..." : editingExam ? "Update Schedule" : "Confirm Schedule"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Dialog */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
                        <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 text-3xl font-bold">!</div>
                        <h3 className="text-lg font-bold text-slate-800">Delete Exam?</h3>
                        <p className="text-slate-500 text-sm mt-2 mb-6">Are you sure you want to remove this exam schedule? This cannot be undone.</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-slate-600">Cancel</button>
                            <button onClick={handleDelete} disabled={deleting} className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-500 disabled:opacity-50">
                                {deleting ? "Deleting..." : "Delete Permanently"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default ManageExams;
