import { useContext } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { NoticeContext } from "../../context/NoticeContext";
import { EventContext } from "../../context/EventContext";
import { BellAlertIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

function NotificationsPage() {
    const { notices = [] } = useContext(NoticeContext) || {};
    const { events = [] } = useContext(EventContext) || {};

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
                <div className="mb-8 border-b dark:border-slate-700 pb-4">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <BellAlertIcon className="w-8 h-8 text-indigo-500" />
                        Notifications Center
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Stay updated with all recent notices and upcoming events in one place.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Notices Section */}
                    <div>
                        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            Recent Notices
                        </h3>
                        <div className="space-y-4">
                            {notices?.length > 0 ? (
                                notices.map((notice) => (
                                    <div key={notice._id || notice.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 hover:shadow-md transition-shadow">
                                        <h4 className="font-bold text-lg text-slate-800 dark:text-white mb-2">
                                            {notice.title}
                                        </h4>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                                            {notice.content}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">No recent notices available.</p>
                            )}
                        </div>
                    </div>

                    {/* Events Section */}
                    <div>
                        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                            <CalendarDaysIcon className="w-6 h-6 text-indigo-500" />
                            Upcoming Events
                        </h3>
                        <div className="space-y-4">
                            {events?.length > 0 ? (
                                events.map((event) => (
                                    <div key={event._id || event.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                        <div className="flex-shrink-0 w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex flex-col justify-center items-center border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
                                            <span className="text-xl font-bold">{new Date(event.date).getDate() || "-"}</span>
                                            <span className="text-xs uppercase font-medium">{event.date ? new Date(event.date).toLocaleString('default', { month: 'short' }) : "-"}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-slate-800 dark:text-white mb-1">
                                                {event.title}
                                            </h4>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                                                {event.description}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">No upcoming events available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default NotificationsPage;
