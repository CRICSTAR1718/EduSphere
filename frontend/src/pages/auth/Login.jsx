import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import doodle from "../../assets/images/doodle2.jpg";

function Login() {
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Artificial delay for realism
        setTimeout(async () => {
            await login({ email, password, role });
            setIsSubmitting(false);
        }, 800);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-600"></div>
            
            <div
                className="absolute inset-0 bg-center bg-repeat opacity-20"
                style={{ backgroundImage: `url(${doodle})` }}
            ></div>
            <div className="absolute inset-0 bg-indigo-900 opacity-40"></div>

            <div className="relative z-10 bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-10 w-full max-w-md animate-fadeIn">
                <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">
                    EduSphere
                </h2>
                <p className="text-center text-slate-500 mb-8 text-sm uppercase tracking-widest font-semibold">
                    Static Demo Mode
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                            Login As
                        </label>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                            <option value="admin">Admin</option>
                            <option value="warden">Warden</option>
                            <option value="parent">Parent</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="any@email.com"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition duration-300 shadow-lg hover:shadow-indigo-500/30 transform active:scale-95 ${
                            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {isSubmitting ? "Accessing Dashboard..." : "Login to Demo"}
                    </button>
                    
                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl mt-6">
                        <p className="text-[10px] text-amber-700 leading-relaxed text-center">
                            <strong>Note:</strong> Database connection is disabled. You can enter any details to explore the platform interfaces.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
