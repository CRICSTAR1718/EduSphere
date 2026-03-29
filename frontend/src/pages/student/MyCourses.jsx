import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getEnrolledCourses } from "../../services/studentService";

function MyCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getEnrolledCourses();
                setCourses(data.courses || []);
            } catch {
                setError("Failed to load your courses.");
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fadeIn">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Courses</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Courses you are currently enrolled in
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-2xl shadow-md text-center py-16 text-red-500 font-medium">
                        {error}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-md text-center py-16">
                        <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762z" />
                            </svg>
                        </div>
                        <p className="text-slate-400 text-lg">No courses enrolled yet</p>
                        <p className="text-slate-300 text-sm mt-1">
                            Go to Course Registration to enroll in courses.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {courses.map((course) => (
                            <div
                                key={course._id}
                                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-emerald-100 dark:border-emerald-900/50 overflow-hidden hover:shadow-md transition-all"
                            >
                                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/20 px-5 py-3 flex items-center justify-between">
                                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                                        {course.courseCode}
                                    </span>
                                    <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Enrolled
                                    </span>
                                </div>
                                <div className="p-5 space-y-3">
                                    <h3 className="font-semibold text-slate-800 dark:text-white text-base leading-tight">
                                        {course.title}
                                    </h3>
                                    <div className="space-y-1.5 text-sm">
                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 dark:text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                                            </svg>
                                            {course.department}
                                        </div>
                                        {course.faculty && (
                                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 dark:text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                                Prof. {course.faculty.name}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 pt-1">
                                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium px-2.5 py-1 rounded-lg">
                                            {course.credits} Credits
                                        </span>
                                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium px-2.5 py-1 rounded-lg">
                                            Sem {course.semester}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default MyCourses;