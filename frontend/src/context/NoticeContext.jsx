import { createContext, useState } from "react";

export const NoticeContext = createContext();

export const NoticeProvider = ({ children }) => {

    const [notices, setNotices] = useState([
        {
            id: 1,
            title: "Mid-Sem Exams",
            content: "Exams start from 20 Feb 2026"
        }
    ]);

    const addNotice = (notice) => {
        setNotices(prev => [
            { id: Date.now(), ...notice },
            ...prev
        ]);
    };

    const deleteNotice = (id) => {
        setNotices(prev => prev.filter(n => n.id !== id));
    };

    return (
        <NoticeContext.Provider value={{ notices, addNotice, deleteNotice }}>
            {children}
        </NoticeContext.Provider>
    );
};