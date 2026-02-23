import DashboardLayout from "../../components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";

function GatepassStatus() {

    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setStatus({
                reason: "Medical Visit",
                date: "12 Feb 2026",
                parentApproval: "Approved",
                wardenApproval: "Pending"
            });
            setLoading(false);
        }, 800);
    }, []);

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

                <h2 className="text-xl font-semibold">
                    Current Gatepass Status
                </h2>

                <div className="bg-white rounded-xl shadow-md p-6 space-y-4 max-w-xl">

                    <p><strong>Reason:</strong> {status.reason}</p>
                    <p><strong>Date:</strong> {status.date}</p>

                    <div className="flex justify-between">
                        <span>Parent Approval</span>
                        <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">
                            {status.parentApproval}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>Warden Approval</span>
                        <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">
                            {status.wardenApproval}
                        </span>
                    </div>

                </div>

            </div>
        </DashboardLayout>
    );
}

export default GatepassStatus;