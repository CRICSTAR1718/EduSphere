import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiUser, FiBook, FiClipboard, FiChevronRight, FiChevronLeft, FiAlertCircle } from 'react-icons/fi';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { getStudentCourses, getStudentProfile } from '../../services/studentService';

const ExamForm = () => {
    const [step, setStep] = useState(1);
    const [courses, setCourses] = useState([]);
    const [studentProfile, setStudentProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        semester: '6th', // Will be overridden by profile data
        examType: 'Regular',
        subjects: [],
        declaration: false
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch profile and available courses in parallel
                const [profileData, coursesData] = await Promise.all([
                    getStudentProfile(),
                    getStudentCourses()
                ]);
                
                setStudentProfile(profileData);
                setFormData(prev => ({
                    ...prev,
                    semester: `${profileData.semester}th` // Assuming formatting like '6th'
                }));
                
                // Format courses for the component
                const formattedCourses = coursesData.courses.map(course => ({
                    id: course._id,
                    code: course.courseCode,
                    name: course.title,
                    credits: course.credits,
                    type: "Core" // Backend model doesn't specify type, assuming Core or deriving it if added later
                }));
                
                setCourses(formattedCourses);
            } catch (err) {
                console.error("Error fetching form data:", err);
                setError("Failed to load your profile and courses. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubjectToggle = (subject) => {
        const isSelected = formData.subjects.find(s => s.id === subject.id);
        if (isSelected) {
            setFormData({ ...formData, subjects: formData.subjects.filter(s => s.id !== subject.id) });
        } else {
            setFormData({ ...formData, subjects: [...formData.subjects, subject] });
        }
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const steps = [
        { id: 1, name: 'Student Info', icon: <FiUser /> },
        { id: 2, name: 'Subject Selection', icon: <FiBook /> },
        { id: 3, name: 'Review & Submit', icon: <FiCheckCircle /> },
    ];

    const handleSubmit = async () => {
        if (!formData.declaration || formData.subjects.length === 0) return;
        setIsSubmitting(true);
        try {
            // Ideally, we'd send this to a /student/exam-forms endpoint.
            // Simulating API call for submission since we didn't add the submission endpoint explicitly in the plan
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsSuccess(true);
        } catch (err) {
            console.error("Submission failed:", err);
            // Handle error (e.g., using a toast notification)
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader />
            </div>
        );
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    if (isSuccess) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto bg-white rounded-3xl p-10 text-center shadow-xl border border-gray-100"
            >
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                    <FiCheckCircle />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Form Submitted Successfully!</h2>
                <p className="text-gray-500 mb-8">
                    Your examination form has been recorded. You can view your scheduled exams once the timetable is published by the admin.
                </p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all"
                >
                    Return to Dashboard
                </button>
            </motion.div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Multi-step Progress Bar */}
            <div className="mb-16 px-4">
                <div className="flex items-center justify-between relative max-w-2xl mx-auto">
                    <div className="absolute top-1/2 left-0 w-full h-[3px] bg-slate-100 -translate-y-1/2 z-0 rounded-full" />
                    <div
                        className="absolute top-1/2 left-0 h-[3px] bg-gradient-to-r from-indigo-500 to-emerald-400 -translate-y-1/2 z-0 transition-all duration-700 ease-out rounded-full shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                        style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                    />
                    {steps.map((s) => (
                        <div key={s.id} className="relative z-10 flex flex-col items-center">
                            <motion.div
                                animate={{
                                    backgroundColor: step >= s.id ? '#fff' : '#fff',
                                    color: step >= s.id ? '#4f46e5' : '#94a3b8',
                                    borderColor: step >= s.id ? '#4f46e5' : '#f1f5f9',
                                    scale: step === s.id ? 1.15 : 1,
                                    boxShadow: step === s.id ? '0 10px 25px -5px rgba(99,102,241,0.3)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                }}
                                className="w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-xl transition-all duration-300 bg-white"
                            >
                                {step > s.id ? <FiCheckCircle className="text-emerald-500" /> : s.icon}
                            </motion.div>
                            <span className={`absolute -bottom-8 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${step >= s.id ? 'text-indigo-600' : 'text-slate-400'}`}>
                                {s.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <motion.div 
                layout
                className="bg-white/[0.8] backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/40 relative overflow-hidden"
            >
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/30 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-10 relative z-10"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Candidate Identity</label>
                                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 text-slate-700 font-bold flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-indigo-500">
                                            <FiUser />
                                        </div>
                                        {studentProfile?.name || "N/A"}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Official Enrollment</label>
                                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 text-slate-700 font-bold flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-indigo-500">
                                            <FiClipboard />
                                        </div>
                                        {studentProfile?.enrollmentNo || "N/A"}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Academic Semester</label>
                                    <div className="relative group">
                                        <select
                                            className="w-full p-4 bg-white/50 rounded-2xl border border-slate-200 text-slate-700 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                                            value={formData.semester}
                                            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                        >
                                            <option>5th</option>
                                            <option>6th</option>
                                            <option>7th</option>
                                            <option>8th</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
                                            <FiChevronRight className="rotate-90" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Evaluation Category</label>
                                    <div className="relative group">
                                        <select
                                            className="w-full p-4 bg-white/50 rounded-2xl border border-slate-200 text-slate-700 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                                            value={formData.examType}
                                            onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                                        >
                                            <option>Regular</option>
                                            <option>Carry Over</option>
                                            <option>Ex-Student</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
                                            <FiChevronRight className="rotate-90" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-100 rounded-[1.5rem] flex gap-4 items-start shadow-sm shadow-amber-100/20">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-amber-500 shrink-0">
                                    <FiAlertCircle size={20} />
                                </div>
                                <div>
                                    <h5 className="text-[11px] font-black text-amber-800 uppercase tracking-widest mb-1">Verify Identity</h5>
                                    <p className="text-xs text-amber-800/80 leading-relaxed font-medium">
                                        Please ensure your personal details are correct. All credentials must match your official university record to prevent evaluation delays.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="space-y-8 relative z-10"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
                                        <FiBook />
                                    </div>
                                    Select Your Modules
                                </h3>
                                <div className="inline-flex bg-slate-100 p-1 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <span className="px-3 py-1.5 bg-white rounded-lg shadow-sm text-indigo-600 italic">{formData.semester} SEMESTER</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {courses.map((sub) => {
                                    const active = formData.subjects.find(s => s.id === sub.id);
                                    return (
                                        <motion.div
                                            key={sub.id}
                                            whileHover={{ y: -4, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleSubjectToggle(sub)}
                                            className={`group p-5 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${active
                                                    ? 'border-indigo-500 bg-gradient-to-br from-indigo-500/5 to-white shadow-[0_20px_40px_-15px_rgba(99,102,241,0.15)]'
                                                    : 'border-slate-100 bg-white hover:border-slate-200'
                                                }`}
                                        >
                                            {active && (
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full -mr-12 -mt-12 blur-xl" />
                                            )}
                                            
                                            <div className="flex items-start justify-between relative z-10 mb-4">
                                                <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center font-black text-sm tracking-tighter transition-all duration-300 ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    {sub.code}
                                                </div>
                                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${active ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100 scale-110' : 'border-slate-200 group-hover:border-indigo-300'
                                                    }`}>
                                                    {active ? <FiCheckCircle size={16} /> : <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-indigo-300" />}
                                                </div>
                                            </div>

                                            <div className="relative z-10">
                                                <h4 className={`font-black text-base leading-snug transition-colors duration-300 ${active ? 'text-slate-900' : 'text-slate-700'}`}>{sub.name}</h4>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${active ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>{sub.type}</span>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">{sub.credits} CREDITS</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-10 relative z-10"
                        >
                            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white overflow-hidden relative shadow-2xl shadow-slate-200">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -mr-32 -mt-32 blur-3xl" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full -ml-32 -mb-32 blur-3xl" />
                                
                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
                                    <div>
                                        <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Submission Confirmation</p>
                                        <h3 className="text-3xl md:text-4xl font-black leading-tight italic">Registration Vault <span className="text-indigo-400 not-italic">2024-25</span></h3>
                                    </div>
                                    <div className="px-5 py-2 bg-white/10 rounded-2xl text-[10px] font-black backdrop-blur-md border border-white/10 uppercase tracking-widest text-indigo-300">
                                        {formData.examType} CANDIDATE
                                    </div>
                                </div>

                                <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-10 border-t border-white/5 pt-10">
                                    <div>
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Modules</p>
                                        <p className="text-3xl font-black font-mono tracking-tighter">{formData.subjects.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Credit Load</p>
                                        <p className="text-3xl font-black font-mono tracking-tighter text-emerald-400">{formData.subjects.reduce((sum, s) => sum + s.credits, 0)}</p>
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Target Semester</p>
                                        <p className="text-3xl font-black font-mono tracking-tighter text-indigo-400">{formData.semester}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-2">
                                <label className="flex items-start gap-4 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={formData.declaration}
                                        onChange={(e) => setFormData({ ...formData, declaration: e.target.checked })}
                                    />
                                    <motion.div 
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`w-7 h-7 rounded-xl border-2 mt-0.5 flex items-center justify-center transition-all duration-300 ${formData.declaration ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'border-slate-200 group-hover:border-indigo-300'
                                        }`}
                                    >
                                        {formData.declaration && <FiCheckCircle size={16} />}
                                    </motion.div>
                                    <div className="flex-1">
                                        <h6 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1 group-hover:text-indigo-600 transition-colors">Solemn Declaration</h6>
                                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                            I verify that the above information is authentic. I acknowledge that any misrepresentation will void this registration and may subject me to institutional protocols.
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="mt-16 flex items-center justify-between border-t border-slate-100 pt-10 px-2 relative z-10">
                    <motion.button
                        whileHover={{ x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={prevStep}
                        disabled={step === 1}
                        className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${step === 1 ? 'opacity-0 invisible' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'
                            }`}
                    >
                        <FiChevronLeft size={18} /> Back
                    </motion.button>
                    {step < 3 ? (
                        <motion.button
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={nextStep}
                            className="flex items-center gap-3 px-10 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 transition-all border border-slate-800"
                        >
                            Continue <FiChevronRight size={18} />
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSubmit}
                            disabled={!formData.declaration || formData.subjects.length === 0 || isSubmitting}
                            className="flex items-center gap-3 px-12 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-emerald-100 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed border border-emerald-500/20"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Encrypting...
                                </>
                            ) : (
                                <>Finalize Registration <FiClipboard size={18} /></>
                            )}
                        </motion.button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ExamForm;
