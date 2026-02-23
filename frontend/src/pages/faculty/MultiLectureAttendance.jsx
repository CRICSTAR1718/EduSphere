import DashboardLayout from "../../components/layout/DashboardLayout";
import { useState } from "react";

function MultiLectureAttendance() {

    const [subject, setSubject] = useState("");
    const [date, setDate] = useState("");
    const [lectures, setLectures] = useState([{ id: 1, slot: "" }]);
    const [students] = useState([
        { id: 1, name: "Aman Verma" },
        { id: 2, name: "Rahul Singh" },
        { id: 3, name: "Priya Sharma" }
    ]);

    const addLectureSlot = () => {
        setLectures([...lectures, { id: Date.now(), slot: "" }]);
    };

    const updateLectureSlot = (id, value) => {
        setLectures(
            lectures.map(l =>
                l.id === id ? { ...l, slot: value } : l
            )
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Attendance marked for multiple lectures successfully!");
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn">

                <h2 className="text-xl font-semibold">
                    Multi-Lecture Attendance
                </h2>

                {/* Selection Section */}
                <div className="bg-white rounded-xl shadow-md p-6 space-y-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                            className="border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        >
                            <option value="">Select Subject</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Physics">Physics</option>
                            <option value="Computer Science">Computer Science</option>
                        </select>

                        <input
                            type="date"
                            className="border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    {/* Lecture Slots */}
                    <div className="space-y-3">
                        <h3 className="font-medium">Lecture Slots</h3>

                        {lectures.map((lecture) => (
                            <input
                                key={lecture.id}
                                type="text"
                                placeholder="Enter Lecture Slot (e.g. 10:00 - 11:00)"
                                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                                value={lecture.slot}
                                onChange={(e) =>
                                    updateLectureSlot(lecture.id, e.target.value)
                                }
                            />
                        ))}

                        <button
                            type="button"
                            onClick={addLectureSlot}
                            className="text-indigo-600 text-sm hover:underline"
                        >
                            + Add Another Lecture Slot
                        </button>
                    </div>
                </div>

                {/* Student Attendance Table */}
                <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
                    <h3 className="font-medium mb-4">
                        Mark Attendance
                    </h3>

                    <table className="w-full text-left">
                        <thead className="border-b text-sm text-gray-500">
                            <tr>
                                <th className="py-3">Student Name</th>
                                {lectures.map((lecture, index) => (
                                    <th key={lecture.id}>
                                        Lecture {index + 1}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 font-medium">
                                        {student.name}
                                    </td>

                                    {lectures.map(lecture => (
                                        <td key={lecture.id}>
                                            <select className="border rounded-md p-1 text-sm">
                                                <option value="Present">Present</option>
                                                <option value="Absent">Absent</option>
                                            </select>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button
                        onClick={handleSubmit}
                        className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
                    >
                        Submit Attendance
                    </button>
                </div>

            </div>
        </DashboardLayout>
    );
}

export default MultiLectureAttendance;