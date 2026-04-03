import { useContext } from "react";
import { TimetableContext } from "../../context/TimetableContext";

function WeeklyTimetable() {

    const { timetable } = useContext(TimetableContext);

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Group lectures by day
    const lecturesByDay = days.reduce((acc, day) => {
        acc[day] = timetable.filter(lecture => lecture.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
        return acc;
    }, {});

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-4 sm:p-6 border-b bg-slate-50">
                <h3 className="text-lg font-semibold text-slate-800">Weekly Schedule</h3>
                <p className="text-sm text-slate-500 mt-1">Your class timetable for the week</p>
            </div>

            {/* Mobile Card Layout */}
            <div className="block md:hidden p-4 space-y-4">
                {days.map(day => (
                    <div key={day} className="bg-slate-50 rounded-xl p-4">
                        <h4 className="font-semibold text-slate-800 mb-3 text-sm">{day}</h4>
                        {lecturesByDay[day].length > 0 ? (
                            <div className="space-y-3">
                                {lecturesByDay[day].map((lecture, idx) => (
                                    <div key={idx} className="bg-white rounded-lg p-3 border border-slate-200">
                                        <div className="flex justify-between items-start mb-2">
                                            <h5 className="font-semibold text-indigo-900 text-sm">
                                                {lecture.course?.title || "Unknown Course"}
                                            </h5>
                                            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                                {lecture.startTime} - {lecture.endTime}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-600 space-y-1">
                                            <p><span className="font-medium">Faculty:</span> {lecture.course?.faculty?.name || "TBA"}</p>
                                            {lecture.roomContext && (
                                                <p><span className="font-medium">Room:</span> {lecture.roomContext}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm italic">No classes scheduled</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-indigo-50 text-indigo-700">
                        <tr>
                            <th className="p-4 text-left font-semibold">Time</th>
                            {days.map(day => (
                                <th key={day} className="p-4 font-semibold text-center min-w-[120px]">
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {/* Get all unique time slots */}
                        {[...new Set(timetable.map(l => `${l.startTime} - ${l.endTime}`))].sort().map(slot => (
                            <tr key={slot} className="border-t">
                                <td className="p-4 font-medium text-left text-slate-800">
                                    {slot}
                                </td>

                                {days.map(day => {
                                    const lecture = timetable.find(
                                        l => l.day === day && `${l.startTime} - ${l.endTime}` === slot
                                    );

                                    return (
                                        <td key={day} className="p-4 text-center min-w-[120px]">
                                            {lecture ? (
                                                <div className="bg-indigo-100 rounded-lg p-3 text-xs h-full flex flex-col justify-center min-h-[4rem]">
                                                    <p className="font-semibold text-indigo-900 leading-tight mb-1">
                                                        {lecture.course?.title || "Unknown Course"}
                                                    </p>
                                                    <p className="text-indigo-600 font-medium text-[10px]">
                                                        By {lecture.course?.faculty?.name || "Faculty"}
                                                    </p>
                                                    {lecture.roomContext && (
                                                        <p className="text-gray-500 text-[10px] mt-1">
                                                            {lecture.roomContext}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-gray-300">-</div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default WeeklyTimetable;