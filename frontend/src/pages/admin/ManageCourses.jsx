import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getCourses, createCourse, updateCourse, deleteCourse, getUsers } from "../../services/adminService";

// ─── Blank form for adding a course ───
const blankForm = {
    courseCode: "",
    title: "",
    department: "",
    faculty: "",
    credits: "",
    semester: "",
    description: "",
};

function ManageCourses() {
    const [courses, setCourses] = useState([]);
    const [facultyList, setFacultyList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filters and Search
    const [search, setSearch] = useState("");
    const [deptFilter, setDeptFilter] = useState("all");
    const [semFilter, setSemFilter] = useState("all");

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null); // null = add, object = edit
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
            
            // Fetch courses and faculty in parallel
            const [coursesData, facultyData] = await Promise.all([
                getCourses(),
                getUsers({ role: "faculty" })
            ]);
            
            setCourses(coursesData.courses || coursesData); // Handle {count, courses} or [courses]
            setFacultyList(facultyData.users || facultyData);
        } catch (err) {
            console.error(err);
            setError("Failed to load courses. Make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ─── Open modal for add ───
    const openAddModal = () => {
        setEditingCourse(null);
        setFormData({ ...blankForm });
        setFormError("");
        setShowModal(true);
    };

    // ─── Open modal for edit ───
    const openEditModal = (course) => {
        setEditingCourse(course);
        setFormData({
            courseCode: course.courseCode || "",
            title: course.title || "",
            department: course.department || "",
            faculty: course.faculty?._id || course.faculty || "",
            credits: course.credits || "",
            semester: course.semester || "",
            description: course.description || "",
        });
        setFormError("");
        setShowModal(true);
    };

    // ─── Form change ───
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ─── Submit (create or update) ───
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setSaving(true);
        try {
            if (editingCourse) {
                // Update
                await updateCourse(editingCourse._id, formData);
            } else {
                // Create
                if (!formData.courseCode || !formData.title || !formData.department || !formData.credits || !formData.semester) {
                    setFormError("Code, title, department, credits and semester are required.");
                    setSaving(false);
                    return;
                }
                await createCourse(formData);
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
            await deleteCourse(deleteTarget._id);
            setDeleteTarget(null);
            fetchData();
        } catch {
            alert("Failed to delete course.");
        } finally {
            setDeleting(false);
        }
    };

    // ─── Filter & Search Logic ───
    const filteredCourses = courses.filter((course) => {
        // Search
        const searchRegex = new RegExp(search, "i");
        const matchesSearch = searchRegex.test(course.title) || searchRegex.test(course.courseCode);
        
        // Department Filter
        const matchesDept = deptFilter === "all" || course.department === deptFilter;
        
        // Semester Filter
        const matchesSem = semFilter === "all" || course.semester?.toString() === semFilter;
        
        return matchesSearch && matchesDept && matchesSem;
    });

    // Unique departments and semesters for filter dropdowns
    const departments = [...new Set(courses.map(c => c.department).filter(Boolean))].sort();
    const semesters = [...new Set(courses.map(c => c.semester).filter(Boolean))].sort((a,b)=>a-b);

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fadeIn">
                {/* ═══ Header ═══ */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-2xl font-bold text-slate-800">
                        Course Management
                    </h1>
                    <button
                        onClick={openAddModal}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Course
                    </button>
                </div>

                {/* ═══ Filters + Search ═══ */}
                <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <div className="relative flex-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by code or title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 text-sm transition-all bg-slate-50 hover:bg-white"
                        />
                    </div>
                    
                    <div className="flex gap-4">
                        <select
                            value={deptFilter}
                            onChange={(e) => setDeptFilter(e.target.value)}
                            className="flex-1 md:w-48 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm bg-slate-50 hover:bg-white cursor-pointer"
                        >
                            <option value="all">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                        <select
                            value={semFilter}
                            onChange={(e) => setSemFilter(e.target.value)}
                            className="flex-1 md:w-40 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm bg-slate-50 hover:bg-white cursor-pointer"
                        >
                            <option value="all">All Semesters</option>
                            {semesters.map(sem => (
                                <option key={sem} value={sem}>Semester {sem}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ═══ Courses Table ═══ */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-16 text-red-500 font-medium">
                            {error}
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-slate-400 text-lg">No courses found</p>
                            <p className="text-slate-300 text-sm mt-1">
                                {courses.length === 0 ? "Add a course to get started." : "Try adjusting your search or filters."}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700">
                                        <th className="p-4 text-left font-semibold">Code</th>
                                        <th className="p-4 text-left font-semibold">Course Title</th>
                                        <th className="p-4 text-left font-semibold">Department</th>
                                        <th className="p-4 text-center font-semibold">Sem</th>
                                        <th className="p-4 text-center font-semibold">Credits</th>
                                        <th className="p-4 text-left font-semibold">Faculty</th>
                                        <th className="p-4 text-center font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCourses.map((course) => (
                                        <tr
                                            key={course._id}
                                            className="border-t border-slate-100 hover:bg-slate-50/70 transition-colors"
                                        >
                                            <td className="p-4 font-bold text-indigo-600 whitespace-nowrap">
                                                {course.courseCode}
                                            </td>
                                            <td className="p-4 font-medium text-slate-800">
                                                {course.title}
                                            </td>
                                            <td className="p-4 text-slate-600">
                                                {course.department}
                                            </td>
                                            <td className="p-4 text-center font-medium text-slate-700">
                                                <span className="bg-slate-100 px-2 py-0.5 rounded-md">{course.semester}</span>
                                            </td>
                                            <td className="p-4 text-center font-medium text-slate-700">
                                                {course.credits}
                                            </td>
                                            <td className="p-4">
                                                {course.faculty ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                                                            {course.faculty.name.charAt(0)}
                                                        </div>
                                                        <span className="text-slate-700 font-medium">{course.faculty.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 italic text-xs bg-slate-50 px-2 py-1 rounded-md">Not Assigned</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(course)}
                                                        className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteTarget(course)}
                                                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                                        title="Delete"
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
                                {editingCourse
                                    ? `Edit Course: ${editingCourse.courseCode}`
                                    : "Add New Course"}
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

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {formError && (
                                <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                                    {formError}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    label="Course Code"
                                    name="courseCode"
                                    value={formData.courseCode}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. CS101"
                                />
                                <FormField
                                    label="Credits"
                                    name="credits"
                                    type="number"
                                    value={formData.credits}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. 3"
                                />
                            </div>

                            <FormField
                                label="Course Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Intro to Computer Science"
                            />

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
                                    placeholder="e.g. 1"
                                />
                            </div>

                            {/* Faculty Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Assign Faculty
                                </label>
                                <select
                                    name="faculty"
                                    value={formData.faculty}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm bg-white"
                                >
                                    <option value="">-- Select Faculty (Optional) --</option>
                                    {facultyList.map(faculty => (
                                        <option key={faculty._id} value={faculty._id}>
                                            {faculty.name} ({faculty.department || 'No Dept'})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Brief course description..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 text-sm transition-all resize-none"
                                />
                            </div>

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
                                        : editingCourse
                                        ? "Update Course"
                                        : "Add Course"}
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
                                Delete Course
                            </h3>
                            <p className="text-slate-500 text-sm mb-6">
                                Are you sure you want to delete <br/>
                                <span className="font-semibold text-slate-700">
                                    {deleteTarget.courseCode} - {deleteTarget.title}
                                </span>
                                ? <br/>This action cannot be undone.
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

export default ManageCourses;