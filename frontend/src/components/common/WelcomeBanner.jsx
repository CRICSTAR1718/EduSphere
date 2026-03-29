import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function WelcomeBanner({ role, title, subtitle, imageSrc }) {
    const { user } = useContext(AuthContext);
    
    // Fallback if somehow user is not loaded
    const username = user?.email ? user.email.split('@')[0] : 'User';
    const formattedUsername = username.charAt(0).toUpperCase() + username.slice(1);

    return (
        <div className="relative overflow-hidden bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-8 flex items-center justify-between group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-transparent via-indigo-50/30 to-violet-50/50 pointer-events-none"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-150"></div>
            <div className="absolute -bottom-24 right-32 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-150"></div>

            <div className="relative z-10 max-w-xl">
                <span className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[11px] font-bold uppercase tracking-wider rounded-full mb-3 shadow-sm">
                    {role} Dashboard
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight mb-2">
                    {title || `Welcome back, ${formattedUsername}!`}
                </h1>
                <p className="text-slate-500 text-[15px] font-medium leading-relaxed max-w-md">
                    {subtitle || "Here's what's happening today. Let's make it a great and productive day."}
                </p>
            </div>

            {/* Illustration */}
            <div className="relative hidden md:block w-48 h-48 lg:w-56 lg:h-56 shrink-0 transition-transform duration-500 group-hover:-translate-y-2">
                {imageSrc && (
                    <img 
                        src={imageSrc} 
                        alt="Dashboard Banner Graphic" 
                        className="absolute inset-0 w-full h-full object-contain filter drop-shadow-xl"
                    />
                )}
            </div>
        </div>
    );
}

export default WelcomeBanner;
