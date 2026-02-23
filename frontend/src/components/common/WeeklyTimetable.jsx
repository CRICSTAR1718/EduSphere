import { useContext } from "react";
import { TimetableContext } from "../../context/TimetableContext";

function WeeklyTimetable({ classNameFilter }) {

    const { timetable } = useContext(TimetableContext);

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    const filteredLectures = timetable.filter(
        lecture => lecture.className === classNameFilter
    );

    const timeSlots = [...new Set(filteredLectures.map(l => l.time))];

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-x-auto">

            <table className="min-w-full text-sm text-center">
                <thead className="bg-indigo-50 text-indigo-700">
                    <tr>
                        <th className="p-4 text-left">Time</th>
                        {days.map(day => (
                            <th key={day} className="p-4">
                                {day}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {timeSlots.map(slot => (
                        <tr key={slot} className="border-t">

                            <td className="p-4 font-medium text-left">
                                {slot}
                            </td>

                            {days.map(day => {
                                const lecture = filteredLectures.find(
                                    l => l.day === day && l.time === slot
                                );

                                return (
                                    <td key={day} className="p-4">
                                        {lecture ? (
                                            <div className="bg-indigo-100 rounded-lg p-2 text-xs">
                                                <p className="font-semibold">
                                                    {lecture.subject}
                                                </p>
                                                <p className="text-gray-600">
                                                    {lecture.faculty}
                                                </p>
                                            </div>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                );
                            })}

                        </tr>
                    ))}
                </tbody>

            </table>

        </div>
    );
}

export default WeeklyTimetable;