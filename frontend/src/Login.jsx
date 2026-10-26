
import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [patient, setPatient] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    setMessage('');
    setPatient(null);

    try {
      const response = await axios.post(
        'http://localhost:5000/patients/login',
        { email, password }
      );

      setPatient(response.data.patient);
      setMessage('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      setMessage(
        error.response?.data?.message ||
        error.response?.data?.error ||
        `Login failed. Status: ${error.response?.status || 'No response'}`
      );
    }
  }

  return (
    <main className="page-container">
      <p className="eyebrow">PATIENT PORTAL</p>
      <h1>Patient Login</h1>

      <form className="form-card" onSubmit={handleLogin}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      {message && <p className="message">{message}</p>}

      {patient && (
        <section className="feature-card">
          <h2>Welcome, {patient.full_name}!</h2>
          <p>Patient ID: {patient.patient_id}</p>
          <p>Email: {patient.email}</p>
        </section>
      )}
    </main>
  );
}
