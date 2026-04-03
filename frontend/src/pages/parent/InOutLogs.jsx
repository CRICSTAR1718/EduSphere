import DashboardLayout from "../../components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";

function InOutLogs() {

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLogs([
                { id: 1, date: "10 Feb 2026", out: "10:00 AM", in: "4:00 PM" },
                { id: 2, date: "12 Feb 2026", out: "2:00 PM", in: "6:30 PM" }
            ]);
            setLoading(false);
        }, 800);
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <Loader />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn">

                <h2 className="text-xl font-semibold">
                    Hostel In/Out Logs
                </h2>

                <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto hidden md:block">
                    <table className="w-full text-left">
                        <thead className="border-b">
                            <tr className="text-gray-500 text-sm">
                                <th className="py-3">Date</th>
                                <th>Out Time</th>
                                <th>In Time</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="py-3">{log.date}</td>
                                    <td>{log.out}</td>
                                    <td>{log.in}</td>
                                    <td className="text-indigo-600 font-medium">
                                        6 hrs
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card Layout */}
                <div className="block md:hidden space-y-4">
                    {logs.map((log) => (
                        <div key={log.id} className="bg-white rounded-xl shadow-md p-4 border border-slate-100">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-semibold text-slate-800 text-sm">
                                        {log.date}
                                    </h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-slate-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-slate-500 mb-1">Out Time</p>
                                    <p className="font-medium text-slate-800 text-sm">{log.out}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-slate-500 mb-1">In Time</p>
                                    <p className="font-medium text-slate-800 text-sm">{log.in}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-slate-500 mb-1">Duration</p>
                                    <p className="font-medium text-indigo-600 text-sm">6 hrs</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </DashboardLayout>
    );
}

export default InOutLogs;