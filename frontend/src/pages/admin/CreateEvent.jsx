import { useState, useContext } from "react";
import { EventContext } from "../../context/EventContext";
import DashboardLayout from "../../components/layout/DashboardLayout";

function CreateEvent() {

    const { addEvent } = useContext(EventContext);

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        addEvent({ title, date, description });

        setTitle("");
        setDate("");
        setDescription("");
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn">
                <h2 className="text-xl font-semibold">Create Event</h2>

                <div className="bg-white rounded-xl shadow-md p-6 max-w-xl">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <input
                            type="text"
                            placeholder="Event Title"
                            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                        <input
                            type="date"
                            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />

                        <textarea
                            placeholder="Event Description"
                            rows="4"
                            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
                        >
                            Publish Event
                        </button>

                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default CreateEvent;