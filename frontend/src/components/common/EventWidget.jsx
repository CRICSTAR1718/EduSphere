import { useContext } from "react";
import { EventContext } from "../../context/EventContext";

function EventWidget() {

    const { events } = useContext(EventContext);

    return (
        <div className="bg-white rounded-xl shadow-md p-5">
            <h3 className="font-semibold mb-3">Upcoming Events</h3>

            {events.slice(0, 3).map(event => (
                <div key={event.id} className="text-sm text-gray-600 mb-2">
                    • {event.title} ({event.date})
                </div>
            ))}

        </div>
    );
}

export default EventWidget;