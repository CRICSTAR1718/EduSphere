import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Chatbot from "../common/Chatbot";

function DashboardLayout({ children }) {
    const [open, setOpen] = useState(() => {
        if (typeof window !== "undefined") {
            if (window.innerWidth < 1024) return false;
            const saved = localStorage.getItem("sidebarOpen");
            if (saved !== null) return saved === "true";
            return true;
        }
        return false;
    });

    useEffect(() => {
        if (typeof window !== "undefined" && window.innerWidth >= 1024) {
            localStorage.setItem("sidebarOpen", open);
        }
    }, [open]);

    return (
        <div className="flex h-screen w-full bg-gradient-to-b from-indigo-50/80 to-slate-100 dark:from-slate-900 dark:to-slate-950 transition-colors duration-300 overflow-hidden print:overflow-visible print:bg-white print:bg-none print:h-auto">

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-40 w-64 transform ${open ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out print:hidden`}
            >
                <Sidebar closeSidebar={() => setOpen(false)} />
            </div>

            {/* Overlay (Mobile Only) */}
            {open && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden transition-opacity duration-300"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className={`flex-1 flex flex-col h-full transition-all duration-300 ease-in-out ml-0 ${open ? "lg:ml-64" : ""} print:ml-0`}>
                <div className="print:hidden z-30 shrink-0">
                    <Navbar toggleSidebar={() => setOpen(!open)} />
                </div>
                <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8 print:p-0 print:overflow-visible custom-scrollbar relative">
                    {children}
                </div>
            </div>

            {/* Chatbot Widget */}
            <div className="print:hidden">
                <Chatbot />
            </div>
        </div>
    );
}

export default DashboardLayout;