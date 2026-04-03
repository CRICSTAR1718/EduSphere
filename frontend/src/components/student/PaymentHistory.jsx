import React from 'react';
import { FiDownload, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';

const PaymentHistory = ({ transactions }) => {
    return (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl border border-white/20">
            <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h3 className="text-base sm:text-lg font-bold text-gray-800">Transaction History</h3>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto">
                    Recent Payments
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="p-3 sm:p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                            <th className="p-3 sm:p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Transaction ID</th>
                            <th className="p-3 sm:p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Fee Type</th>
                            <th className="p-3 sm:p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                            <th className="p-3 sm:p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                            <th className="p-3 sm:p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Receipt</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-indigo-50/30 transition-colors">
                                <td className="p-3 sm:p-4 text-sm text-gray-600 font-medium">
                                    {new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="p-3 sm:p-4 text-sm font-mono text-gray-400 group-hover:text-indigo-600 transition-colors">
                                    {tx.transactionId}
                                </td>
                                <td className="p-3 sm:p-4 text-sm font-bold text-gray-700 capitalize">
                                    {tx.type} Fees
                                </td>
                                <td className="p-3 sm:p-4 text-sm font-black text-gray-900">
                                    ₹{tx.amount.toLocaleString()}
                                </td>
                                <td className="p-3 sm:p-4">
                                    <div className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${tx.status === 'paid' ? 'bg-emerald-50 text-emerald-600' :
                                        tx.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                                        }`}>
                                        {tx.status === 'paid' ? <FiCheckCircle /> : tx.status === 'pending' ? <FiClock /> : <FiAlertCircle />}
                                        {tx.status}
                                    </div>
                                </td>
                                <td className="p-3 sm:p-4 text-center">
                                    <button className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                        <FiDownload size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="block md:hidden p-4 space-y-4">
                {transactions.length > 0 ? (
                    transactions.map((tx) => (
                        <div key={tx.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-semibold text-slate-800 text-sm capitalize">
                                        {tx.type} Fees
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${tx.status === 'paid' ? 'bg-emerald-50 text-emerald-600' :
                                        tx.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                                    }`}>
                                    {tx.status === 'paid' ? <FiCheckCircle /> : tx.status === 'pending' ? <FiClock /> : <FiAlertCircle />}
                                    {tx.status}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div className="bg-white rounded-lg p-3 border">
                                    <p className="text-xs text-slate-500 mb-1">Amount</p>
                                    <p className="font-bold text-slate-800">₹{tx.amount.toLocaleString()}</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 border">
                                    <p className="text-xs text-slate-500 mb-1">Transaction ID</p>
                                    <p className="font-mono text-slate-600 text-xs">{tx.transactionId}</p>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button className="flex items-center gap-2 px-3 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all text-sm font-medium">
                                    <FiDownload size={14} />
                                    Receipt
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <FiClock size={24} />
                        </div>
                        <p className="text-gray-400 font-medium">No transactions found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentHistory;
