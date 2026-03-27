import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAllCourses, enrollCourse, dropCourse } from "../../services/studentService";

function CourseRegistration() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null); // courseId being acted on
    const [search, setSearch] = useState("");
    const [deptFilter, setDeptFilter] = useState("all");
    const [tab, setTab] = useState("all"); // "all" | "enrolled" | "available"

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllCourses();
            setCourses(data.courses || []);
        } catch {
            setError("Failed to load courses. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCourses(); }, []);

    const handleEnroll = async (courseId) => {
        setActionLoading(courseId);
        try {
            await enrollCourse(courseId);
            await fetchCourses();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to enroll");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDrop = async (courseId) => {
        if (!confirm("Are you sure you want to drop this course?")) return;
        setActionLoading(courseId);
        try {
            await dropCourse(courseId);
            await fetchCourses();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to drop course");
        } finally {
            setActionLoading(null);
        }
    };

    // Filtering
    const filteredCourses = courses.filter((course) => {
        const searchMatch = new RegExp(search, "i").test(course.title) || new RegExp(search, "i").test(course.courseCode);
        const deptMatch = deptFilter === "all" || course.department === deptFilter;
        const tabMatch =
            tab === "all" ||
            (tab === "enrolled" && course.isEnrolled) ||
            (tab === "available" && !course.isEnrolled);
        return searchMatch && deptMatch && tabMatch;
    });

    const departments = [...new Set(courses.map(c => c.department).filter(Boolean))].sort();
    const enrolledCount = courses.filter(c => c.isEnrolled).length;
    const availableCount = courses.filter(c => !c.isEnrolled).length;

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fadeIn">
                {/* ═══ Header ═══ */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Course Registration</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Browse and enroll in available courses
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                            <span className="text-xs text-emerald-600 font-medium">Enrolled: </span>
                            <span className="text-lg font-bold text-emerald-700">{enrolledCount}</span>
                        </div>
                        <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                            <span className="text-xs text-slate-500 font-medium">Total: </span>
                            <span className="text-lg font-bold text-slate-700">{courses.length}</span>
                        </div>
                    </div>
                </div>

                {/* ═══ Tabs ═══ */}
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                    {[
                        { key: "all", label: "All Courses", count: courses.length },
                        { key: "enrolled", label: "Enrolled", count: enrolledCount },
                        { key: "available", label: "Available", count: availableCount },
                    ].map(t => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                tab === t.key
                                    ? "bg-white text-indigo-700 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            {t.label}
                            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                                tab === t.key ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-500"
                            }`}>
                                {t.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* ═══ Search + Filter ═══ */}
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
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 text-sm bg-slate-50 hover:bg-white transition-all"
                        />
                    </div>
                    <select
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                        className="md:w-52 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm bg-slate-50 hover:bg-white cursor-pointer"
                    >
                        <option value="all">All Departments</option>
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>

                {/* ═══ Course Cards ═══ */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-2xl shadow-md text-center py-16 text-red-500 font-medium">
                        {error}
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-md text-center py-16">
                        <p className="text-slate-400 text-lg">No courses found</p>
                        <p className="text-slate-300 text-sm mt-1">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredCourses.map((course) => (
                            <div
                                key={course._id}
                                className={`bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-all group ${
                                    course.isEnrolled ? "border-emerald-200" : "border-slate-100"
                                }`}
                            >
                                {/* Card Header */}
                                <div className={`px-5 py-3 flex items-center justify-between ${
                                    course.isEnrolled
                                        ? "bg-gradient-to-r from-emerald-50 to-teal-50"
                                        : "bg-gradient-to-r from-indigo-50 to-purple-50"
                                }`}>
                                    <span className={`text-sm font-bold ${
                                        course.isEnrolled ? "text-emerald-700" : "text-indigo-700"
                                    }`}>
                                        {course.courseCode}
                                    </span>
                                    {course.isEnrolled && (
                                        <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Enrolled
                                        </span>
                                    )}
                                </div>

                                {/* Card Body */}
                                <div className="p-5 space-y-3">
                                    <h3 className="font-semibold text-slate-800 text-base leading-tight">
                                        {course.title}
                                    </h3>

                                    <div className="space-y-1.5 text-sm">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                            </svg>
                                            {course.department}
                                        </div>
                                        {course.faculty && (
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                                Prof. {course.faculty.name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 pt-1">
                                        <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-lg">
                                            {course.credits} Credits
                                        </span>
                                        <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-lg">
                                            Sem {course.semester}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Action */}
                                <div className="px-5 pb-5">
                                    {course.isEnrolled ? (
                                        <button
                                            onClick={() => handleDrop(course._id)}
                                            disabled={actionLoading === course._id}
                                            className="w-full py-2.5 rounded-xl border-2 border-red-200 text-red-600 font-medium text-sm hover:bg-red-50 hover:border-red-300 disabled:opacity-50 transition-all"
                                        >
                                            {actionLoading === course._id ? "Dropping..." : "Drop Course"}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleEnroll(course._id)}
                                            disabled={actionLoading === course._id}
                                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm shadow-md hover:shadow-lg hover:scale-[1.01] disabled:opacity-50 transition-all"
                                        >
                                            {actionLoading === course._id ? "Enrolling..." : "Enroll Now"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default CourseRegistration;