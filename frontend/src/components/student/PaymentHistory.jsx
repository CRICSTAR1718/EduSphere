import React from 'react';
import { FiDownload, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';

const PaymentHistory = ({ transactions }) => {
    return (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl border border-white/20">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Transaction History</h3>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    Recent Payments
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Transaction ID</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Fee Type</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Receipt</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-indigo-50/30 transition-colors group">
                                <td className="p-4 text-sm text-gray-600 font-medium">
                                    {new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="p-4 text-sm font-mono text-gray-400 group-hover:text-indigo-600 transition-colors">
                                    {tx.transactionId}
                                </td>
                                <td className="p-4 text-sm font-bold text-gray-700 capitalize">
                                    {tx.type} Fees
                                </td>
                                <td className="p-4 text-sm font-black text-gray-900">
                                    ₹{tx.amount.toLocaleString()}
                                </td>
                                <td className="p-4">
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tx.status === 'paid' ? 'bg-emerald-50 text-emerald-600' :
                                            tx.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                                        }`}>
                                        {tx.status === 'paid' ? <FiCheckCircle /> : tx.status === 'pending' ? <FiClock /> : <FiAlertCircle />}
                                        {tx.status}
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    <button className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                        <FiDownload size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {transactions.length === 0 && (
                <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <FiClock size={32} />
                    </div>
                    <p className="text-gray-400 font-medium">No transactions found</p>
                </div>
            )}
        </div>
    );
};

export default PaymentHistory;
