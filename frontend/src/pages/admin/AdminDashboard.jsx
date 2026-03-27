import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import ReportsAnalytics from "../../components/admin/ReportsAnalytics";
import AcademicCalendar from "../../components/admin/AcademicCalendar";
import NoticeManagement from "../../components/admin/NoticeManagement";
import RoleManagement from "../../components/admin/RoleManagement";
import UserManagement from "../../components/admin/UserManagement";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useEffect, useState } from "react";
import { getAdminStats, getTimetable } from "../../services/adminService";
import NoticeWidget from "../../components/common/NoticeWidget";
import EventWidget from "../../components/common/EventWidget";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayColors = {
    Monday: "bg-blue-100 text-blue-700",
    Tuesday: "bg-purple-100 text-purple-700",
    Wednesday: "bg-emerald-100 text-emerald-700",
    Thursday: "bg-amber-100 text-amber-700",
    Friday: "bg-rose-100 text-rose-700",
    Saturday: "bg-cyan-100 text-cyan-700",
};

function TimetableOverview() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTimetable()
            .then((data) => setEntries(Array.isArray(data) ? data : []))
            .catch(() => setEntries([]))
            .finally(() => setLoading(false));
    }, []);

    const dayCounts = DAYS.map((day) => ({
        day,
        count: entries.filter((e) => e.day === day).length,
    })).filter((d) => d.count > 0);

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-semibold mb-4 text-slate-800">Timetable Overview</h3>
            {loading ? (
                <div className="flex justify-center py-4">
                    <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                </div>
            ) : entries.length === 0 ? (
                <p className="text-sm text-slate-400">No lectures scheduled yet.</p>
            ) : (
                <div className="space-y-3">
                    <p className="text-sm text-slate-600">
                        <span className="text-2xl font-bold text-indigo-600">{entries.length}</span>{" "}
                        total lecture{entries.length !== 1 ? "s" : ""} scheduled
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {dayCounts.map(({ day, count }) => (
                            <span
                                key={day}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${dayColors[day] || "bg-slate-100 text-slate-600"}`}
                            >
                                {day.slice(0, 3)}: {count}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        getAdminStats()
            .then(data => setStats(data))
            .catch(() => setError("Failed to load admin data"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <Loader />
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
            <div className="space-y-8 animate-fadeIn">

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="Total Students" value={stats.students} />
                    <StatCard title="Total Faculty" value={stats.faculty} />
                    <StatCard title="Active Notices" value={stats.notices} />
                </div>
                <TimetableOverview />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <NoticeWidget />
                    <EventWidget />
                </div>

                {/* Reports */}
                <ReportsAnalytics />

                {/* Calendar + Notices */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AcademicCalendar />
                    <NoticeManagement />
                </div>

                {/* Roles + Users */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RoleManagement />
                    <UserManagement />
                </div>

            </div>
        </DashboardLayout>
    );
}

export default AdminDashboard;