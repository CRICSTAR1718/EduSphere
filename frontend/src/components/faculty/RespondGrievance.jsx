import { useState } from "react";

function RespondGrievance() {
    const [grievances] = useState([
        { id: 1, student: "Adeel Khan", issue: "Marks not updated", status: "Pending" },
        { id: 2, student: "Sara Ali", issue: "Attendance issue", status: "Resolved" },
    ]);

    return (
        <div className="bg-white p-8 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-slate-700">
                Respond to Grievances
            </h2>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-indigo-50 text-indigo-700">
                        <tr>
                            <th className="p-4 text-left">Student</th>
                            <th className="p-4 text-left">Issue</th>
                            <th className="p-4 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grievances.map(g => (
                            <tr key={g.id} className="border-t">
                                <td className="p-4">{g.student}</td>
                                <td className="p-4">{g.issue}</td>
                                <td className={`p-4 font-semibold ${g.status === "Resolved" ? "text-green-600" : "text-orange-600"}`}>
                                    {g.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default RespondGrievance;