import DashboardLayout from "../../components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { getWardGatepasses, updateWardGatepassStatus } from "../../services/parentService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

function GatepassApproval() {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRequests = async () => {
        try {
            if (user?.student) {
                const data = await getWardGatepasses(user.student);
                setRequests(data.gatepasses.filter(r => r.status === "pending_parent"));
            } else {
                setError("No linked student found for this parent account.");
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError("Failed to load gatepass requests");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchRequests();
        }
    }, [user]);

    const handleAction = async (id, status) => {
        try {
            await updateWardGatepassStatus(id, { status });
            toast.success(`Gatepass ${status.split("_")[0]} successfully`);
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
                <h2 className="text-xl font-semibold">Gatepass Approval Requests</h2>

                <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b">
                            <tr className="text-gray-500 text-sm">
                                <th className="py-3">Student</th>
                                <th>Type</th>
                                <th>Reason</th>
                                <th>Out Date</th>
                                <th>In Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req._id} className="border-b hover:bg-gray-50 transition">
                                    <td className="py-3 font-medium">{req.student?.name}</td>
                                    <td className="capitalize">{req.type}</td>
                                    <td>{req.reason}</td>
                                    <td>{new Date(req.outDate).toLocaleString()}</td>
                                    <td>{new Date(req.inDate).toLocaleString()}</td>
                                    <td className="space-x-2">
                                        <button 
                                            onClick={() => handleAction(req._id, "approved_by_parent")}
                                            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-sm"
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => handleAction(req._id, "rejected_by_parent")}
                                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="py-4 text-center text-gray-500">No pending approval requests.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default GatepassApproval;