import DashboardLayout from "../../components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import { getStudentGatepasses } from "../../services/studentService";

function GatepassStatus() {
    const [latestPass, setLatestPass] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const data = await getStudentGatepasses();
                if (data && data.length > 0) {
                    setLatestPass(data[0]);
                }
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch status:", error);
                setLoading(false);
            }
        };
        fetchStatus();
    }, []);

    const getStatusLabel = (status) => {
        switch (status) {
            case "pending_parent": return { label: "Awaiting Parent Approval", color: "bg-yellow-100 text-yellow-600" };
            case "approved_by_parent": return { label: "Awaiting Warden Approval", color: "bg-blue-100 text-blue-600" };
            case "rejected_by_parent": return { label: "Rejected by Parent", color: "bg-red-100 text-red-600" };
            case "approved_by_warden": return { label: "Approved by Warden", color: "bg-green-100 text-green-600" };
            case "rejected_by_warden": return { label: "Rejected by Warden", color: "bg-red-100 text-red-600" };
            default: return { label: status, color: "bg-gray-100 text-gray-600" };
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <Loader />
            </DashboardLayout>
        );
    }

    if (!latestPass) {
        return (
            <DashboardLayout>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <p className="text-gray-500">No active gatepass requests found.</p>
                </div>
            </DashboardLayout>
        );
    }

    const parentStatus = latestPass.status === "pending_parent" ? "Pending" : 
                       (latestPass.status === "rejected_by_parent" ? "Rejected" : "Approved");
    
    const wardenStatus = (latestPass.status === "pending_parent" || latestPass.status === "approved_by_parent") ? "Pending" :
                        (latestPass.status === "rejected_by_parent" ? "N/A" :
                        (latestPass.status === "rejected_by_warden" ? "Rejected" : "Approved"));

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn">
                <h2 className="text-xl font-semibold">Current Gatepass Status</h2>

                <div className="bg-white rounded-xl shadow-md p-6 space-y-4 max-w-xl">
                    <p><strong>Type:</strong> {latestPass.type.charAt(0).toUpperCase() + latestPass.type.slice(1)}</p>
                    <p><strong>Reason:</strong> {latestPass.reason}</p>
                    <p><strong>Out Date:</strong> {new Date(latestPass.outDate).toLocaleString()}</p>
                    <p><strong>In Date:</strong> {new Date(latestPass.inDate).toLocaleString()}</p>

                    <div className="pt-4 border-t space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Parent Approval Status</span>
                            <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                parentStatus === "Approved" ? "bg-green-100 text-green-600" :
                                parentStatus === "Rejected" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"
                            }`}>
                                {parentStatus}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Warden Approval Status</span>
                            <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                wardenStatus === "Approved" ? "bg-green-100 text-green-600" :
                                wardenStatus === "Rejected" ? "bg-red-100 text-red-600" : 
                                wardenStatus === "N/A" ? "bg-gray-100 text-gray-400" : "bg-yellow-100 text-yellow-600"
                            }`}>
                                {wardenStatus}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 text-center">
                            Overall Status: {getStatusLabel(latestPass.status).label}
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default GatepassStatus;