import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Bars3Icon, BellIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

function Navbar({ toggleSidebar }) {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40">
            <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center h-16">
                
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    {/* Hamburger (Mobile Only) */}
                    <button
                        className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                        onClick={toggleSidebar}
                    >
                        <Bars3Icon className="w-6 h-6" />
                    </button>

                    <h1 className="text-[17px] font-semibold text-slate-800 tracking-tight hidden sm:block">
                        Welcome Back <span className="inline-block animate-bounce ml-1">👋</span>
                    </h1>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-5">
                    <button className="relative p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
                        <BellIcon className="w-5 h-5" />
                        <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                    </button>

                    <div className="h-6 w-px bg-slate-200"></div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 group cursor-pointer">
                            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-100 to-violet-100 text-indigo-600 rounded-full flex items-center justify-center border border-indigo-200/50 shadow-sm transition-transform group-hover:scale-105">
                                <UserCircleIcon className="w-6 h-6" />
                            </div>
                            <div className="hidden sm:block text-left">
                                <div className="text-[13px] font-semibold text-slate-700">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}</div>
                                <div className="text-[11px] font-medium text-slate-500 max-w-[120px] truncate">{user?.email}</div>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="ml-2 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
                            title="Logout"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Navbar;