import { useContext } from "react";
import { NoticeContext } from "../../context/NoticeContext";

function NoticeWidget() {

    const { notices } = useContext(NoticeContext);

    return (
        <div className="bg-white rounded-xl shadow-md p-5">
            <h3 className="font-semibold mb-3">Latest Notices</h3>

            {notices.slice(0, 3).map((notice) => (
                <div key={notice.id} className="text-sm text-gray-600 mb-2">
                    • {notice.title}
                </div>
            ))}

        </div>
    );
}

export default NoticeWidget;