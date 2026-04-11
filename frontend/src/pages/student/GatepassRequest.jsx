import DashboardLayout from "../../components/layout/DashboardLayout";
import { useState } from "react";
import { requestGatepass } from "../../services/studentService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiClock, FiMapPin, FiAlignLeft, FiCalendar, FiSend, FiShield } from "react-icons/fi";

function GatepassRequest() {
    const [reason, setReason] = useState("");
    const [type, setType] = useState("outing");
    const [outDate, setOutDate] = useState("");
    const [inDate, setInDate] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await requestGatepass({
                type,
                reason,
                outDate,
                inDate
            });
            toast.success("Gatepass request submitted! Awaiting approval.");
            setReason("");
            setOutDate("");
            setInDate("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
                <header className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <FiShield className="text-white text-xl" />
                        </div>
                        Gatepass Portal
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Request authorization for campus exit / entry.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                            
                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                                        <FiMapPin className="text-indigo-500" /> Pass Type
                                    </label>
                                    <div className="relative group">
                                        <select
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all cursor-pointer appearance-none"
                                        >
                                            <option value="outing">Local Outing</option>
                                            <option value="home">Home Visit</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            ▼
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                                            <FiClock className="text-emerald-500" /> Out Date & Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={outDate}
                                            onChange={(e) => setOutDate(e.target.value)}
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                                            <FiCalendar className="text-amber-500" /> In Date & Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={inDate}
                                            onChange={(e) => setInDate(e.target.value)}
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                                        <FiAlignLeft className="text-indigo-500" /> Specific Reason
                                    </label>
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none"
                                        placeholder="Please provide a valid and specific reason for your request..."
                                        rows="4"
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-200 uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                                        loading ? "opacity-70 cursor-wait" : "hover:bg-indigo-700 hover:shadow-indigo-300"
                                    }`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>Submit Request <FiSend /></>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6">
                            <h3 className="text-indigo-900 font-bold mb-4 flex items-center gap-2">Guidelines</h3>
                            <ul className="space-y-3">
                                <li className="text-xs text-indigo-700 leading-relaxed font-medium flex gap-2">
                                    <span className="font-black text-indigo-500">•</span> Submitting a request does not guarantee approval.
                                </li>
                                <li className="text-xs text-indigo-700 leading-relaxed font-medium flex gap-2">
                                    <span className="font-black text-indigo-500">•</span> Home visits require parental authorization before Warden approval.
                                </li>
                                <li className="text-xs text-indigo-700 leading-relaxed font-medium flex gap-2">
                                    <span className="font-black text-indigo-500">•</span> Standard local outing times are 04:00 PM to 08:00 PM.
                                </li>
                            </ul>
                        </div>
                        <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6">
                            <h3 className="text-amber-900 font-bold mb-2">Emergency?</h3>
                            <p className="text-xs text-amber-700/80 leading-relaxed font-medium mb-4">
                                For urgent or medical emergencies, please directly contact the Chief Warden office.
                            </p>
                            <button className="w-full py-3 bg-amber-100 text-amber-700 font-bold rounded-xl text-xs hover:bg-amber-200 transition-colors">
                                View Emergency Contacts
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default GatepassRequest;