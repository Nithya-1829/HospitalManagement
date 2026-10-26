
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Appointments() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: '',
    reason: ''
  });
  const [message, setMessage] = useState('');

  async function loadData() {
    try {
      const [doctorResponse, appointmentResponse] = await Promise.all([
        axios.get('http://localhost:5000/doctors'),
        axios.get('http://localhost:5000/appointments')
      ]);

      setDoctors(doctorResponse.data);
      setAppointments(appointmentResponse.data);
    } catch {
      setMessage('Could not load data. Check the backend server.');
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post(
        'http://localhost:5000/appointments',
        {
          ...form,
          patient_id: Number(form.patient_id),
          doctor_id: Number(form.doctor_id),
          appointment_date: form.appointment_date.replace('T', ' ') + ':00'
        }
      );

      setMessage(response.data.message);
      setForm({
        patient_id: '',
        doctor_id: '',
        appointment_date: '',
        reason: ''
      });
      await loadData();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        'Booking failed. Check that the patient and doctor exist.'
      );
    }
  }

  return (
    <main className="page-container">
      <p className="eyebrow">PATIENT SERVICES</p>
      <h1>Book an Appointment</h1>
      <p>Choose a doctor and a convenient date and time.</p>

      <section className="form-card">
        <form onSubmit={handleSubmit}>
          <label>Patient ID</label>
          <input
            type="number"
            name="patient_id"
            value={form.patient_id}
            onChange={handleChange}
            placeholder="Enter your registered patient ID"
            min="1"
            required
          />

          <label>Doctor</label>
          <select
            name="doctor_id"
            value={form.doctor_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a doctor</option>
            {doctors.map(doctor => (
              <option key={doctor.doctor_id} value={doctor.doctor_id}>
                {doctor.full_name} — {doctor.specialization}
              </option>
            ))}
          </select>

          <label>Appointment Date and Time</label>
          <input
            type="datetime-local"
            name="appointment_date"
            value={form.appointment_date}
            onChange={handleChange}
            min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
              .toISOString().slice(0, 16)}
            required
          />

          <label>Reason for Visit</label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="Describe the reason for your visit"
            rows="3"
          />

          <button type="submit">Book Appointment</button>
        </form>

        {message && <p className="message" role="status">{message}</p>}
      </section>

      <h2>Appointments</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
              <tr key={appointment.appointment_id}>
                <td>{appointment.patient_name}</td>
                <td>{appointment.doctor_name}</td>
                <td>{new Date(appointment.appointment_date).toLocaleString()}</td>
                <td>{appointment.status}</td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan="4">No appointments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
