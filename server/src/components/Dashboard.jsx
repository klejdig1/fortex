import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthProvider.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

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
    const { user, access, logout } = useAuth();
    const [clients, setClients] = useState([]);
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(false);

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

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Clients</h2>
                <div>
                    <span style={{ marginRight: 12 }}>{user?.email}</span>
                    <button onClick={() => logout()}>Sign out</button>
                </div>
            </div>

            <div style={{ marginTop: 12 }}>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email" />
                <button onClick={() => load(q)} style={{ marginLeft: 8 }}>Search</button>
            </div>

            <div style={{ marginTop: 12 }}>
                {loading ? <p>Loading...</p> : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr>
                            <th>ID</th><th>Name</th><th>Email</th>
                        </tr>
                        </thead>
                        <tbody>
                        {clients.map(c => (
                            <tr key={c.id}>
                                <td style={{ padding: 8 }}>{c.id}</td>
                                <td style={{ padding: 8 }}>{c.name}</td>
                                <td style={{ padding: 8 }}>{c.email}</td>
                            </tr>
                        ))}
                        {clients.length === 0 && <tr><td colSpan="3">No clients</td></tr>}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}