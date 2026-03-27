import { useState, useEffect } from "react";
import { getUsers } from "../../services/adminService";

const roleBadge = {
    student: "bg-blue-100 text-blue-700",
    faculty: "bg-purple-100 text-purple-700",
    admin: "bg-amber-100 text-amber-700",
    parent: "bg-green-100 text-green-700",
    warden: "bg-rose-100 text-rose-700",
};

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUsers()
            .then((data) => setUsers((data.users || []).slice(0, 5)))
            .catch(() => setUsers([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="bg-white p-8 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-slate-700">
                Recent Users
            </h2>

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                </div>
            ) : users.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">
                    No users found
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-indigo-50 text-indigo-700">
                            <tr>
                                <th className="p-4 text-left">Name</th>
                                <th className="p-4 text-left">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user._id}
                                    className="border-t hover:bg-slate-50 transition-colors"
                                >
                                    <td className="p-4 font-medium text-slate-700">
                                        {user.name}
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                                roleBadge[user.role] || "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default UserManagement;