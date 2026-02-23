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

                <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
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

            </div>
        </DashboardLayout>
    );
}

export default HostelGrievances;