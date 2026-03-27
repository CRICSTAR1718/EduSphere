import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getTimetable, addTimetableEntry, updateTimetableEntry, deleteTimetableEntry, getCourses } from "../../services/adminService";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const dayColors = {
    Monday: "bg-blue-50 text-blue-700 border-blue-200",
    Tuesday: "bg-purple-50 text-purple-700 border-purple-200",
    Wednesday: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Thursday: "bg-amber-50 text-amber-700 border-amber-200",
    Friday: "bg-rose-50 text-rose-700 border-rose-200",
    Saturday: "bg-cyan-50 text-cyan-700 border-cyan-200",
};

const blankForm = {
    course: "",
    department: "",
    semester: "",
    day: "",
    startTime: "",
    endTime: "",
    roomContext: "",
};

function ManageTimetable() {
    const [entries, setEntries] = useState([]);
    const [coursesList, setCoursesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [deptFilter, setDeptFilter] = useState("all");
    const [semFilter, setSemFilter] = useState("all");
    const [dayFilter, setDayFilter] = useState("all");

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [formData, setFormData] = useState({ ...blankForm });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");

    // Delete
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // ─── Fetch data ───
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [timetableData, coursesData] = await Promise.all([
                getTimetable(),
                getCourses(),
            ]);
            setEntries(Array.isArray(timetableData) ? timetableData : []);
            setCoursesList(coursesData.courses || coursesData || []);
        } catch {
            setError("Failed to load timetable. Make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // ─── Open add modal ───
    const openAddModal = () => {
        setEditingEntry(null);
        setFormData({ ...blankForm });
        setFormError("");
        setShowModal(true);
    };

    // ─── Open edit modal ───
    const openEditModal = (entry) => {
        setEditingEntry(entry);
        setFormData({
            course: entry.course?._id || entry.course || "",
            department: entry.department || "",
            semester: entry.semester || "",
            day: entry.day || "",
            startTime: entry.startTime || "",
            endTime: entry.endTime || "",
            roomContext: entry.roomContext || "",
        });
        setFormError("");
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ─── Submit ───
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setSaving(true);
        try {
            if (editingEntry) {
                await updateTimetableEntry(editingEntry._id, formData);
            } else {
                if (!formData.course || !formData.department || !formData.semester || !formData.day || !formData.startTime || !formData.endTime) {
                    setFormError("All fields except Room are required.");
                    setSaving(false);
                    return;
                }
                await addTimetableEntry(formData);
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
            await deleteTimetableEntry(deleteTarget._id);
            setDeleteTarget(null);
            fetchData();
        } catch {
            alert("Failed to delete lecture.");
        } finally {
            setDeleting(false);
        }
    };

    // ─── Filtering ───
    const filteredEntries = entries.filter((entry) => {
        const matchesDept = deptFilter === "all" || entry.department === deptFilter;
        const matchesSem = semFilter === "all" || entry.semester?.toString() === semFilter;
        const matchesDay = dayFilter === "all" || entry.day === dayFilter;
        return matchesDept && matchesSem && matchesDay;
    });

    // Group by day for the timetable view
    const groupedByDay = DAYS.reduce((acc, day) => {
        acc[day] = filteredEntries.filter((e) => e.day === day)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
        return acc;
    }, {});

    // Unique departments and semesters from existing entries
    const departments = [...new Set(entries.map(e => e.department).filter(Boolean))].sort();
    const semesters = [...new Set(entries.map(e => e.semester).filter(Boolean))].sort((a, b) => a - b);

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fadeIn">
                {/* ═══ Header ═══ */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-2xl font-bold text-slate-800">
                        Timetable Management
                    </h1>
                    <button
                        onClick={openAddModal}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Lecture
                    </button>
                </div>

                {/* ═══ Filters ═══ */}
                <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <select
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm bg-slate-50 hover:bg-white cursor-pointer"
                    >
                        <option value="all">All Departments</option>
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                    <select
                        value={semFilter}
                        onChange={(e) => setSemFilter(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm bg-slate-50 hover:bg-white cursor-pointer"
                    >
                        <option value="all">All Semesters</option>
                        {semesters.map(sem => (
                            <option key={sem} value={sem}>Semester {sem}</option>
                        ))}
                    </select>
                    <select
                        value={dayFilter}
                        onChange={(e) => setDayFilter(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm bg-slate-50 hover:bg-white cursor-pointer"
                    >
                        <option value="all">All Days</option>
                        {DAYS.map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                </div>

                {/* ═══ Timetable View ═══ */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-2xl shadow-md text-center py-16 text-red-500 font-medium">
                        {error}
                    </div>
                ) : filteredEntries.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-md text-center py-16">
                        <p className="text-slate-400 text-lg">No lectures found</p>
                        <p className="text-slate-300 text-sm mt-1">
                            {entries.length === 0
                                ? "Add a lecture to get started."
                                : "Try adjusting your filters."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {DAYS.map((day) => {
                            const dayEntries = groupedByDay[day];
                            if (!dayEntries || dayEntries.length === 0) return null;
                            return (
                                <div key={day} className="bg-white rounded-2xl shadow-md overflow-hidden">
                                    {/* Day header */}
                                    <div className={`px-6 py-3 font-bold text-sm border-b ${dayColors[day] || "bg-slate-50 text-slate-700"}`}>
                                        {day}
                                        <span className="ml-2 font-normal opacity-70">
                                            ({dayEntries.length} lecture{dayEntries.length > 1 ? "s" : ""})
                                        </span>
                                    </div>
                                    {/* Lecture cards */}
                                    <div className="divide-y divide-slate-50">
                                        {dayEntries.map((entry) => (
                                            <div
                                                key={entry._id}
                                                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-slate-50/50 transition-colors group"
                                            >
                                                {/* Time */}
                                                <div className="sm:w-36 flex-shrink-0">
                                                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                        </svg>
                                                        {entry.startTime} – {entry.endTime}
                                                    </span>
                                                </div>

                                                {/* Course info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-slate-800 truncate">
                                                        {entry.course?.title || "Unknown Course"}
                                                        <span className="ml-2 text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">
                                                            {entry.course?.courseCode || "—"}
                                                        </span>
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-0.5">
                                                        {entry.department} · Sem {entry.semester}
                                                        {entry.course?.faculty?.name && (
                                                            <span className="ml-2">· Prof. {entry.course.faculty.name}</span>
                                                        )}
                                                    </p>
                                                </div>

                                                {/* Room */}
                                                {entry.roomContext && (
                                                    <div className="sm:w-28 flex-shrink-0">
                                                        <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                                                            📍 {entry.roomContext}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => openEditModal(entry)}
                                                        className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteTarget(entry)}
                                                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ═══════ Add / Edit Modal ═══════ */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingEntry ? "Edit Lecture" : "Add New Lecture"}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {formError && (
                                <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                                    {formError}
                                </div>
                            )}

                            {/* Course dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Course <span className="text-red-400 ml-0.5">*</span>
                                </label>
                                <select
                                    name="course"
                                    value={formData.course}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm bg-white"
                                >
                                    <option value="">-- Select Course --</option>
                                    {coursesList.map(c => (
                                        <option key={c._id} value={c._id}>
                                            {c.courseCode} – {c.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    label="Department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Computer Science"
                                />
                                <FormField
                                    label="Semester"
                                    name="semester"
                                    type="number"
                                    value={formData.semester}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. 4"
                                />
                            </div>

                            {/* Day dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Day <span className="text-red-400 ml-0.5">*</span>
                                </label>
                                <select
                                    name="day"
                                    value={formData.day}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm bg-white"
                                >
                                    <option value="">-- Select Day --</option>
                                    {DAYS.map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    label="Start Time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. 10:00 AM"
                                />
                                <FormField
                                    label="End Time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. 11:00 AM"
                                />
                            </div>

                            <FormField
                                label="Room / Lab"
                                name="roomContext"
                                value={formData.roomContext}
                                onChange={handleChange}
                                placeholder="e.g. Room 402 or Lab 1 (optional)"
                            />

                            {/* Submit */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingEntry
                                        ? "Update Lecture"
                                        : "Add Lecture"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ═══════ Delete Confirmation ═══════ */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
                        <div className="text-center">
                            <div className="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">
                                Delete Lecture
                            </h3>
                            <p className="text-slate-500 text-sm mb-6">
                                Are you sure you want to remove this lecture?<br />
                                <span className="font-semibold text-slate-700">
                                    {deleteTarget.course?.title || "Course"} — {deleteTarget.day}, {deleteTarget.startTime}–{deleteTarget.endTime}
                                </span>
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setDeleteTarget(null)}
                                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-medium shadow-md hover:bg-red-600 disabled:opacity-50 transition-all"
                                >
                                    {deleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

// ─── Reusable form field ───
function FormField({ label, name, type = "text", value, onChange, required, placeholder }) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {label}
                {required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 text-sm transition-all"
            />
        </div>
    );
}

export default ManageTimetable;