import { createContext, useState } from "react";

export const TimetableContext = createContext();

export const TimetableProvider = ({ children }) => {

    const [timetable, setTimetable] = useState([
        {
            id: 1,
            className: "BTech CSE 2A",
            subject: "Data Structures",
            faculty: "Dr. Mehta",
            day: "Monday",
            time: "10:00 - 11:00"
        }
    ]);

    const addLecture = (lecture) => {
        setTimetable(prev => [
            ...prev,
            { id: Date.now(), ...lecture }
        ]);
    };

    return (
        <TimetableContext.Provider value={{ timetable, addLecture }}>
            {children}
        </TimetableContext.Provider>
    );
};