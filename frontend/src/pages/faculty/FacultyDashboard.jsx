import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import NoticeWidget from "../../components/common/NoticeWidget";
import EventWidget from "../../components/common/EventWidget";
import { useEffect, useState } from "react";
import { getFacultyDashboardStats, getLowAttendanceStudents } from "../../services/facultyService";
import { ATTENDANCE_THRESHOLD } from "../../utils/attendanceUtils";
import { Link } from "react-router-dom";

function FacultyDashboard() {

    const [stats, setStats] = useState(null);
    const [lowAttendanceStudents, setLowAttendanceStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsData, lowAttendanceData] = await Promise.all([
                    getFacultyDashboardStats(),
                    getLowAttendanceStudents()
                ]);
                setStats(statsData);
                setLowAttendanceStudents(lowAttendanceData.students || lowAttendanceData || []);
            } catch (err) {
                console.error("Dashboard error:", err);
                setError("Failed to load faculty data");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader />
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <ErrorMessage message={error} />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn p-2 sm:p-4">
                
                <h1 className="text-2xl font-bold text-slate-800">Faculty Overview</h1>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Assigned Courses" value={stats.courses} />
                    <StatCard title="Total Classes Taken" value={stats.totalClasses} />
                    <StatCard title="Students Taught" value={stats.students} />
                    <StatCard title="Pending Grievances" value={stats.grievances} />
                </div>

                {/* Quick Actions */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <QuickLink to="/faculty/attendance" icon="📝" label="Mark Attendance" bg="bg-emerald-50" text="text-emerald-700" />
                        <QuickLink to="/faculty/marks" icon="📊" label="Upload Marks" bg="bg-blue-50" text="text-blue-700" />
                        <QuickLink to="/faculty/courses" icon="📚" label="My Courses" bg="bg-indigo-50" text="text-indigo-700" />
                        <QuickLink to="/faculty/grievances" icon="💬" label="Grievances" bg="bg-rose-50" text="text-rose-700" />
                    </div>
                </div>

                {/* Widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <NoticeWidget />
                    <EventWidget />
                </div>

                {/* Low Attendance Alert */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                            <span className="text-xl">⚠️</span> Students Below {ATTENDANCE_THRESHOLD}% Attendance
                        </h3>
                        {lowAttendanceStudents.length > 0 && (
                            <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-bold">
                                {lowAttendanceStudents.length} Students Alert
                            </span>
                        )}
                    </div>

                    {!Array.isArray(lowAttendanceStudents) || lowAttendanceStudents.length === 0 ? (
                        <div className="p-8 text-center bg-emerald-50/30">
                            <p className="text-emerald-600 font-medium">✅ All of your students are maintaining good attendance!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-rose-50/50 text-rose-700">
                                    <tr>
                                        <th className="p-4 text-left font-semibold">Student Name</th>
                                        <th className="p-4 text-left font-semibold">Subject</th>
                                        <th className="p-4 text-left font-semibold">Attendance</th>
                                        <th className="p-4 text-left font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-rose-50">
                                    {lowAttendanceStudents.map((student, idx) => (
                                        <tr key={idx} className="hover:bg-rose-50/30 transition">
                                            <td className="p-4 font-medium text-slate-800">
                                                {student.student?.name || "Unknown"}
                                            </td>
                                            <td className="p-4 text-slate-600">
                                                {student.subject}
                                            </td>
                                            <td className="p-4 font-bold text-rose-600">
                                                {student.percentage}%
                                            </td>
                                            <td className="p-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
                                                    Action Required
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </DashboardLayout>
    );
}

function QuickLink({ to, icon, label, bg, text }) {
    return (
        <Link to={to} className={`flex flex-col items-center justify-center p-6 rounded-2xl transition hover:shadow-md hover:-translate-y-1 ${bg} ${text} border border-white hover:border-indigo-100`}>
            <span className="text-3xl mb-3">{icon}</span>
            <span className="font-semibold text-sm text-center">{label}</span>
        </Link>
    );
}

export default FacultyDashboard;