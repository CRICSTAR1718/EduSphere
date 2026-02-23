import DashboardLayout from "../../components/layout/DashboardLayout";
import { useState } from "react";

function ScheduleMeeting() {

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Meeting Scheduled Successfully!");
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn">

                <h2 className="text-xl font-semibold">
                    Schedule Mentor Meeting
                </h2>

                <div className="bg-white rounded-xl shadow-md p-6 max-w-xl">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block text-sm text-gray-500 mb-1">
                                Select Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-500 mb-1">
                                Select Time
                            </label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-500 mb-1">
                                Message (Optional)
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows="3"
                                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
                        >
                            Schedule Meeting
                        </button>

                    </form>
                </div>

            </div>
        </DashboardLayout>
    );
}

export default ScheduleMeeting;