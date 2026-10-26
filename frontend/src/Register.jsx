
import { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/patients/register',
        form
      );

      setMessage(response.data.message);
      setForm({
        full_name: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        password: ''
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Registration failed. Check the backend.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-container">
      <section className="form-card">
        <p className="eyebrow">PATIENT PORTAL</p>
        <h1>Patient Registration</h1>
        <p>Create an account to access hospital services.</p>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label>Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />

          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
          />

          <label>Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a password"
            minLength={6}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {message && <p className="message" role="status">{message}</p>}
      </section>
    </main>
  );
}
