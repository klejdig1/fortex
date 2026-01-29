import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthProvider.jsx';
import { getApiBase } from '../utils/api.js';

const API_BASE = getApiBase();

function fetchWithAuth(path, token) {
    return fetch(`${API_BASE}${path}`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(async (r) => {
        const json = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(json.error || 'API Error');
        return json;
    });
}

export default function Dashboard() {
    const { access } = useAuth();
    const [clients, setClients] = useState([]);
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    async function load(qval = '') {
        setLoading(true);
        try {
            const params = qval ? `?q=${encodeURIComponent(qval)}` : '';
            const resp = await fetchWithAuth(`/api/clients${params}`, access);
            setClients(resp.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { if (access) load(); }, [access]);

    async function handleCreateClient(e) {
        e.preventDefault();
        if (!newName.trim()) return;
        setError('');
        setCreating(true);
        try {
            const res = await fetch(`${API_BASE}/api/clients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access}`
                },
                body: JSON.stringify({
                    name: newName.trim(),
                    email: newEmail.trim() || undefined
                })
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(json.error || 'Failed to create client');
            }
            setNewName('');
            setNewEmail('');
            setShowCreate(false);
            await load(q);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to create client');
        } finally {
            setCreating(false);
        }
    }

    return (
        <div className="dash">
            <div className="dash__top">
                <div>
                    <h1 className="dash__title">Clients</h1>
                    <p className="dash__subtitle">Search and manage your customer list.</p>
                </div>
                <button
                    type="button"
                    className="dash__btn dash__btn--ghost"
                    onClick={() => setShowCreate((v) => !v)}
                >
                    {showCreate ? 'Close' : 'New client'}
                </button>
            </div>

            <div className="dash__card">
                <div className="dash__search">
                    <input
                        className="dash__input"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search name or email"
                    />
                    <button className="dash__btn" onClick={() => load(q)} disabled={loading}>
                        {loading ? 'Searching…' : 'Search'}
                    </button>
                </div>
            </div>

            {showCreate && (
                <div className="dash__card dash__card--create">
                    <form className="dash__createForm" onSubmit={handleCreateClient}>
                        <div className="dash__field">
                            <label className="dash__label">Name *</label>
                            <input
                                className="dash__input"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Client name"
                                required
                            />
                        </div>
                        <div className="dash__field">
                            <label className="dash__label">Email</label>
                            <input
                                className="dash__input"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="client@example.com"
                                type="email"
                            />
                        </div>
                        <div className="dash__createActions">
                            <button
                                type="submit"
                                className="dash__btn"
                                disabled={creating || !newName.trim()}
                            >
                                {creating ? 'Creating…' : 'Create client'}
                            </button>
                        </div>
                        {error && <p className="dash__error">{error}</p>}
                    </form>
                </div>
            )}

            <div className="dash__card dash__card--table">
                <div className="dash__tableWrap">
                    <table className="dash__table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="dash__empty">
                                        Loading…
                                    </td>
                                </tr>
                            ) : clients.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="dash__empty">
                                        No clients found.
                                    </td>
                                </tr>
                            ) : (
                                clients.map((c) => (
                                    <tr key={c.id}>
                                        <td className="dash__mono">{c.id}</td>
                                        <td>{c.name}</td>
                                        <td className="dash__email">{c.email}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}