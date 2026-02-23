import { useState } from "react";

function MarkAttendance() {
    const [students, setStudents] = useState([
        { id: 1, name: "Adeel Khan", present: true },
        { id: 2, name: "Sara Ali", present: false },
        { id: 3, name: "Imran Ahmed", present: true },
    ]);

    const toggleAttendance = (id) => {
        setStudents(students.map(student =>
            student.id === id
                ? { ...student, present: !student.present }
                : student
        ));
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-slate-700">
                Mark Attendance
            </h2>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-indigo-50 text-indigo-700">
                        <tr>
                            <th className="p-4 text-left">Student</th>
                            <th className="p-4 text-left">Present</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.id} className="border-t">
                                <td className="p-4">{student.name}</td>
                                <td className="p-4">
                                    <input
                                        type="checkbox"
                                        checked={student.present}
                                        onChange={() => toggleAttendance(student.id)}
                                        className="w-5 h-5 accent-indigo-600"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MarkAttendance;