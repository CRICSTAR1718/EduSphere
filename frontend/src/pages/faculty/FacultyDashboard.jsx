import DashboardLayout from "../../components/layout/DashboardLayout";
import WelcomeBanner from "../../components/common/WelcomeBanner";

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
                
                <WelcomeBanner role="Faculty" />

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
                        <QuickLink to="/faculty/attendance" icon="📝" label="Mark Attendance" theme="emerald" />
                        <QuickLink to="/faculty/marks" icon="📊" label="Upload Marks" theme="blue" />
                        <QuickLink to="/faculty/courses" icon="📚" label="My Courses" theme="indigo" />
                        <QuickLink to="/faculty/grievances" icon="💬" label="Grievances" theme="rose" />
                    </div>
                </div>

                {/* Widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <NoticeWidget />
                    <EventWidget />
                </div>

                {/* Low Attendance Alert */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                        <h3 className="font-semibold text-slate-700 dark:text-slate-100 flex items-center gap-2">
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

function QuickLink({ to, icon, label, theme }) {
    const themes = {
        emerald: "bg-gradient-to-br from-emerald-50 to-emerald-100/80 dark:from-emerald-900/40 dark:to-emerald-900/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50 shadow-sm shadow-emerald-500/10 hover:shadow-md hover:shadow-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-600",
        blue: "bg-gradient-to-br from-blue-50 to-blue-100/80 dark:from-blue-900/40 dark:to-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/50 shadow-sm shadow-blue-500/10 hover:shadow-md hover:shadow-blue-500/20 hover:border-blue-300 dark:hover:border-blue-600",
        indigo: "bg-gradient-to-br from-indigo-50 to-indigo-100/80 dark:from-indigo-900/40 dark:to-indigo-900/20 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50 shadow-sm shadow-indigo-500/10 hover:shadow-md hover:shadow-indigo-500/20 hover:border-indigo-300 dark:hover:border-indigo-600",
        rose: "bg-gradient-to-br from-rose-50 to-rose-100/80 dark:from-rose-900/40 dark:to-rose-900/20 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/50 shadow-sm shadow-rose-500/10 hover:shadow-md hover:shadow-rose-500/20 hover:border-rose-300 dark:hover:border-rose-600",
    };
    const activeTheme = themes[theme] || themes.indigo;

    return (
        <Link to={to} className={`group flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 border ${activeTheme}`}>
            <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-white/50 dark:border-slate-700/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl drop-shadow-sm">{icon}</span>
            </div>
            <span className="font-bold text-sm text-center">{label}</span>
        </Link>
    );
}

export default FacultyDashboard;