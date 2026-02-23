function RoleManagement() {
    const roles = [
        {
            name: "Student",
            permissions: "View attendance, results, submit grievance"
        },
        {
            name: "Faculty",
            permissions: "Mark attendance, upload marks, respond grievance"
        },
        {
            name: "Admin",
            permissions: "Manage users, roles, calendar, reports"
        }
    ];

    return (
        <div className="bg-white p-8 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-slate-700">
                Role Management
            </h2>

            <div className="space-y-4">
                {roles.map((role, index) => (
                    <div
                        key={index}
                        className="bg-indigo-50 p-5 rounded-xl"
                    >
                        <h3 className="font-semibold text-indigo-700">
                            {role.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-2">
                            {role.permissions}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RoleManagement;