import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getMyCourses } from "../../services/facultyService";

function FacultyCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getMyCourses();
                setCourses(data.courses || []);
            } catch (err) {
                console.error("Failed to fetch faculty courses:", err);
                setError("Failed to load your assigned courses.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn">
                <h2 className="text-xl font-semibold">
                    My Assigned Courses
                </h2>

                {loading ? (
                    <div className="flex justify-center p-8">
                        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-2xl shadow-md p-6 text-red-500">
                        {error}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-md p-6 text-slate-500 text-center py-10">
                        You have no assigned courses.
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-md p-6 divide-y divide-slate-100 border border-slate-100">
                        {courses.map(course => (
                            <div key={course._id} className="py-4 first:pt-2 last:pb-2">
                                <p className="font-semibold text-lg text-slate-800">{course.title}</p>
                                <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                                    <span className="font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                                        {course.courseCode}
                                    </span>
                                    <span>•</span>
                                    <span>{course.department}</span>
                                    <span>•</span>
                                    <span>Semester {course.semester}</span>
                                    <span>•</span>
                                    <span>{course.credits} Credits</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default FacultyCourses;