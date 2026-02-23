import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useEffect, useState } from "react";

function WardAttendance() {

    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Mock data (replace with API later)
        setTimeout(() => {
            try {
                setAttendance([
                    { subject: "Mathematics", percentage: 85 },
                    { subject: "Physics", percentage: 78 },
                    { subject: "Computer Science", percentage: 92 },
                ]);
                setLoading(false);
            } catch {
                setError("Failed to load attendance");
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
                    Ward Attendance Details
                </h2>

                <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b">
                            <tr className="text-gray-500 text-sm">
                                <th className="py-3">Subject</th>
                                <th>Attendance</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.map((item, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50 transition">
                                    <td className="py-3 font-medium">
                                        {item.subject}
                                    </td>
                                    <td>{item.percentage}%</td>
                                    <td>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                                            ${item.percentage < 75
                                                ? "bg-red-100 text-red-600"
                                                : "bg-green-100 text-green-600"}`}>
                                            {item.percentage < 75 ? "Low" : "Good"}
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

export default WardAttendance;