import DashboardLayout from "../../components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import { getStudentGatepasses } from "../../services/studentService";

function GatepassHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getStudentGatepasses();
                setHistory(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch history:", error);
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const getStatusStyles = (status) => {
        switch (status) {
            case "approved_by_warden":
                return "bg-green-100 text-green-600";
            case "rejected_by_parent":
            case "rejected_by_warden":
                return "bg-red-100 text-red-600";
            case "pending_parent":
            case "approved_by_parent":
                return "bg-yellow-100 text-yellow-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const getStatusLabel = (status) => {
        return status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    };

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
                <h2 className="text-xl font-semibold">Gatepass History</h2>

                <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b">
                            <tr className="text-gray-500 text-sm">
                                <th className="py-3">Type</th>
                                <th>Reason</th>
                                <th>Out Date</th>
                                <th>In Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item) => (
                                <tr key={item._id} className="border-b hover:bg-gray-50 transition">
                                    <td className="py-3 capitalize">{item.type}</td>
                                    <td>{item.reason}</td>
                                    <td>{new Date(item.outDate).toLocaleDateString()}</td>
                                    <td>{new Date(item.inDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(item.status)}`}>
                                            {getStatusLabel(item.status)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {history.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-4 text-center text-gray-500">No gatepass history found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default GatepassHistory;