import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Chatbot from "../common/Chatbot";

function DashboardLayout({ children }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-40 w-64 transform 
        ${open ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300 ease-in-out
        lg:translate-x-0`}
            >
                <Sidebar closeSidebar={() => setOpen(false)} />
            </div>

            {/* Overlay (Mobile Only) */}
            {open && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 lg:ml-64">
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