function DashboardCard({ title, value }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <p className="text-slate-500 text-sm">{title}</p>
            <h2 className="text-2xl font-bold text-indigo-600 mt-2">
                {value}
            </h2>
        </div>
    );
}

export default DashboardCard;