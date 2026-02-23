import { useState } from "react";

function AcademicCalendar() {
    const [events] = useState([
        { id: 1, title: "Semester Start", date: "01 Jan 2026" },
        { id: 2, title: "Midterm Exams", date: "20 Mar 2026" },
        { id: 3, title: "Final Exams", date: "15 Jun 2026" },
        { id: 4, title: "Result Declaration", date: "30 Jun 2026" },
    ]);

    return (
        <div className="bg-white p-8 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-slate-700 mb-6">
                Academic Calendar
            </h2>

            <ul className="space-y-4">
                {events.map(event => (
                    <li
                        key={event.id}
                        className="flex justify-between border-b pb-3 text-gray-700"
                    >
                        <span>{event.title}</span>
                        <span className="font-medium text-indigo-600">
                            {event.date}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AcademicCalendar;