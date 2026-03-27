import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useEffect, useState } from "react";
import { getGatepasses, updateGatepassStatus } from "../../services/wardenService";
import { toast } from "react-toastify";

function FinalGatepassApproval() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRequests = async () => {
        try {
            const data = await getGatepasses({ status: "approved_by_parent" });
            setRequests(data.gatepasses);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError("Failed to load gatepass requests");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id, status) => {
        try {
            await updateGatepassStatus(id, { status });
            toast.success(`Gatepass ${status === 'approved_by_warden' ? 'approved' : 'rejected'} successfully`);
            fetchRequests(); // Refresh list
        } catch (err) {
            toast.error(err.response?.data?.message || "Action failed");
        }
    };

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
                <h2 className="text-xl font-semibold">Final Gatepass Approvals</h2>

                <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b">
                            <tr className="text-gray-500 text-sm">
                                <th className="py-3">Student</th>
                                <th>Reason</th>
                                <th>Out Date</th>
                                <th>In Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req._id} className="border-b hover:bg-gray-50 transition">
                                    <td className="py-3 font-medium">
                                        {req.student?.name}
                                        <span className="block text-xs text-gray-400">{req.student?.enrollmentNo}</span>
                                    </td>
                                    <td>{req.reason}</td>
                                    <td>{new Date(req.outDate).toLocaleString()}</td>
                                    <td>{new Date(req.inDate).toLocaleString()}</td>
                                    <td className="space-x-2">
                                        <button 
                                            onClick={() => handleAction(req._id, "approved_by_warden")}
                                            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-sm"
                                        >
                                            Final Approve
                                        </button>
                                        <button 
                                            onClick={() => handleAction(req._id, "rejected_by_warden")}
                                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-4 text-center text-gray-500">No pending final approvals.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default FinalGatepassApproval;