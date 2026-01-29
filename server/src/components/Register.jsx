import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider.jsx';
import '../styles/main.css';

export default function Register() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const navigate = useNavigate();
    const { register } = useAuth();

    async function submit(e) {
        e.preventDefault();
        setErr('');
        try {
            await register(email, password, name);
            navigate('/dashboard');
        } catch (e) {
            setErr(e.message);
        }
    }

    return (
        <div className="main-container">
   <form className="account-form" onSubmit={submit}>

<h2>Create Account</h2>
<p>Join us today 🚀</p>

<div className="form-group">
  <label htmlFor="name">Name</label>
  <input
    id="name"
    type="text"
    placeholder="Enter your name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
  />
</div>

<div className="form-group">
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    placeholder="Enter email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
</div>

<div className="form-group">
  <label htmlFor="password">Password</label>
  <input
    id="password"
    type="password"
    placeholder="Enter password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
</div>

<button type="submit" className="btn-form">
  Create account
</button>

{err && <p className="form-error">{err}</p>}

</form>
        </div>
    );
}