import { useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";

export default function AgentDashboard() {
    const [activeTab, setActiveTab] = useState("client"); // client | account

    // Client Form
    const [clientForm, setClientForm] = useState({
        nom: "", prenom: "", email: "", numeroIdentite: "", dateAnniversaire: "", adressePostale: ""
    });

    // Account Form
    const [accountForm, setAccountForm] = useState({
        clientId: "", rib: "", initialBalance: ""
    });

    const [msg, setMsg] = useState("");

    const handleCreateClient = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8080/agent/clients", clientForm);
            setMsg(`Client Created! ID: ${res.data.id}`);
            setClientForm({ nom: "", prenom: "", email: "", numeroIdentite: "", dateAnniversaire: "", adressePostale: "" });
        } catch (err) {
            setMsg("Error: " + (err.response?.data?.message || err.message));
        }
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/agent/accounts", {
                ...accountForm,
                initialBalance: parseFloat(accountForm.initialBalance)
            });
            setMsg("Account Created Successfully!");
            setAccountForm({ clientId: "", rib: "", initialBalance: "" });
        } catch (err) {
            setMsg("Error: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <Layout title="Agent Workspace">
            <div className="max-w-4xl mx-auto">

                {/* Tabs */}
                <div className="flex space-x-4 mb-8">
                    <button
                        onClick={() => setActiveTab("client")}
                        className={`flex-1 py-4 text-center rounded-xl font-bold transition duration-300 border ${activeTab === 'client' ? 'bg-white border-blue-500 text-blue-600 shadow-lg scale-105' : 'bg-slate-100 border-transparent text-slate-500 hover:bg-white'}`}
                    >
                        Register New Client
                    </button>
                    <button
                        onClick={() => setActiveTab("account")}
                        className={`flex-1 py-4 text-center rounded-xl font-bold transition duration-300 border ${activeTab === 'account' ? 'bg-white border-blue-500 text-blue-600 shadow-lg scale-105' : 'bg-slate-100 border-transparent text-slate-500 hover:bg-white'}`}
                    >
                        Open Bank Account
                    </button>
                </div>

                {/* Message Alert */}
                {msg && (
                    <div className="mb-6 p-4 bg-indigo-50 text-indigo-800 rounded-lg border border-indigo-200">
                        {msg}
                    </div>
                )}

                {/* Content */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                    {activeTab === 'client' ? (
                        <form onSubmit={handleCreateClient} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Last Name (Nom)</label>
                                <input type="text" required className="input-field" value={clientForm.nom} onChange={e => setClientForm({ ...clientForm, nom: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">First Name (Prénom)</label>
                                <input type="text" required className="input-field" value={clientForm.prenom} onChange={e => setClientForm({ ...clientForm, prenom: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Email (Login)</label>
                                <input type="email" required className="input-field" value={clientForm.email} onChange={e => setClientForm({ ...clientForm, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">National ID</label>
                                <input type="text" required className="input-field" value={clientForm.numeroIdentite} onChange={e => setClientForm({ ...clientForm, numeroIdentite: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Birth Date</label>
                                <input type="date" required className="input-field" value={clientForm.dateAnniversaire} onChange={e => setClientForm({ ...clientForm, dateAnniversaire: e.target.value })} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-600 mb-1">Address</label>
                                <input type="text" required className="input-field" value={clientForm.adressePostale} onChange={e => setClientForm({ ...clientForm, adressePostale: e.target.value })} />
                            </div>
                            <div className="md:col-span-2 pt-4">
                                <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg">Register Client</button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleCreateAccount} className="space-y-6 max-w-lg mx-auto">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Client ID</label>
                                <input type="number" required className="input-field" value={accountForm.clientId} onChange={e => setAccountForm({ ...accountForm, clientId: e.target.value })} placeholder="e.g. 1" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">RIB (Account Number)</label>
                                <input type="text" required className="input-field" value={accountForm.rib} onChange={e => setAccountForm({ ...accountForm, rib: e.target.value })} placeholder="Unique RIB" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Initial Balance</label>
                                <input type="number" required className="input-field" value={accountForm.initialBalance} onChange={e => setAccountForm({ ...accountForm, initialBalance: e.target.value })} placeholder="0.00" />
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg">Open Account</button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Style injection for input-field */}
                <style>{`
            .input-field {
                width: 100%;
                padding: 12px 16px;
                background-color: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 0.5rem;
                outline: none;
                transition: all 0.2s;
            }
            .input-field:focus {
                border-color: #3b82f6;
                background-color: #ffffff;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
        `}</style>
            </div>
        </Layout>
    );
}
