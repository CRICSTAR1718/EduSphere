import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import campus from "../../assets/images/campus.jpg";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function Login() {
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        const result = await login({ email, password, role });

        if (!result.success) {
            setError(result.message);
        }

        setIsSubmitting(false);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${campus})` }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-sm" />

            {/* Glow */}
            <div className="absolute w-[300px] h-[300px] bg-indigo-500/30 blur-3xl rounded-full top-10 left-10" />

            {/* Card */}
            <div className="relative z-10 w-full max-w-md p-10 rounded-3xl 
                bg-white/20 backdrop-blur-xl border border-white/30 
                shadow-2xl shadow-indigo-500/20">

                <h2 className="text-3xl font-bold text-center text-white mb-8">
                    EduSphere
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {error && (
                        <div className="bg-red-500/20 text-red-200 p-3 rounded-lg text-sm border border-red-400/30 text-center">
                            {error}
                        </div>
                    )}

                    {/* Dropdown */}
                    <RoleDropdown role={role} setRole={setRole} />

                    {/* Email */}
                    <div>
                        <label className="block text-xs text-gray-200 mb-1 uppercase">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-xl 
                            bg-white/30 border border-white/30 
                            text-white placeholder-gray-200
                            focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs text-gray-200 mb-1 uppercase">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-3 rounded-xl 
                                bg-white/30 border border-white/30 
                                text-white placeholder-gray-200
                                focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-200 hover:text-white transition-colors"
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="w-5 h-5" />
                                ) : (
                                    <EyeIcon className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 rounded-xl font-bold text-white 
                        bg-gradient-to-r from-indigo-600 to-violet-600 
                        transition-all duration-300 hover:scale-105
                        ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isSubmitting ? "Authenticating..." : "Login to EduSphere"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;


// 🔽 Dropdown (inside same file → NO import issues)

function RoleDropdown({ role, setRole }) {
    const roles = [
        { label: "Student", value: "student" },
        { label: "Faculty", value: "faculty" },
        { label: "Admin", value: "admin" },
        { label: "Warden", value: "warden" },
        { label: "Parent", value: "parent" },
    ];

    const [open, setOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selected = roles.find((r) => r.value === role);

    return (
        <div ref={ref}>
            <label className="block text-xs text-gray-200 mb-1 uppercase">
                Login As
            </label>

            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full px-4 py-3 rounded-xl 
                bg-white/30 border border-white/30 text-white 
                flex justify-between items-center"
            >
                {selected?.label}
                <span>{open ? "▲" : "▼"}</span>
            </button>

            {open && (
                <div className="mt-2 rounded-xl bg-white/20 backdrop-blur-xl border border-white/20 overflow-hidden">
                    {roles.map((r) => (
                        <div
                            key={r.value}
                            onClick={() => {
                                setRole(r.value);
                                setOpen(false);
                            }}
                            className="px-4 py-3 text-white cursor-pointer hover:bg-indigo-500/30"
                        >
                            {r.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}