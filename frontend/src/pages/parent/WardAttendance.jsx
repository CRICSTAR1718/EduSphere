import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getWardAttendance } from "../../services/parentService";

function WardAttendance() {
    const { user } = useAuth();
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAttendance = async () => {
            if (!user?.student) return;
            try {
                const data = await getWardAttendance(user.student);
                setAttendance(data || []);
            } catch (err) {
                console.error("Failed to fetch ward attendance:", err);
                setError("Failed to load attendance records.");
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, [user]);

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
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold text-slate-800">
                        Ward Attendance
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Subject-wise attendance breakdown for your ward.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {attendance.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            No attendance records found for your ward.
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto hidden md:block">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">Subject</th>
                                            <th className="px-6 py-4 text-center">Total Classes</th>
                                            <th className="px-6 py-4 text-center">Attended</th>
                                            <th className="px-6 py-4 text-center">Percentage</th>
                                            <th className="px-6 py-4 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {attendance.map((item, index) => (
                                            <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 font-semibold text-slate-800">
                                                    {item.subject}
                                                </td>
                                                <td className="px-6 py-4 text-center text-slate-600">
                                                    {item.totalClasses}
                                                </td>
                                                <td className="px-6 py-4 text-center text-slate-600">
                                                    {item.classesAttended}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`font-bold ${item.percentage < 75 ? 'text-red-600' : 'text-emerald-600'}`}>
                                                        {item.percentage}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold tracking-wide
                                                    ${item.percentage < 75
                                                            ? "bg-red-50 text-red-600 border border-red-100"
                                                            : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>
                                                        {item.percentage < 75 ? "LOW" : "GOOD"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card Layout */}
                            <div className="block md:hidden p-4 space-y-4">
                                {attendance.map((item, index) => (
                                    <div key={index} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-semibold text-slate-800 text-sm">
                                                    {item.subject}
                                                </h3>
                                            </div>
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold tracking-wide
                                            ${item.percentage < 75
                                                    ? "bg-red-50 text-red-600 border border-red-100"
                                                    : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>
                                                {item.percentage < 75 ? "LOW" : "GOOD"}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3 mb-3">
                                            <div className="bg-white rounded-lg p-3 border text-center">
                                                <p className="text-xs text-slate-500 mb-1">Total</p>
                                                <p className="font-medium text-slate-800 text-sm">{item.totalClasses}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 border text-center">
                                                <p className="text-xs text-slate-500 mb-1">Attended</p>
                                                <p className="font-medium text-slate-800 text-sm">{item.classesAttended}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 border text-center">
                                                <p className="text-xs text-slate-500 mb-1">Percentage</p>
                                                <p className={`font-bold text-sm ${item.percentage < 75 ? 'text-red-600' : 'text-emerald-600'}`}>
                                                    {item.percentage}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default WardAttendance;