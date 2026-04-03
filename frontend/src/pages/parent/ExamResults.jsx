import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { getWardResults } from "../../services/parentService";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

function ExamResults() {
    const { user } = useAuth();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (!user?.student) return;
            try {
                const data = await getWardResults(user.student);
                setResults(data || []);
            } catch (err) {
                console.error("Error fetching ward results:", err);
                setError("Failed to load exam results.");
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [user]);

    if (loading) {
        return (
            <DashboardLayout>
                <Loader />
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <ErrorMessage message={error} />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-fadeIn">
                <div className="p-6 border-b bg-slate-50">
                    <h2 className="text-xl font-bold text-slate-800">
                        Ward Exam Results
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Consolidated marks breakdown and final grades for your ward.
                    </p>
                </div>

                <div className="overflow-x-auto hidden md:block">
                    <table className="min-w-full text-sm">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th className="p-4 text-left font-semibold uppercase tracking-wider">Subject</th>
                                <th className="p-4 text-center font-semibold uppercase tracking-wider">Semester</th>
                                <th className="p-4 text-center font-semibold uppercase tracking-wider">Internal (30)</th>
                                <th className="p-4 text-center font-semibold uppercase tracking-wider">Mid Term (20)</th>
                                <th className="p-4 text-center font-semibold uppercase tracking-wider">End Term (50)</th>
                                <th className="p-4 text-center font-semibold uppercase tracking-wider bg-indigo-700">Total (100)</th>
                                <th className="p-4 text-right font-semibold uppercase tracking-wider">Grade</th>
                            </tr>
                        </thead>

                        <tbody className="text-gray-700 divide-y divide-slate-100">
                            {results.length > 0 ? (
                                results.map((result, idx) => (
                                    <ResultRow
                                        key={idx}
                                        subject={result.subject}
                                        semester={result.semester}
                                        internal={result.internal}
                                        midterm={result.midterm}
                                        final={result.final}
                                        total={result.total}
                                        grade={result.grade}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-12 text-center text-slate-400">
                                        No results declared yet for your ward.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card Layout */}
                <div className="block md:hidden space-y-4">
                    {results.length > 0 ? (
                        results.map((result, idx) => (
                            <div key={idx} className="bg-white rounded-xl shadow-md p-4 border border-slate-100">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-semibold text-slate-800 text-sm">
                                            {result.subject}
                                        </h3>
                                        <p className="text-xs text-indigo-600 font-bold mt-1">Semester {result.semester}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-slate-800">{result.total}/100</p>
                                        <p className="text-sm font-semibold text-indigo-600">{result.grade}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                                        <p className="text-xs text-slate-500 mb-1">Internal</p>
                                        <p className="font-medium text-slate-800 text-sm">{result.internal}/30</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                                        <p className="text-xs text-slate-500 mb-1">Mid Term</p>
                                        <p className="font-medium text-slate-800 text-sm">{result.midterm}/20</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                                        <p className="text-xs text-slate-500 mb-1">End Term</p>
                                        <p className="font-medium text-slate-800 text-sm">{result.final}/50</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-xl shadow-md p-8 text-center text-slate-400">
                            No results declared yet for your ward.
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

function ResultRow({ subject, semester, internal, midterm, final, total, grade }) {
    const isPass = grade !== "F";

    const formatMark = (val) => (val === null || val === undefined ? <span className="text-slate-300 font-normal">N/A</span> : val);

    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="p-4 font-semibold text-slate-800">{subject}</td>
            <td className="p-4 text-center text-slate-500">S{semester}</td>
            <td className="p-4 text-center font-medium">{formatMark(internal)}</td>
            <td className="p-4 text-center font-medium">{formatMark(midterm)}</td>
            <td className="p-4 text-center font-medium">{formatMark(final)}</td>
            <td className="p-4 text-center font-bold bg-slate-50/50 text-indigo-600">{total}</td>
            <td className={`p-4 text-right font-black ${!isPass ? 'text-red-500' : 'text-emerald-600'}`}>
                <span className={`px-2 py-1 rounded ${!isPass ? 'bg-red-50' : 'bg-emerald-50'}`}>
                    {grade}
                </span>
            </td>
        </tr>
    );
}

export default ExamResults;
