import { useState, useContext } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { TimetableContext } from "../../context/TimetableContext";

function ManageTimetable() {

    const { addLecture } = useContext(TimetableContext);

    const [form, setForm] = useState({
        className: "",
        subject: "",
        faculty: "",
        day: "",
        time: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addLecture(form);
        setForm({
            className: "",
            subject: "",
            faculty: "",
            day: "",
            time: ""
        });
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn">

                <h2 className="text-xl font-semibold">
                    Manage Timetable
                </h2>

                <div className="bg-white rounded-2xl shadow-md p-6 max-w-2xl">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <input name="className" placeholder="Class"
                            value={form.className}
                            onChange={handleChange}
                            className="w-full border p-2 rounded-md" required />

                        <input name="subject" placeholder="Subject"
                            value={form.subject}
                            onChange={handleChange}
                            className="w-full border p-2 rounded-md" required />

                        <input name="faculty" placeholder="Faculty"
                            value={form.faculty}
                            onChange={handleChange}
                            className="w-full border p-2 rounded-md" required />

                        <select name="day"
                            value={form.day}
                            onChange={handleChange}
                            className="w-full border p-2 rounded-md" required>
                            <option value="">Select Day</option>
                            <option>Monday</option>
                            <option>Tuesday</option>
                            <option>Wednesday</option>
                            <option>Thursday</option>
                            <option>Friday</option>
                        </select>

                        <input name="time" placeholder="Time Slot (10:00 - 11:00)"
                            value={form.time}
                            onChange={handleChange}
                            className="w-full border p-2 rounded-md" required />

                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
                            Add Lecture
                        </button>

                    </form>
                </div>

            </div>
        </DashboardLayout>
    );
}

export default ManageTimetable;