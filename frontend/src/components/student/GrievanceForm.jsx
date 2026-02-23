import { useState } from "react";

function GrievanceForm({ onSubmit }) {
    const [message, setMessage] = useState("");

    const handleSubmit = () => {
        if (!message) return;
        onSubmit(message);
        setMessage("");
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">
                Submit Grievance
            </h3>

            <textarea
                rows="4"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                placeholder="Describe your issue..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <button
                onClick={handleSubmit}
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
                Submit
            </button>
        </div>
    );
}

export default GrievanceForm;