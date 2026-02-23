import { ATTENDANCE_THRESHOLD } from "../../utils/attendanceUtils";

function AttendanceWarningBanner({ average }) {

    if (average >= ATTENDANCE_THRESHOLD) return null;

    return (
        <div className="bg-red-100 border border-red-300 text-red-700 px-6 py-4 rounded-xl shadow-sm">
            ⚠ Your attendance is below {ATTENDANCE_THRESHOLD}%.
            Please improve to avoid academic penalties.
        </div>
    );
}

export default AttendanceWarningBanner;