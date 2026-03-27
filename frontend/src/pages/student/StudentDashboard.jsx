import { useEffect, useState, useContext } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import AttendanceChart from "../../components/student/AttendanceChart";
import AttendanceTable from "../../components/student/AttendanceTable";
import GrievanceForm from "../../components/student/GrievanceForm";
import GrievanceStatus from "../../components/student/GrievanceStatus";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import NoticeWidget from "../../components/common/NoticeWidget";
import EventWidget from "../../components/common/EventWidget"; 
import AttendanceWarningBanner from "../../components/student/AttendanceWarningBanner";
import { getStudentDashboardStats, getStudentGrievances, submitGrievance as submitGrievanceApi, getStudentTimetable } from "../../services/studentService";
import { AuthContext } from "../../context/AuthContext";

function StudentDashboard() {
    const [stats, setStats] = useState({
        overallAttendance: "0%",
        avgGPA: "0.0",
        pendingGrievances: 0,
        subjectAttendance: []
    });
    const [grievances, setGrievances] = useState([]);
    const [todayClasses, setTodayClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    const processStats = (data) => {
        if (!data) {
            return {
                overallAttendance: "0%",
                avgGPA: "0.0",
                pendingGrievances: 0,
                subjectAttendance: []
            };
        }
        return data;
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Ensure user context is available before making requests that depend on it
                const [statsData, grievancesData, timetableData] = await Promise.all([
                    getStudentDashboardStats(),
                    getStudentGrievances(),
                    getStudentTimetable({ department: user?.department, semester: user?.semester })
                ]);
                
                setStats(processStats(statsData));
                setGrievances(grievancesData);

                // Filter for today's classes
                const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                const today = days[new Date().getDay()];
                const todaysLectures = (timetableData || []).filter(t => t.day === today);
                todaysLectures.sort((a, b) => a.startTime.localeCompare(b.startTime));
                setTodayClasses(todaysLectures);

            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError("Failed to load dashboard data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const handleGrievanceSubmit = async (message) => {
        try {
            await submitGrievanceApi({ 
                subject: "General Grievance", 
                description: message 
            });
            // Refresh grievances after submission
            const updatedGrievances = await getStudentGrievances();
            setGrievances(updatedGrievances);
            
            // Refresh stats for pending count
            const updatedStats = await getStudentDashboardStats();
            setStats(processStats(updatedStats));
        } catch (err) {
            console.error("Failed to submit grievance:", err);
        }
    };

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

    const numericAverage = parseInt(stats.overallAttendance);

    return (
        <DashboardLayout>
            <div className="p-4 sm:p-8 space-y-8 animate-fadeIn">
                <AttendanceWarningBanner average={numericAverage} />
                
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="Overall Attendance" value={stats.overallAttendance} />
                    <StatCard title="Current GPA" value={stats.avgGPA} />
                    <StatCard title="Pending Grievances" value={stats.pendingGrievances} />
                </div>
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h3 className="font-semibold mb-4 text-slate-800">Today's Schedule</h3>
                    {todayClasses.length > 0 ? (
                        <div className="space-y-4">
                            {todayClasses.map((lecture, index) => (
                                <div key={index} className="flex justify-between items-center text-sm border-b pb-3 last:border-0 last:pb-0">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-800 text-base">{lecture.course?.title || "Unknown Subject"}</span>
                                        <span className="text-slate-500 mt-1">
                                            Room: <span className="font-medium text-slate-700">{lecture.roomContext || "TBA"}</span> | Faculty: <span className="font-medium text-slate-700">{lecture.course?.faculty?.name || "TBA"}</span>
                                        </span>
                                    </div>
                                    <span className="text-indigo-700 font-bold bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg whitespace-nowrap">
                                        {lecture.startTime} - {lecture.endTime}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-slate-400">
                            <span className="text-3xl mb-2">🎉</span>
                            <p className="italic">No lectures scheduled for today. Enjoy your day!</p>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <NoticeWidget />
                    <EventWidget />
                </div>



                {/* Attendance Visualization */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-800">Attendance Analysis</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AttendanceChart attendance={stats.subjectAttendance} />
                        <AttendanceTable attendance={stats.subjectAttendance} />
                    </div>
                </div>

                {/* Grievance Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GrievanceForm onSubmit={handleGrievanceSubmit} />
                    <GrievanceStatus grievances={grievances} />
                </div>
            </div>
        </DashboardLayout>
    );
}

export default StudentDashboard;