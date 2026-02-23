import { useState } from "react";

function UserManagement() {
    const [users] = useState([
        { id: 1, name: "Adeel Khan", role: "Student" },
        { id: 2, name: "Dr. Smith", role: "Faculty" },
    ]);

    return (
        <div className="bg-white p-8 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-slate-700">
                User Management
            </h2>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-indigo-50 text-indigo-700">
                        <tr>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Role</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-t">
                                <td className="p-4">{user.name}</td>
                                <td className="p-4 font-medium">{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default UserManagement;