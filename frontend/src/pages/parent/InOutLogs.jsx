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

                <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
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

            </div>
        </DashboardLayout>
    );
}

export default InOutLogs;