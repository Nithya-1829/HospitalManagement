
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [message, setMessage] = useState('');

  async function loadDoctors() {
    try {
      const response = await axios.get('http://localhost:5000/doctors');
      setDoctors(response.data);
    } catch {
      setMessage('Unable to load doctors.');
    }
  }

  useEffect(() => {
    loadDoctors();
  }, []);

  async function addDoctor(e) {
    e.preventDefault();
    setMessage('');

    try {
      await axios.post('http://localhost:5000/doctors', {
        full_name: name,
        email,
        phone,
        specialization
      });

      setMessage('Doctor added successfully!');
      setName('');
      setEmail('');
      setPhone('');
      setSpecialization('');
      await loadDoctors();
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Unable to add doctor.'
      );
    }
  }

  return (
    <main className="page-container">
      <p className="eyebrow">ADMINISTRATION</p>
      <h1>Manage Doctors</h1>

      {message && <p className="message">{message}</p>}

      <form className="form-card" onSubmit={addDoctor}>
        <h2>Add New Doctor</h2>

        <label>Full Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label>Phone</label>
        <input
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />

        <label>Specialization</label>
        <input
          value={specialization}
          onChange={e => setSpecialization(e.target.value)}
          required
        />

        <button type="submit">Add Doctor</button>
      </form>

      <h2>Registered Doctors</h2>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Specialization</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(doctor => (
              <tr key={doctor.doctor_id}>
                <td>{doctor.doctor_id}</td>
                <td>{doctor.full_name}</td>
                <td>{doctor.email}</td>
                <td>{doctor.specialization}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
