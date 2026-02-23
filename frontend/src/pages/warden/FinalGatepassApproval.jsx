import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useEffect, useState } from "react";

function FinalGatepassApproval() {

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Mock API simulation
        setTimeout(() => {
            try {
                setRequests([
                    { id: 1, student: "Aman Verma", reason: "Medical Visit", status: "Pending" },
                    { id: 2, student: "Rahul Singh", reason: "Home Visit", status: "Pending" },
                ]);
                setLoading(false);
            } catch {
                setError("Failed to load gatepass requests");
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
                    Final Gatepass Approvals
                </h2>

                <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b">
                            <tr className="text-gray-500 text-sm">
                                <th className="py-3">Student</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="py-3 font-medium">
                                        {req.student}
                                    </td>
                                    <td>{req.reason}</td>
                                    <td>
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="space-x-2">
                                        <button className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-sm">
                                            Approve
                                        </button>
                                        <button className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm">
                                            Reject
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

export default FinalGatepassApproval;