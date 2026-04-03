import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getStudentResults } from "../../services/studentService";

function Results() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const data = await getStudentResults();
                setResults(data);
            } catch (error) {
                console.error("Error fetching results:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    return (
        <DashboardLayout>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-fadeIn">
                <div className="p-4 sm:p-6 border-b bg-slate-50">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                        Academic Results
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Consolidated marks breakdown and final grades for your courses.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th className="p-3 sm:p-4 text-left font-semibold uppercase tracking-wider">Subject</th>
                                <th className="p-3 sm:p-4 text-center font-semibold uppercase tracking-wider">Semester</th>
                                <th className="p-3 sm:p-4 text-center font-semibold uppercase tracking-wider">Internal (30)</th>
                                <th className="p-3 sm:p-4 text-center font-semibold uppercase tracking-wider">Mid Term (20)</th>
                                <th className="p-3 sm:p-4 text-center font-semibold uppercase tracking-wider">End Term (50)</th>
                                <th className="p-3 sm:p-4 text-center font-semibold uppercase tracking-wider bg-indigo-700">Total (100)</th>
                                <th className="p-3 sm:p-4 text-right font-semibold uppercase tracking-wider">Grade</th>
                            </tr>
                        </thead>

                        <tbody className="text-gray-700 divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-8 sm:p-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                            Loading results...
                                        </div>
                                    </td>
                                </tr>
                            ) : results.length > 0 ? (
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
                                    <td colSpan="7" className="p-8 sm:p-12 text-center text-slate-400">
                                        No results declared yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card Layout */}
                <div className="block md:hidden p-4 space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center gap-3 py-8">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                            <p className="text-slate-400">Loading results...</p>
                        </div>
                    ) : results.length > 0 ? (
                        results.map((result, idx) => (
                            <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-semibold text-slate-800 text-sm">
                                        {result.subject}
                                    </h3>
                                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                        Semester {result.semester}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div className="bg-white rounded-lg p-3 border">
                                        <p className="text-xs text-slate-500 mb-1">Internal (30)</p>
                                        <p className="font-semibold text-slate-800">
                                            {result.internal !== null && result.internal !== undefined ? result.internal : "N/A"}
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border">
                                        <p className="text-xs text-slate-500 mb-1">Mid Term (20)</p>
                                        <p className="font-semibold text-slate-800">
                                            {result.midterm !== null && result.midterm !== undefined ? result.midterm : "N/A"}
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border">
                                        <p className="text-xs text-slate-500 mb-1">End Term (50)</p>
                                        <p className="font-semibold text-slate-800">
                                            {result.final !== null && result.final !== undefined ? result.final : "N/A"}
                                        </p>
                                    </div>
                                    <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                                        <p className="text-xs text-indigo-600 mb-1">Total (100)</p>
                                        <p className="font-bold text-indigo-900">{result.total}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-600">Grade:</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${result.grade === "F" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                                        }`}>
                                        {result.grade}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-slate-400">
                            No results declared yet.
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
            <td className="p-3 sm:p-4 font-semibold text-slate-800">{subject}</td>
            <td className="p-3 sm:p-4 text-center text-slate-500">S{semester}</td>
            <td className="p-3 sm:p-4 text-center font-medium">{formatMark(internal)}</td>
            <td className="p-3 sm:p-4 text-center font-medium">{formatMark(midterm)}</td>
            <td className="p-3 sm:p-4 text-center font-medium">{formatMark(final)}</td>
            <td className="p-3 sm:p-4 text-center font-bold bg-slate-50/50 text-indigo-600">{total}</td>
            <td className={`p-3 sm:p-4 text-right font-black ${!isPass ? 'text-red-500' : 'text-emerald-600'}`}>
                <span className={`px-2 py-1 rounded ${!isPass ? 'bg-red-50' : 'bg-emerald-50'}`}>
                    {grade}
                </span>
            </td>
        </tr>
    );
}

export default Results;