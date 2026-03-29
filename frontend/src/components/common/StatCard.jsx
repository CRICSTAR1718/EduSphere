import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

function StatCard({ title, value, icon, accentColor = "indigo" }) {
    
    const colorClasses = {
        indigo: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-indigo-100 dark:ring-indigo-500/20",
        violet: "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-violet-100 dark:ring-violet-500/20",
        emerald: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-100 dark:ring-emerald-500/20",
        rose: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-100 dark:ring-rose-500/20",
        amber: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-100 dark:ring-amber-500/20",
        blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-blue-100 dark:ring-blue-500/20",
    };

    const selectedColorClass = colorClasses[accentColor] || colorClasses.indigo;

    return (
        <div className="bg-gradient-to-br from-white to-slate-50/80 dark:from-slate-800 dark:to-slate-800/80 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/50 hover:shadow-md transition duration-300 transform group relative overflow-hidden">
            {/* Left Accent Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${accentColor}-500/80 transition-transform duration-300 group-hover:scale-y-110 origin-top`}></div>

            <div className="flex justify-between items-center relative z-10">
                <div className="flex flex-col">
                    <p className="text-[13px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1">{title}</p>
                    <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">{value}</h2>
                </div>
                
                <div className={`w-12 h-12 rounded-xl flex justify-center items-center shadow-sm ring-1 ring-inset ${selectedColorClass} transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110`}>
                    {icon ? icon : <ArrowTrendingUpIcon className="w-6 h-6 stroke-2" />}
                </div>
            </div>
        </div>
    );
}

export default StatCard;