import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import { useState } from "react";
import NoticeWidget from "../../components/common/NoticeWidget";
import EventWidget from "../../components/common/EventWidget";
function WardenDashboard() {

    const [pendingFinal] = useState(3);
    const [grievances] = useState(1);

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn">

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    <StatCard title="Pending Final Approvals" value={pendingFinal} />
                    <StatCard title="Hostel Grievances" value={grievances} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <NoticeWidget />
                    <EventWidget />
                </div>
                {/* Approval Section */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Recent Gatepass Requests
                    </h2>

                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Aman Verma - Medical</span>
                            <span className="text-yellow-500 font-medium">
                                Pending
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>Rahul Singh - Home Visit</span>
                            <span className="text-green-600 font-medium">
                                Approved
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}

export default WardenDashboard;