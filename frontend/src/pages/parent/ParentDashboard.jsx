import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import { useState } from "react";
import NoticeWidget from "../../components/common/NoticeWidget";
import EventWidget from "../../components/common/EventWidget";
function ParentDashboard() {

    const [pendingGatepass] = useState(2);
    const [attendance] = useState("82%");
    const [meetings] = useState("15 Feb 2026");

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn">

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="Ward Attendance" value={attendance} />
                    <StatCard title="Pending Gatepass" value={pendingGatepass} />
                    <StatCard title="Next Meeting" value={meetings} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <NoticeWidget />
                    <EventWidget />
                </div>
                {/* Gatepass Summary Section */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Recent Gatepass Requests
                    </h2>

                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Medical Visit</span>
                            <span className="text-yellow-500 font-medium">
                                Pending
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>Family Function</span>
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

export default ParentDashboard;