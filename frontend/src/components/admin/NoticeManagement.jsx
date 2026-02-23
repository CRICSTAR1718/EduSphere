import { useState } from "react";

function NoticeManagement() {
    const [notice, setNotice] = useState("");
    const [notices, setNotices] = useState([]);

    const handlePublish = () => {
        if (!notice) return;

        setNotices([
            ...notices,
            { id: Date.now(), text: notice }
        ]);

        setNotice("");
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-slate-700">
                Notice Management
            </h2>

            <textarea
                rows="3"
                value={notice}
                onChange={(e) => setNotice(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                placeholder="Write notice..."
            />

            <button
                onClick={handlePublish}
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
                Publish Notice
            </button>

            <div className="mt-6 space-y-3">
                {notices.map(n => (
                    <div key={n.id} className="bg-indigo-50 p-4 rounded-lg">
                        {n.text}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NoticeManagement;