import { useContext } from "react";
import { EventContext } from "../../context/EventContext";

function EventWidget() {

    const { events } = useContext(EventContext);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col min-h-[280px] h-full">
            <h3 className="font-semibold mb-3 dark:text-white">Upcoming Events</h3>

            {events.slice(0, 3).map(event => (
                <div key={event.id} className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    • {event.title} ({event.date})
                </div>
            ))}

        </div>
    );
}

export default EventWidget;