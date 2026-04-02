import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function WelcomeBanner({ role, title, subtitle, imageSrc }) {
    const { user } = useContext(AuthContext);
    
    // Fallback if somehow user is not loaded
    const displayName = user?.name ? user.name.toUpperCase() : (user?.email ? user.email.split('@')[0].toUpperCase() : 'USER');
    const formattedUsername = displayName;

    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 rounded-3xl shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/40 border border-indigo-400/30 dark:border-indigo-400/10 p-8 mb-8 flex items-center justify-between group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-150"></div>
            <div className="absolute -bottom-24 right-32 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-150"></div>

            <div className="relative z-10 max-w-xl">
                <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] font-bold uppercase tracking-wider rounded-full mb-3 shadow-sm">
                    {role} Dashboard
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2 drop-shadow-md">
                    {title || `Welcome back, ${formattedUsername}`}
                </h1>
                <p className="text-indigo-100 text-[15px] font-medium leading-relaxed max-w-md drop-shadow-sm">
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
