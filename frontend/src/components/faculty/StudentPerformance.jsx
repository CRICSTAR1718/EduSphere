import { useState } from "react";

function UploadMarks() {
    const [marks, setMarks] = useState([
        { id: 1, name: "Adeel Khan", score: 85 },
        { id: 2, name: "Sara Ali", score: 78 },
    ]);

    const updateScore = (id, value) => {
        setMarks(marks.map(student =>
            student.id === id
                ? { ...student, score: value }
                : student
        ));
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-slate-700">
                Upload Marks
            </h2>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-indigo-50 text-indigo-700">
                        <tr>
                            <th className="p-4 text-left">Student</th>
                            <th className="p-4 text-left">Marks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marks.map(student => (
                            <tr key={student.id} className="border-t">
                                <td className="p-4">{student.name}</td>
                                <td className="p-4">
                                    <input
                                        type="number"
                                        value={student.score}
                                        onChange={(e) => updateScore(student.id, e.target.value)}
                                        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
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

export default UploadMarks;