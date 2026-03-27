import DashboardLayout from "../../components/layout/DashboardLayout";
import { useState } from "react";
import { requestGatepass } from "../../services/studentService";
import { toast } from "react-toastify";

function GatepassRequest() {
    const [reason, setReason] = useState("");
    const [type, setType] = useState("outing");
    const [outDate, setOutDate] = useState("");
    const [inDate, setInDate] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await requestGatepass({
                type,
                reason,
                outDate,
                inDate
            });
            toast.success("Gatepass request submitted! Awaiting parent approval.");
            setReason("");
            setOutDate("");
            setInDate("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn">
                <h2 className="text-xl font-semibold">Request Gatepass</h2>

                <div className="bg-white rounded-xl shadow-md p-6 max-w-xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="outing">Outing</option>
                                <option value="home">Home Visit</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Reason</label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                                placeholder="Purpose of visit..."
                                rows="3"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Out Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={outDate}
                                    onChange={(e) => setOutDate(e.target.value)}
                                    required
                                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-500 mb-1">In Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={inDate}
                                    onChange={(e) => setInDate(e.target.value)}
                                    required
                                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition ${
                                loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {loading ? "Submitting..." : "Submit Request"}
                        </button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default GatepassRequest;