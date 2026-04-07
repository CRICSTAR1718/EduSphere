import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { submitGrievance, getStudentGrievances, getGrievanceReceivers } from "../../services/studentService";

function Grievance() {
    const [grievances, setGrievances] = useState([]);
    const [assignedTo, setAssignedTo] = useState("");
    const [assignedToRole, setAssignedToRole] = useState("faculty"); // Added this
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [receivers, setReceivers] = useState({ faculties: [], wardens: [] });
    const [fetchingReceivers, setFetchingReceivers] = useState(true);

    const fetchGrievances = async () => {
        try {
            const data = await getStudentGrievances();
            console.log("Fetched Student Grievances:", data);
            setGrievances(data);
        } catch (error) {
            console.error("Error fetching grievances:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReceivers = async () => {
        try {
            const data = await getGrievanceReceivers();
            console.log("Fetched Receivers:", data);
            setReceivers(data);
            // Default select the first one if available
            if (assignedToRole === "faculty" && data.faculties.length > 0) {
                setAssignedTo(data.faculties[0].name);
            } else if (assignedToRole === "warden" && data.wardens.length > 0) {
                setAssignedTo(data.wardens[0].name);
            }
        } catch (error) {
            console.error("Error fetching receivers:", error);
        } finally {
            setFetchingReceivers(false);
        }
    };

    useEffect(() => {
        fetchGrievances();
        fetchReceivers();
    }, []);

    // Update default selection when role changes
    useEffect(() => {
        if (assignedToRole === "faculty" && receivers.faculties.length > 0) {
            setAssignedTo(receivers.faculties[0].name);
        } else if (assignedToRole === "warden" && receivers.wardens.length > 0) {
            setAssignedTo(receivers.wardens[0].name);
        } else {
            setAssignedTo("");
        }
    }, [assignedToRole, receivers]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccessMessage("");

        try {
            await submitGrievance({ 
                subject, 
                description, 
                assignedTo: assignedTo.trim(), 
                assignedToRole 
            });
            setSuccessMessage("Your grievance has been submitted successfully.");
            setSubject("");
            setDescription("");
            fetchGrievances(); // Refresh list
        } catch (error) {
            console.error("Error submitting grievance:", error);
            alert("Failed to submit grievance. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
                {/* Submit Form */}
                <div className="bg-white rounded-2xl shadow-md p-8 h-fit">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">
                        New Support Request / Grievance
                    </h2>

                    {successMessage && (
                        <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                            <span>✅</span> {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 text-center">I am writing to a:</label>
                                <div className="flex justify-center space-x-6">
                                    <label className={`flex items-center space-x-2 cursor-pointer p-2 rounded-lg border transition-all ${assignedToRole === "faculty" ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-500"}`}>
                                        <input 
                                            type="radio" 
                                            name="role" 
                                            value="faculty" 
                                            checked={assignedToRole === "faculty"}
                                            onChange={(e) => setAssignedToRole(e.target.value)}
                                            className="hidden"
                                        />
                                        <span className="text-sm font-bold uppercase tracking-wider">Faculty Member</span>
                                    </label>
                                    <label className={`flex items-center space-x-2 cursor-pointer p-2 rounded-lg border transition-all ${assignedToRole === "warden" ? "border-rose-500 bg-rose-50 text-rose-700" : "border-slate-200 text-slate-500"}`}>
                                        <input 
                                            type="radio" 
                                            name="role" 
                                            value="warden" 
                                            checked={assignedToRole === "warden"}
                                            onChange={(e) => setAssignedToRole(e.target.value)}
                                            className="hidden"
                                        />
                                        <span className="text-sm font-bold uppercase tracking-wider">Hostel Warden</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    {assignedToRole === "faculty" ? "Select Faculty" : "Select Warden"}
                                </label>
                                {fetchingReceivers ? (
                                    <div className="text-xs text-slate-400">Loading options...</div>
                                ) : (
                                    <select
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={assignedTo}
                                        onChange={(e) => setAssignedTo(e.target.value)}
                                        required
                                    >
                                        <option value="">-- Choose Recipient --</option>
                                        {assignedToRole === "faculty" 
                                            ? receivers.faculties.map(f => (
                                                <option key={f._id} value={f.name}>{f.name} ({f.department})</option>
                                            ))
                                            : receivers.wardens.map(w => (
                                                <option key={w._id} value={w.name}>{w.name}</option>
                                            ))
                                        }
                                    </select>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Issue Subject</label>
                            <input
                                type="text"
                                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="e.g., Marks Discrepancy, Library Access"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Description</label>
                            <textarea
                                rows="5"
                                className="w-full border border-slate-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Describe your issue in detail..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md hover:shadow-lg w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Grievance"}
                        </button>
                    </form>
                </div>

                {/* History List */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="p-6 border-b bg-slate-50">
                        <h2 className="text-xl font-bold text-slate-800">My Requests History</h2>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                        {loading ? (
                            <div className="p-12 text-center text-slate-400">Loading history...</div>
                        ) : grievances.length > 0 ? (
                            grievances.map((item) => (
                                <GrievanceItem key={item._id} data={item} />
                            ))
                        ) : (
                            <div className="p-12 text-center text-slate-400">No previous grievances found.</div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function GrievanceItem({ data }) {
    const statusColors = {
        pending: "bg-orange-100 text-orange-700",
        "in-progress": "bg-blue-100 text-blue-700",
        resolved: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700"
    };

    return (
        <div className="p-6 hover:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-800">{data.subject}</h4>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${statusColors[data.status]}`}>
                    {data.status}
                </span>
            </div>
            <p className="text-sm text-slate-600 mb-3">{data.description}</p>
            {data.response && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <p className="text-xs font-bold text-indigo-600 mb-1">Official Response:</p>
                    <p className="text-xs text-slate-700 italic">"{data.response}"</p>
                    <div className="mt-2 text-[10px] text-slate-400">
                        Responded by: {data.respondedBy?.name || "Staff"} on {new Date(data.respondedAt).toLocaleDateString()}
                    </div>
                </div>
            )}
            {!data.response && (
                <div className="mt-2 text-[10px] text-slate-400">
                    To: {data.assignedTo || "Unknown"}
                </div>
            )}
            <div className="mt-3 text-[10px] text-slate-300">
                Submitted on {new Date(data.createdAt).toLocaleDateString()}
            </div>
        </div>
    );
}

export default Grievance;