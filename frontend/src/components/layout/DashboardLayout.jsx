import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Chatbot from "../common/Chatbot";

function DashboardLayout({ children }) {
    const [open, setOpen] = useState(() => {
        if (typeof window !== "undefined") {
            if (window.innerWidth < 1024) return false;
            const saved = localStorage.getItem("sidebarOpen");
            return saved === "true";
        }
        return false;
    });

    useEffect(() => {
        if (typeof window !== "undefined" && window.innerWidth >= 1024) {
            localStorage.setItem("sidebarOpen", open);
        }
    }, [open]);

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-indigo-50/80 to-slate-100 dark:from-slate-900 dark:to-slate-950 transition-colors duration-300 overflow-hidden">

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-40 w-64 transform ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out`}
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
            <div className="flex-1 transition-all duration-300 ease-in-out ml-0 lg:ml-64">
                <Navbar toggleSidebar={() => setOpen(!open)} />
                <div className="p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </div>

            {/* Chatbot Widget */}
            <Chatbot />
        </div>
    );
}

export default DashboardLayout;