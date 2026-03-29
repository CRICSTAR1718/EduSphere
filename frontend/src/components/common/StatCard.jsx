import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

function StatCard({ title, value, icon, accentColor = "indigo" }) {
    
    const colorClasses = {
        indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
        violet: "bg-violet-50 text-violet-600 ring-violet-100",
        emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
        rose: "bg-rose-50 text-rose-600 ring-rose-100",
        amber: "bg-amber-50 text-amber-600 ring-amber-100",
        blue: "bg-blue-50 text-blue-600 ring-blue-100",
    };

    const selectedColorClass = colorClasses[accentColor] || colorClasses.indigo;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300 transform group relative overflow-hidden">
            {/* Left Accent Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${accentColor}-500/80 transition-transform duration-300 group-hover:scale-y-110 origin-top`}></div>

            <div className="flex justify-between items-center relative z-10">
                <div className="flex flex-col">
                    <p className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</h2>
                </div>
                
                <div className={`w-12 h-12 rounded-xl flex justify-center items-center shadow-sm ring-1 ring-inset ${selectedColorClass} transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110`}>
                    {icon ? icon : <ArrowTrendingUpIcon className="w-6 h-6 stroke-2" />}
                </div>
            </div>
        </div>
    );
}

export default StatCard;