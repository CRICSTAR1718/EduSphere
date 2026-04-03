import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useEffect, useState } from "react";

function HostelGrievances() {

    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            try {
                setGrievances([
                    {
                        id: 1,
                        student: "Aman Verma",
                        issue: "Water leakage in room",
                        date: "10 Feb 2026",
                        status: "Pending"
                    },
                    {
                        id: 2,
                        student: "Rahul Singh",
                        issue: "WiFi not working",
                        date: "12 Feb 2026",
                        status: "Resolved"
                    }
                ]);
                setLoading(false);
            } catch {
                setError("Failed to load hostel grievances");
                setLoading(false);
            }
        }, 800);
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

                <h2 className="text-xl font-semibold">
                    Hostel Grievances
                </h2>

                <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto hidden md:block">
                    <table className="w-full text-left">
                        <thead className="border-b">
                            <tr className="text-gray-500 text-sm">
                                <th className="py-3">Student</th>
                                <th>Issue</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grievances.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="py-3 font-medium">
                                        {item.student}
                                    </td>
                                    <td>{item.issue}</td>
                                    <td>{item.date}</td>
                                    <td>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                                            ${item.status === "Pending"
                                                ? "bg-yellow-100 text-yellow-600"
                                                : "bg-green-100 text-green-600"
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm">
                                            Mark Resolved
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card Layout */}
                <div className="block md:hidden space-y-4">
                    {grievances.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-md p-4 border border-slate-100">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-semibold text-slate-800 text-sm">
                                        {item.student}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">{item.date}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium
                                    ${item.status === "Pending"
                                        ? "bg-yellow-100 text-yellow-600"
                                        : "bg-green-100 text-green-600"
                                    }`}>
                                    {item.status}
                                </span>
                            </div>

                            <div className="mb-3">
                                <p className="text-xs text-slate-500 mb-2">Issue</p>
                                <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3">{item.issue}</p>
                            </div>

                            <div className="flex justify-end">
                                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-sm font-medium">
                                    Mark Resolved
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </DashboardLayout>
    );
}

export default HostelGrievances;