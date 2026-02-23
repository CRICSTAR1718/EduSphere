import { createContext, useState } from "react";

export const EventContext = createContext();

export const EventProvider = ({ children }) => {

    const [events, setEvents] = useState([
        {
            id: 1,
            title: "Tech Fest",
            date: "15 March 2026",
            description: "Annual university technology festival"
        }
    ]);

    const addEvent = (event) => {
        setEvents(prev => [
            { id: Date.now(), ...event },
            ...prev
        ]);
    };

    const deleteEvent = (id) => {
        setEvents(prev => prev.filter(e => e.id !== id));
    };

    return (
        <EventContext.Provider value={{ events, addEvent, deleteEvent }}>
            {children}
        </EventContext.Provider>
    );
};