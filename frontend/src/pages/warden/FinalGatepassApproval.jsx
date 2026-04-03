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

                <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto hidden md:block">
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

                {/* Mobile Card Layout */}
                <div className="block md:hidden space-y-4">
                    {requests.map((req) => (
                        <div key={req._id} className="bg-white rounded-xl shadow-md p-4 border border-slate-100">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-semibold text-slate-800 text-sm">
                                        {req.student?.name}
                                    </h3>
                                    <p className="text-xs text-indigo-600 font-bold mt-1">{req.student?.enrollmentNo}</p>
                                </div>
                            </div>

                            <div className="mb-3">
                                <p className="text-xs text-slate-500 mb-2">Reason</p>
                                <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3">{req.reason}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div className="bg-slate-50 rounded-lg p-3">
                                    <p className="text-xs text-slate-500 mb-1">Out Date</p>
                                    <p className="font-medium text-slate-800 text-sm">{new Date(req.outDate).toLocaleString()}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3">
                                    <p className="text-xs text-slate-500 mb-1">In Date</p>
                                    <p className="font-medium text-slate-800 text-sm">{new Date(req.inDate).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAction(req._id, "approved_by_warden")}
                                    className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all text-sm font-medium"
                                >
                                    Final Approve
                                </button>
                                <button
                                    onClick={() => handleAction(req._id, "rejected_by_warden")}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-medium"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                    {requests.length === 0 && (
                        <div className="bg-white rounded-xl shadow-md p-8 text-center text-slate-500">
                            No pending final approvals.
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default FinalGatepassApproval;