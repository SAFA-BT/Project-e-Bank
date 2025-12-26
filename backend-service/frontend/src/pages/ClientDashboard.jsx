import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";

export default function ClientDashboard() {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [operations, setOperations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Transfer Form State
    const [transferDest, setTransferDest] = useState("");
    const [transferAmount, setTransferAmount] = useState("");
    const [transferMsg, setTransferMsg] = useState("");

    const fetchAccounts = async () => {
        try {
            const res = await axios.get("http://localhost:8080/client/accounts");
            setAccounts(res.data);
            if (res.data.length > 0) {
                setSelectedAccount(res.data[0]);
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const fetchOperations = async (rib) => {
        try {
            const res = await axios.get(`http://localhost:8080/client/operations/${rib}`);
            setOperations(res.data.content);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    useEffect(() => {
        if (selectedAccount) fetchOperations(selectedAccount.rib);
    }, [selectedAccount]);

    const handleTransfer = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/client/virement", {
                ribSource: selectedAccount.rib,
                ribDest: transferDest,
                montant: parseFloat(transferAmount),
                motif: "Virement application"
            });
            setTransferMsg("Transfer Successful!");
            setTransferAmount("");
            setTransferDest("");
            fetchAccounts(); // Update balance
            fetchOperations(selectedAccount.rib);
        } catch (err) {
            setTransferMsg("Transfer Failed: " + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return <Layout title="Dashboard"><div className="text-center mt-20">Loading...</div></Layout>;

    return (
        <Layout title="My Dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Accounts Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 col-span-2">
                    <h2 className="text-xl font-bold text-slate-700 mb-4">My Accounts</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {accounts.map(acc => (
                            <div
                                key={acc.rib}
                                onClick={() => setSelectedAccount(acc)}
                                className={`cursor-pointer min-w-[300px] p-6 rounded-xl border transition duration-300 relative overflow-hidden group ${selectedAccount?.rib === acc.rib ? 'bg-blue-600 text-white border-blue-600 shadow-xl scale-[1.02]' : 'bg-slate-50 text-slate-600 hover:bg-white hover:shadow-md'}`}
                            >
                                <div className="absolute right-[-20px] top-[-20px] opacity-10 transform rotate-12 group-hover:rotate-0 transition duration-500">
                                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12.5 2C17.5 2 22 6.5 22 11.5C22 17 17.5 22 12.5 22C7.5 22 3 17 3 11.5C3 6.5 7.5 2 12.5 2ZM12.5 20C16.6 20 20 16.2 20 11.5C20 6.8 16.6 3 12.5 3C8.4 3 5 6.8 5 11.5C5 16.2 8.4 20 12.5 20Z"></path></svg>
                                </div>
                                <p className="text-sm opacity-80 uppercase tracking-widest mb-1">Current Balance</p>
                                <p className="text-3xl font-bold mb-4">{acc.solde.toFixed(2)} MAD</p>
                                <p className="text-xs opacity-60 font-mono">{acc.rib}</p>
                                <div className={`mt-4 inline-block px-2 py-1 rounded text-xs font-bold ${acc.statut === 'OUVERT' ? 'bg-green-400/20 text-green-300' : 'bg-red-400/20 text-red-300'}`}>
                                    {acc.statut}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Operations Table */}
                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-slate-700 mb-4">Recent Operations</h3>
                        <div className="overflow-hidden rounded-xl border border-slate-100">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-slate-500 uppercase">
                                    <tr>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Type</th>
                                        <th className="px-6 py-3">Description</th>
                                        <th className="px-6 py-3 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {operations.map(op => (
                                        <tr key={op.id} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4">{new Date(op.dateOperation).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${op.type === 'CREDIT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {op.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{op.description}</td>
                                            <td className={`px-6 py-4 text-right font-bold ${op.type === 'CREDIT' ? 'text-green-600' : 'text-slate-800'}`}>
                                                {op.type === 'CREDIT' ? '+' : '-'}{op.montant.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                    {operations.length === 0 && (
                                        <tr><td colSpan="4" className="text-center py-8 text-slate-400">No operations found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Transfer Side Panel */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit sticky top-8">
                    <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                        New Transfer
                    </h2>
                    <form onSubmit={handleTransfer} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Source Account</label>
                            <div className="px-4 py-3 bg-slate-100 text-slate-500 rounded-lg font-mono text-sm">
                                {selectedAccount?.rib || "Select an account"}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Beneficiary RIB</label>
                            <input
                                type="text"
                                required
                                value={transferDest}
                                onChange={e => setTransferDest(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                placeholder="Recipient RIB"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Amount (MAD)</label>
                            <input
                                type="number"
                                required
                                value={transferAmount}
                                onChange={e => setTransferAmount(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                placeholder="0.00"
                            />
                        </div>
                        {transferMsg && (
                            <div className={`p-3 rounded-lg text-sm ${transferMsg.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {transferMsg}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={!selectedAccount}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Confirm Transfer
                        </button>
                    </form>
                </div>

            </div>
        </Layout>
    );
}
