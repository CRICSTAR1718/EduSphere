import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";
import { useEffect, useState } from "react";

function HostelLogs() {

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLogs([
                {
                    id: 1,
                    student: "Aman Verma",
                    outTime: "10:00 AM",
                    inTime: "4:00 PM",
                    date: "10 Feb 2026",
                    status: "Returned"
                },
                {
                    id: 2,
                    student: "Rahul Singh",
                    outTime: "2:00 PM",
                    inTime: "-",
                    date: "12 Feb 2026",
                    status: "Out"
                }
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

                <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b">
                            <tr className="text-gray-500 text-sm">
                                <th className="py-3">Student</th>
                                <th>Date</th>
                                <th>Out Time</th>
                                <th>In Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="py-3 font-medium">
                                        {log.student}
                                    </td>
                                    <td>{log.date}</td>
                                    <td>{log.outTime}</td>
                                    <td>{log.inTime}</td>
                                    <td>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                                            ${log.status === "Out"
                                                ? "bg-red-100 text-red-600"
                                                : "bg-green-100 text-green-600"
                                            }`}>
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </DashboardLayout>
    );
}

export default HostelLogs;