import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getUsers, createUser, updateUser, deleteUser } from "../../services/adminService";

// ─── Role badge colors ───
const roleBadge = {
    student: "bg-blue-100 text-blue-700",
    faculty: "bg-purple-100 text-purple-700",
    admin: "bg-amber-100 text-amber-700",
    parent: "bg-green-100 text-green-700",
    warden: "bg-rose-100 text-rose-700",
};

// ─── Blank form for adding a user ───
const blankForm = {
    name: "",
    email: "",
    password: "",
    phone: "",
    department: "",
    semester: "",
    enrollmentNo: "",
    role: "student",
    student: "",
};

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roleFilter, setRoleFilter] = useState("student");
    const [search, setSearch] = useState("");

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null); // null = add, object = edit
    const [formData, setFormData] = useState({ ...blankForm });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");
    const [allStudents, setAllStudents] = useState([]); // For parent association

    // Delete confirmation
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // ─── Fetch users ───
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const params = {};
            if (roleFilter) params.role = roleFilter;
            if (search.trim()) params.search = search.trim();
            const data = await getUsers(params);
            setUsers(data.users || []);
        } catch {
            setError("Failed to load users. Make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    }, [roleFilter, search]);

    const fetchAllStudents = useCallback(async () => {
        try {
            const data = await getUsers({ role: "student" });
            setAllStudents(data.users || []);
        } catch (err) {
            console.error("Failed to fetch students", err);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        fetchAllStudents();
    }, [fetchAllStudents]);

    // Debounced search
    // (Removed as fetchUsers now depends on search and is called in useEffect)

    // ─── Open modal for add ───
    const openAddModal = (role) => {
        setEditingUser(null);
        setFormData({ ...blankForm, role });
        setFormError("");
        setShowModal(true);
    };

    // ─── Open modal for edit ───
    const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name || "",
            email: user.email || "",
            password: "",
            phone: user.phone || "",
            department: user.department || "",
            semester: user.semester || "",
            enrollmentNo: user.enrollmentNo || "",
            role: user.role || "student",
            student: user.student?._id || user.student || "",
        });
        setFormError("");
        setShowModal(true);
    };

    // ─── Form change ───
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ─── Submit (create or update) ───
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setSaving(true);
        try {
            if (editingUser) {
                // Update — only send non-empty fields
                const updates = { ...formData };
                if (!updates.password) delete updates.password;
                await updateUser(editingUser._id, updates);
            } else {
                // Create
                if (!formData.name || !formData.email || !formData.password) {
                    setFormError("Name, email and password are required.");
                    setSaving(false);
                    return;
                }
                await createUser(formData);
            }
            setShowModal(false);
            fetchUsers();
        } catch (err) {
            setFormError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setSaving(false);
        }
    };

    // ─── Delete ───
    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteUser(deleteTarget._id);
            setDeleteTarget(null);
            fetchUsers();
        } catch {
            alert("Failed to delete user.");
        } finally {
            setDeleting(false);
        }
    };

    // ─── Filter tabs ───
    const tabs = [
        { key: "student", label: "Students" },
        { key: "faculty", label: "Faculty" },
        { key: "admin", label: "Admin" },
        { key: "parent", label: "Parents" },
        { key: "warden", label: "Warden" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fadeIn">
                {/* ═══ Header ═══ */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-2xl font-bold text-slate-800">
                        User Management
                    </h1>
                    <div className="flex gap-3">
                        <button
                            onClick={() => openAddModal("student")}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                            </svg>
                            Add Student
                        </button>
                        <button
                            onClick={() => openAddModal("faculty")}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                            </svg>
                            Add Faculty
                        </button>
                        <button
                            onClick={() => openAddModal("parent")}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                            </svg>
                            Add Parent
                        </button>
                    </div>
                </div>

                {/* ═══ Filter tabs + Search ═══ */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setRoleFilter(tab.key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    roleFilter === tab.key
                                        ? "bg-white text-indigo-700 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex-1 max-w-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name, email or enrollment no..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 text-sm transition-all"
                        />
                    </div>
                </div>

                {/* ═══ Users Table ═══ */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-16 text-red-500 font-medium">
                            {error}
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-slate-400 text-lg">No users found</p>
                            <p className="text-slate-300 text-sm mt-1">
                                Add a user of this role to get started.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700">
                                        <th className="p-4 text-left font-semibold">Name</th>
                                        <th className="p-4 text-left font-semibold">Email</th>
                                        <th className="p-4 text-left font-semibold">Role</th>
                                        <th className="p-4 text-left font-semibold">Dept / Ward</th>
                                        <th className="p-4 text-left font-semibold">ID / Reg No</th>
                                        <th className="p-4 text-left font-semibold">Status</th>
                                        <th className="p-4 text-center font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr
                                            key={user._id}
                                            className="border-t border-slate-100 hover:bg-slate-50/70 transition-colors"
                                        >
                                            <td className="p-4 font-medium text-slate-800">
                                                {user.name}
                                            </td>
                                            <td className="p-4 text-slate-600">
                                                {user.email}
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
                                            <td className="p-4 text-slate-600">
                                                {user.role === 'parent' ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-indigo-600 font-medium">{user.student?.name || "—"}</span>
                                                        <span className="text-[10px] text-slate-400">Parent of</span>
                                                    </div>
                                                ) : (
                                                    user.department || "—"
                                                )}
                                            </td>
                                            <td className="p-4 text-slate-600">
                                                {user.role === 'parent' ? (
                                                    user.student?.enrollmentNo || "—"
                                                ) : (
                                                    user.enrollmentNo || "—"
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        user.isActive !== false
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {user.isActive !== false ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteTarget(user)}
                                                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══════ Add / Edit Modal ═══════ */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingUser
                                    ? `Edit ${editingUser.name}`
                                    : `Add New ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}`}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {formError && (
                                <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
                                    {formError}
                                </div>
                            )}

                            <FormField
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g. John Doe"
                            />

                            <FormField
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="e.g. john@university.edu"
                            />

                            <FormField
                                label={editingUser ? "New Password (leave blank to keep)" : "Password"}
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required={!editingUser}
                                placeholder={editingUser ? "Leave blank to keep current" : "Min 6 characters"}
                            />

                            <FormField
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="e.g. +91 9876543210"
                            />

                            {formData.role !== "parent" && (
                                <FormField
                                    label="Department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    placeholder="e.g. Computer Science"
                                />
                            )}

                            {/* Student-only fields */}
                            {formData.role === "student" && (
                                <>
                                    <FormField
                                        label="Semester"
                                        name="semester"
                                        type="number"
                                        value={formData.semester}
                                        onChange={handleChange}
                                        placeholder="e.g. 4"
                                    />
                                    <FormField
                                        label="Enrollment No"
                                        name="enrollmentNo"
                                        value={formData.enrollmentNo}
                                        onChange={handleChange}
                                        placeholder="e.g. EN2024001"
                                    />
                                </>
                            )}

                            {/* Parent-only fields: Student Selection */}
                            {formData.role === "parent" && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Connected Student
                                    </label>
                                    <select
                                        name="student"
                                        value={formData.student}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                                    >
                                        <option value="">Select a student...</option>
                                        {allStudents.map(student => (
                                            <option key={student._id} value={student._id}>
                                                {student.name} ({student.enrollmentNo || "No Roll No"})
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        Select the student this parent is connected to.
                                    </p>
                                </div>
                            )}

                            {/* Role selector (only in edit mode) */}
                            {editingUser && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Role
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                                    >
                                        <option value="student">Student</option>
                                        <option value="faculty">Faculty</option>
                                        <option value="admin">Admin</option>
                                        <option value="parent">Parent</option>
                                        <option value="warden">Warden</option>
                                    </select>
                                </div>
                            )}

                            {/* Submit */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingUser
                                        ? "Update User"
                                        : `Add ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ═══════ Delete Confirmation ═══════ */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
                        <div className="text-center">
                            <div className="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">
                                Delete User
                            </h3>
                            <p className="text-slate-500 text-sm mb-6">
                                Are you sure you want to delete{" "}
                                <span className="font-semibold text-slate-700">
                                    {deleteTarget.name}
                                </span>
                                ? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setDeleteTarget(null)}
                                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-medium shadow-md hover:bg-red-600 disabled:opacity-50 transition-all"
                                >
                                    {deleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

// ─── Reusable form field ───
function FormField({ label, name, type = "text", value, onChange, required, placeholder }) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {label}
                {required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 text-sm transition-all"
            />
        </div>
    );
}

export default ManageUsers;
