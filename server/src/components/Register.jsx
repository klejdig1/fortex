import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider.jsx';

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
            navigate('/');
        } catch (e) {
            setErr(e.message);
        }
    }

    return (
        <div className="card">
   <form className="account-form">

<h2>Create Account</h2>
<p>Join us today 🚀</p>

<div className="form-group">
  <label htmlFor="name">Name</label>
  <input
    id="name"
    type="text"
    placeholder="Enter your name"
    required
  />
</div>

<div className="form-group">
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    placeholder="Enter email"
    required
  />
</div>

<div className="form-group">
  <label htmlFor="password">Password</label>
  <input
    id="password"
    type="password"
    placeholder="Enter password"
    required
  />
</div>

<button type="submit" className="btn-form">
  Create account
</button>

</form>
        </div>
    );
}