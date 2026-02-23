import { useContext, useState } from "react";
import { NoticeContext } from "../../context/NoticeContext";
import DashboardLayout from "../../components/layout/DashboardLayout";

function CreateNotice() {

    const { addNotice } = useContext(NoticeContext);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        addNotice({ title, content });

        setTitle("");
        setContent("");
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn">
                <h2 className="text-xl font-semibold">Create Notice</h2>

                <div className="bg-white rounded-xl shadow-md p-6 max-w-xl">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <input
                            type="text"
                            placeholder="Notice Title"
                            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                        <textarea
                            placeholder="Notice Content"
                            rows="4"
                            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
                        >
                            Publish Notice
                        </button>

                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default CreateNotice;