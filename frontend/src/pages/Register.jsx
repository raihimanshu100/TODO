import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!form.name || !form.email || !form.password) {
        alert('Please fill in all fields');
        return;
      }

      await API.post('/auth/register', form);
      alert('Registered successfully. Please log in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === 'Email already registered') {
        alert('Email already registered. Redirecting to login...');
        navigate('/login');
      } else {
        alert(msg || 'Registration failed');
      }
    }
  };

  return (
    <div className="auth-page">
      <h1>Welcome to Kanban Board</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Register</button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Link to="/login" style={{ color: '#007BFF', textDecoration: 'none' }}>
          Login ➜
        </Link>
      </p>
    </div>
  );
}
