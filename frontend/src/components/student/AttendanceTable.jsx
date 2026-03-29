import { ATTENDANCE_THRESHOLD } from "../../utils/attendanceUtils";

function AttendanceTable({ attendance }) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-700 dark:text-white">
                    Attendance Record
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                        <tr>
                            <th className="p-4 text-left">Subject</th>
                            <th className="p-4 text-left">Percentage</th>
                            <th className="p-4 text-left">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {attendance.map((item, index) => {
                            const isLow = item.percentage < ATTENDANCE_THRESHOLD;

                            return (
                                <tr
                                    key={index}
                                    className={`border-t dark:border-slate-700 ${isLow ? "bg-red-50 dark:bg-red-900/20" : ""
                                        }`}
                                >
                                    <td className="p-4 dark:text-slate-200">
                                        {item.subject}
                                    </td>

                                    <td
                                        className={`p-4 font-semibold ${isLow
                                                ? "text-red-600"
                                                : "text-green-600"
                                            }`}
                                    >
                                        {item.percentage}%
                                    </td>

                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${isLow
                                                    ? "bg-red-100 text-red-600"
                                                    : "bg-green-100 text-green-600"
                                                }`}
                                        >
                                            {isLow ? "Below Threshold" : "Good Standing"}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AttendanceTable;