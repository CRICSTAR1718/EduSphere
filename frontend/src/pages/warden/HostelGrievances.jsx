import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { getGrievances, respondToGrievance } from "../../services/wardenService";

function HostelGrievances() {
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [respondingId, setRespondingId] = useState(null);
    const [responseMsg, setResponseMsg] = useState("");

    const fetchGrievances = async () => {
        try {
            const data = await getGrievances();
            setGrievances(data.grievances);
            setLoading(false);
        } catch (err) {
            setError("Failed to load hostel grievances");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGrievances();
    }, []);

    const handleResolve = async (id) => {
        if (!responseMsg) {
            alert("Please provide a response before resolving.");
            return;
        }
        try {
            await respondToGrievance(id, { response: responseMsg, status: "resolved" });
            setRespondingId(null);
            setResponseMsg("");
            fetchGrievances();
        } catch (err) {
            alert("Failed to update grievance");
        }
    };

    if (loading) return <DashboardLayout><Loader /></DashboardLayout>;
    if (error) return <DashboardLayout><ErrorMessage message={error} /></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn">
                <h2 className="text-xl font-semibold">
                    Hostel Grievances
                </h2>

                <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto hidden md:block">
                    <table className="w-full text-left">
                        <thead className="border-b text-gray-500 text-sm">
                            <tr>
                                <th className="py-3">Student</th>
                                <th>Subject</th>
                                <th>Description</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th className="text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grievances.length > 0 ? grievances.map((item) => (
                                <tr key={item._id} className="border-b hover:bg-gray-50 transition text-sm">
                                    <td className="py-4">
                                        <div className="font-medium text-slate-800">{item.student?.name}</div>
                                        <div className="text-[10px] text-slate-500">{item.student?.enrollmentNo}</div>
                                    </td>
                                    <td className="font-semibold text-slate-700">{item.subject}</td>
                                    <td className="text-slate-500 max-w-xs truncate" title={item.description}>{item.description}</td>
                                    <td className="text-slate-500 italic">{new Date(item.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase
                                            ${item.status === "pending"
                                                ? "bg-yellow-100 text-yellow-600"
                                                : "bg-green-100 text-green-600"
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        {item.status === "pending" ? (
                                            respondingId === item._id ? (
                                                <div className="flex flex-col items-end gap-2">
                                                    <textarea 
                                                        className="border rounded p-2 text-xs w-48 outline-none focus:ring-1 focus:ring-indigo-500"
                                                        placeholder="Warden response..."
                                                        value={responseMsg}
                                                        onChange={(e) => setResponseMsg(e.target.value)}
                                                    />
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => handleResolve(item._id)}
                                                            className="bg-indigo-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-indigo-700 transition"
                                                        >
                                                            Resolve
                                                        </button>
                                                        <button 
                                                            onClick={() => setRespondingId(null)}
                                                            className="bg-slate-200 text-slate-700 px-3 py-1 rounded text-xs font-semibold hover:bg-slate-300 transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => setRespondingId(item._id)}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-xs font-semibold"
                                                >
                                                    Handle
                                                </button>
                                            )
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">Resolved</span>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-slate-400">No hostel grievances found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card Layout */}
                <div className="block md:hidden space-y-4">
                    {grievances.map((item) => (
                        <div key={item._id} className="bg-white rounded-xl shadow-md p-4 border border-slate-100">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-semibold text-slate-800 text-sm">
                                        {item.student?.name}
                                    </h3>
                                    <p className="text-[10px] text-slate-500 mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase
                                    ${item.status === "pending"
                                        ? "bg-yellow-100 text-yellow-600"
                                        : "bg-green-100 text-green-600"
                                    }`}>
                                    {item.status}
                                </span>
                            </div>

                            <div className="mb-3">
                                <p className="text-xs font-bold text-slate-500 mb-1">{item.subject}</p>
                                <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3">{item.description}</p>
                            </div>

                            <div className="flex justify-end">
                                {item.status === "pending" ? (
                                    respondingId === item._id ? (
                                        <div className="flex flex-col items-end gap-2 w-full">
                                            <textarea 
                                                className="border rounded p-2 text-xs w-full bg-slate-50 outline-none"
                                                placeholder="Write response..."
                                                value={responseMsg}
                                                onChange={(e) => setResponseMsg(e.target.value)}
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={() => setRespondingId(null)} className="text-xs text-slate-500">Cancel</button>
                                                <button onClick={() => handleResolve(item._id)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold">Mark Resolved</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button onClick={() => setRespondingId(item._id)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-sm font-medium">
                                            Handle
                                        </button>
                                    )
                                ) : (
                                    <span className="text-xs text-slate-400 italic">Resolved</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default HostelGrievances;