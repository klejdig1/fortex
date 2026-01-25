import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider.jsx';
import '../styles/main.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    async function submit(e) {
        e.preventDefault();
        setErr('');
        try {
            await login(email, password);
            navigate('/');
        } catch (e) {
            setErr(e.message);
        }
    }

    return (
        <div className="main-container">
            <form className='account-form' onSubmit={submit}>
            <h2>Welcome Back 👋</h2>
            <p>Please login to your account</p>
                <div className='login-form'>
                    <label>Email</label>
                    <input placeholder='Enter email' className='label-form' value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
                </div>
                <div className='register-form'>
                    <label>Password</label>
                    <input placeholder='Enter password' className='label-form' value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
                </div>
                <div>
                    <button className="btn-form" type="submit">Login</button>
                </div>
                {err && <p style={{ color: 'red' }}>{err}</p>}
            </form>
        </div>
    );
}