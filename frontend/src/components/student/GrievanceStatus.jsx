function GrievanceStatus({ grievances }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">
                Grievance Status
            </h3>

            <ul className="space-y-3">
                {grievances.map((g, index) => (
                    <li
                        key={index}
                        className="flex justify-between border-b pb-2"
                    >
                        <span>{g.message}</span>
                        <span className={`font-semibold ${g.status === "Resolved"
                                ? "text-green-600"
                                : "text-orange-600"
                            }`}>
                            {g.status}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GrievanceStatus;