import BarChart from "../charts/BarChart";
import { ATTENDANCE_THRESHOLD } from "../../utils/attendanceUtils";

function ReportsAnalytics() {

    // Mock Data (later connect to API)
    const students = [
        { name: "Aman", attendance: 82 },
        { name: "Rahul", attendance: 68 },
        { name: "Priya", attendance: 74 },
        { name: "Karan", attendance: 91 }
    ];

    const totalStudents = students.length;
    const belowThreshold = students.filter(
        s => s.attendance < ATTENDANCE_THRESHOLD
    ).length;

    const average =
        Math.round(
            students.reduce((sum, s) => sum + s.attendance, 0) /
            totalStudents
        );

    return (
        <div className="bg-white p-8 rounded-2xl shadow-md space-y-8">

            <h2 className="text-xl font-semibold text-slate-700">
                Attendance Analytics Overview
            </h2>

            {/* KPI Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                <div className="bg-indigo-50 p-4 rounded-xl">
                    <p className="text-sm text-indigo-600">
                        Total Students
                    </p>
                    <p className="text-2xl font-bold text-indigo-800">
                        {totalStudents}
                    </p>
                </div>

                <div className="bg-green-50 p-4 rounded-xl">
                    <p className="text-sm text-green-600">
                        Average Attendance
                    </p>
                    <p className="text-2xl font-bold text-green-800">
                        {average}%
                    </p>
                </div>

                <div className="bg-red-50 p-4 rounded-xl">
                    <p className="text-sm text-red-600">
                        Below {ATTENDANCE_THRESHOLD}%
                    </p>
                    <p className="text-2xl font-bold text-red-800">
                        {belowThreshold}
                    </p>
                </div>

            </div>

            {/* Chart Section */}
            <div className="max-w-4xl mx-auto h-96">
                <BarChart
                    title="Student Attendance Distribution"
                    labels={students.map(s => s.name)}
                    dataValues={students.map(s => s.attendance)}
                />
            </div>

            {/* Threshold Note */}
            <div className="text-sm text-gray-500 text-center">
                Attendance below {ATTENDANCE_THRESHOLD}% is flagged for monitoring.
            </div>

        </div>
    );
}

export default ReportsAnalytics;