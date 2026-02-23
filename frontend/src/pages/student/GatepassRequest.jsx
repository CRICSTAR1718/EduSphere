import DashboardLayout from "../../components/layout/DashboardLayout";
import { useState } from "react";

function GatepassRequest() {

    const [reason, setReason] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Gatepass request submitted!");
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn">

                <h2 className="text-xl font-semibold">
                    Request Gatepass
                </h2>

                <div className="bg-white rounded-xl shadow-md p-6 max-w-xl">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block text-sm text-gray-500 mb-1">
                                Reason
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-500 mb-1">
                                Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-500 mb-1">
                                Time
                            </label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                required
                                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
                        >
                            Submit Request
                        </button>

                    </form>
                </div>

            </div>
        </DashboardLayout>
    );
}

export default GatepassRequest;