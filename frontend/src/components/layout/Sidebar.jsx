import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

function Sidebar({ closeSidebar }) {

    const { user } = useContext(AuthContext);

    return (
        <div className="w-64 h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-gray-300 fixed flex flex-col border-r border-slate-800 shadow-[4px_0_24px_rgb(0,0,0,0.2)] z-50 transition-transform duration-300">
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-bold text-sm">
                        E
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
                        EduSphere
                    </span>
                </div>
            </div>

            <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">

                <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Main Menu
                </div>

                {/* ================= STUDENT ================= */}
                {user?.role === "student" && (
                    <>
                        <SidebarItem to="/student/dashboard" label="Dashboard" />
                        <SidebarItem to="/student/profile" label="Profile" />
                        <SidebarItem to="/student/attendance" label="Attendance" />
                        <SidebarItem to="/student/timetable" label="Timetable" />
                        <SidebarItem to="/student/courses" label="My Courses" />
                        <SidebarItem to="/student/results" label="Results" />
                        <SidebarItem to="/student/notifications" label="Notifications" />
                        <SidebarItem to="/student/grievance" label="Grievance" />
                        <SidebarItem to="/student/gatepass/request" label="Request Gatepass" />
                        <SidebarItem to="/student/gatepass/status" label="Gatepass Status" />
                        <SidebarItem to="/student/gatepass/history" label="Gatepass History" />
                        <SidebarItem to="/student/course-registration" label="Course Registration" />
                        <SidebarItem to="/student/examination-form" label="Examination Form" />
                        <SidebarItem to="/student/exam-schedule" label="Exam Schedule" />
                        <SidebarItem to="/student/fee-payment" label="Fee Payment" />
                        <SidebarItem to="/student/fee-status" label="Fee Status" />
                        <SidebarItem to="/student/admit-card" label="My Admit Card" />
                        <SidebarItem to="/notices" label="Notice Board" />
                        <SidebarItem to="/events" label="Events" />
                    </>
                )}

                {/* ================= FACULTY ================= */}
                {user?.role === "faculty" && (
                    <>
                        <SidebarItem to="/faculty/dashboard" label="Dashboard" />
                        <SidebarItem to="/faculty/attendance" label="Attendance" />
                        <SidebarItem to="/faculty/multi-attendance" label="Multi-Lecture Attendance" />
                        <SidebarItem to="/faculty/timetable" label="My Timetable" />
                        <SidebarItem to="/faculty/courses" label="My Courses" />
                        <SidebarItem to="/faculty/marks" label="Marks" />
                        <SidebarItem to="/faculty/performance" label="Analytics" />
                        <SidebarItem to="/faculty/grievances" label="Grievances" />
                        <SidebarItem to="/notices" label="Notice Board" />
                        <SidebarItem to="/events" label="Events" />
                    </>
                )}

                {/* ================= ADMIN ================= */}
                {user?.role === "admin" && (
                    <>
                        <SidebarItem to="/admin/dashboard" label="Dashboard" />
                        <SidebarItem to="/admin/courses" label="Manage Courses" />
                        <SidebarItem to="/admin/users" label="Users" />
                        <SidebarItem to="/admin/roles" label="Roles" />
                        <SidebarItem to="/admin/calendar" label="Calendar" />
                        <SidebarItem to="/admin/manage-timetable" label="Manage Timetable" />
                        <SidebarItem to="/admin/notices" label="Notices" />
                        <SidebarItem to="/admin/reports" label="Reports" />
                        <SidebarItem to="/admin/create-notice" label="Create Notice" />
                        <SidebarItem to="/admin/create-event" label="Create Event" />
                        <SidebarItem to="/notices" label="Notice Board" />
                        <SidebarItem to="/events" label="Events" />
                    </>
                )}

                {/* ================= PARENT ================= */}
                {user?.role === "parent" && (
                    <>
                        <SidebarItem to="/parent/dashboard" label="Dashboard" />
                        <SidebarItem to="/parent/attendance" label="Ward Attendance" />
                        <SidebarItem to="/parent/gatepass" label="Gatepass Approval" />
                        <SidebarItem to="/parent/logs" label="In/Out Logs" />
                        <SidebarItem to="/parent/meeting" label="Schedule Meeting" />
                        <SidebarItem to="/notices" label="Notice Board" />
                        <SidebarItem to="/events" label="Events" />
                    </>
                )}

                {/* ================= WARDEN ================= */}
                {user?.role === "warden" && (
                    <>
                        <SidebarItem to="/warden/dashboard" label="Dashboard" />
                        <SidebarItem to="/warden/approvals" label="Final Approvals" />
                        <SidebarItem to="/warden/logs" label="Hostel Logs" />
                        <SidebarItem to="/warden/grievances" label="Hostel Grievances" />
                        <SidebarItem to="/notices" label="Notice Board" />
                        <SidebarItem to="/events" label="Events" />
                    </>
                )}

            </div>
        </div>
    );
}

function SidebarItem({ to, label }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive
                    ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-500/20"
                    : "hover:bg-slate-800 text-gray-300 font-medium hover:text-white"
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full transition-all ${isActive ? 'bg-white scale-100' : 'bg-slate-500 scale-0 group-hover:scale-100'}`}></div>
                        <span className="text-[14px]">{label}</span>
                    </div>
                    {isActive && <ChevronRightIcon className="w-4 h-4 text-white" />}
                </>
            )}
        </NavLink>
    );
}

export default Sidebar;