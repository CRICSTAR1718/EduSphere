import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getStudentAttendance } from "../../services/studentService";

function Attendance() {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const data = await getStudentAttendance();
                setAttendance(data);
            } catch (error) {
                console.error("Error fetching attendance:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, []);

    return (
        <DashboardLayout>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-fadeIn">
                <div className="p-4 sm:p-6 border-b bg-slate-50">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                        Detailed Attendance Record
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Track your subject-wise presence across the semester.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th className="p-3 sm:p-4 text-left font-semibold uppercase tracking-wider">Subject</th>
                                <th className="p-3 sm:p-4 text-center font-semibold uppercase tracking-wider">Total Classes</th>
                                <th className="p-3 sm:p-4 text-center font-semibold uppercase tracking-wider">Attended</th>
                                <th className="p-3 sm:p-4 text-right font-semibold uppercase tracking-wider">Percentage (%)</th>
                            </tr>
                        </thead>

                        <tbody className="text-gray-700 divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-8 sm:p-12 text-center text-slate-400">
                                        Loading academic records...
                                    </td>
                                </tr>
                            ) : attendance.length > 0 ? (
                                attendance.map((row, idx) => (
                                    <AttendanceRow
                                        key={idx}
                                        subject={row.subject}
                                        held={row.totalClasses}
                                        attended={row.classesAttended}
                                        percent={`${row.percentage}%`}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-8 sm:p-12 text-center text-slate-400">
                                        No attendance records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card Layout */}
                <div className="block md:hidden p-4 space-y-4">
                    {loading ? (
                        <div className="text-center py-8 text-slate-400">
                            Loading academic records...
                        </div>
                    ) : attendance.length > 0 ? (
                        attendance.map((row, idx) => (
                            <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <h3 className="font-semibold text-slate-800 mb-3 text-sm">
                                    {row.subject}
                                </h3>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div className="bg-white rounded-lg p-3 border text-center">
                                        <p className="text-xs text-slate-500 mb-1">Total Classes</p>
                                        <p className="font-bold text-slate-800 text-lg">{row.totalClasses}</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border text-center">
                                        <p className="text-xs text-slate-500 mb-1">Attended</p>
                                        <p className="font-bold text-slate-800 text-lg">{row.classesAttended}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-600">Attendance:</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${row.percentage < 75 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                                        }`}>
                                        {row.percentage}%
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-slate-400">
                            No attendance records found.
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

function AttendanceRow({ subject, held, attended, percent }) {
    const isLow = parseFloat(percent) < 75;

    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="p-3 sm:p-4 font-medium text-slate-800">{subject}</td>
            <td className="p-3 sm:p-4 text-center">{held}</td>
            <td className="p-3 sm:p-4 text-center">{attended}</td>
            <td className={`p-3 sm:p-4 text-right font-bold ${isLow ? 'text-red-500' : 'text-indigo-600'}`}>
                {percent}
            </td>
        </tr>
    );
}

export default Attendance;