import DashboardLayout from "../../components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";

function GatepassHistory() {

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setHistory([
                {
                    id: 1,
                    reason: "Medical Visit",
                    date: "12 Jan 2026",
                    status: "Approved"
                },
                {
                    id: 2,
                    reason: "Family Function",
                    date: "20 Jan 2026",
                    status: "Rejected"
                }
            ]);
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
                    Gatepass History
                </h2>

                <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b">
                            <tr className="text-gray-500 text-sm">
                                <th className="py-3">Reason</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="py-3">{item.reason}</td>
                                    <td>{item.date}</td>
                                    <td>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                                            ${item.status === "Approved"
                                                ? "bg-green-100 text-green-600"
                                                : "bg-red-100 text-red-600"
                                            }`}>
                                            {item.status}
                                        </span>
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

export default GatepassHistory;