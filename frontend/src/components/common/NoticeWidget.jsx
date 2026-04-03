import { useContext } from "react";
import { NoticeContext } from "../../context/NoticeContext";

function NoticeWidget() {

    const { notices } = useContext(NoticeContext);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col min-h-[280px] h-full">
            <h3 className="font-semibold mb-3 dark:text-white">Latest Notices</h3>

            {notices.slice(0, 3).map((notice) => (
                <div key={notice.id} className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    • {notice.title}
                </div>
            ))}

        </div>
    );
}

export default NoticeWidget;