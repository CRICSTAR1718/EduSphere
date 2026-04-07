import DashboardLayout from "../../components/layout/DashboardLayout";
import WelcomeBanner from "../../components/common/WelcomeBanner";
import StatCard from "../../components/common/StatCard";
import { useState, useEffect } from "react";
import NoticeWidget from "../../components/common/NoticeWidget";
import EventWidget from "../../components/common/EventWidget";
import { getWardenDashboardStats } from "../../services/wardenService";
import { toast } from "react-toastify";


function WardenDashboard() {
    const [stats, setStats] = useState({
        pendingGatepasses: 0,
        approvedGatepasses: 0,
        hostelGrievances: 0,
        totalHostelers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getWardenDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Error fetching warden stats:", error);
                toast.error("Failed to load dashboard statistics");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn p-4 sm:p-8">
                <WelcomeBanner role="Warden" />

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    <StatCard 
                        title="Pending Final Approvals" 
                        value={loading ? "..." : stats.pendingGatepasses} 
                    />
                    <StatCard 
                        title="Hostel Grievances" 
                        value={loading ? "..." : stats.hostelGrievances} 
                    />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <NoticeWidget />
                    <EventWidget />
                </div>

                {/* Approval Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold mb-4 dark:text-white">
                        Recent Gatepass Requests
                    </h2>

                    <div className="space-y-3 text-sm text-gray-600">
                        {loading ? (
                            <p>Loading requests...</p>
                        ) : stats.recentRequests?.length > 0 ? (
                            stats.recentRequests.map((request) => (
                                <div key={request._id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 dark:border-slate-700">
                                    <div className="flex flex-col">
                                        <span className="font-medium dark:text-gray-200">
                                            {request.student?.name || "Unknown Student"}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {request.type === "home" ? "Home Visit" : "Outing"} - {request.reason}
                                        </span>
                                    </div>
                                    <span className={`font-medium px-2 py-1 rounded-full text-[10px] uppercase ${
                                        request.status === "approved_by_warden" ? "text-green-600 bg-green-50 dark:bg-green-900/20" :
                                        request.status === "approved_by_parent" ? "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20" :
                                        "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                                    }`}>
                                        {request.status.split("_").join(" ")}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center py-4 text-slate-400">No recent requests found</p>
                        )}
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}

export default WardenDashboard;