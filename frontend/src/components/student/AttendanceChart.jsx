import BarChart from "../charts/BarChart";

function AttendanceChart({ attendance }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">
                Attendance Overview
            </h3>

            <div className="max-w-3xl mx-auto h-72">
                <BarChart
                    title="Attendance %"
                    labels={attendance.map(item => item.subject)}
                    dataValues={attendance.map(item => item.percentage)}
                />
            </div>
        </div>
    );
}

export default AttendanceChart;