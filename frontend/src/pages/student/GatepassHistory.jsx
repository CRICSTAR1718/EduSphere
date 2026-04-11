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

    const getParentStatus = (status) => {
        if (status === "pending_parent") return { label: "Pending", style: "bg-yellow-100 text-yellow-700 border border-yellow-200" };
        if (status === "rejected_by_parent") return { label: "Rejected", style: "bg-red-100 text-red-700 border border-red-200" };
        // For approved_by_parent, approved_by_warden, rejected_by_warden
        return { label: "Approved", style: "bg-green-100 text-green-700 border border-green-200" }; 
    };

    const getWardenStatus = (status) => {
        if (status === "pending_parent") return { label: "Waiting for Parent", style: "bg-slate-100 text-slate-500 border border-slate-200" };
        if (status === "rejected_by_parent") return { label: "N/A", style: "bg-slate-100 text-slate-500 border border-slate-200" };
        if (status === "approved_by_parent") return { label: "Pending", style: "bg-yellow-100 text-yellow-700 border border-yellow-200" };
        if (status === "approved_by_warden") return { label: "Approved", style: "bg-green-100 text-green-700 border border-green-200" };
        if (status === "rejected_by_warden") return { label: "Rejected", style: "bg-red-100 text-red-700 border border-red-200" };
        return { label: "Unknown", style: "bg-slate-100 text-slate-600 border border-slate-200" };
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
                                <th>Parent Approval</th>
                                <th>Warden Approval</th>
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
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getParentStatus(item.status).style}`}>
                                            {getParentStatus(item.status).label}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getWardenStatus(item.status).style}`}>
                                            {getWardenStatus(item.status).label}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {history.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="py-4 text-center text-gray-500">No gatepass history found.</td>
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