
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('');

  async function loadAppointments() {
    try {
      const response = await axios.get(
        'http://localhost:5000/appointments'
      );
      setAppointments(response.data);
    } catch {
      setMessage('Unable to load appointments. Check the backend server.');
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  async function updateStatus(id, status) {
    try {
      await axios.patch(
        `http://localhost:5000/appointments/${id}/status`,
        { status }
      );
      setMessage('Appointment status updated.');
      await loadAppointments();
    } catch {
      setMessage('Unable to update appointment status.');
    }
  }

  return (
    <main className="page-container">
      <p className="eyebrow">DOCTOR PORTAL</p>
      <h1>Doctor Dashboard</h1>
      <p>View appointments and update their status.</p>

      {message && <p className="message" role="status">{message}</p>}

       
<section className="form-card">
  <h2>Record Consultation</h2>
  <form onSubmit={async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    try {
      const response = await axios.post(
        'http://localhost:5000/consultations',
        {
          appointment_id: Number(data.get('appointment_id')),
          patient_id: Number(data.get('patient_id')),
          doctor_id: Number(data.get('doctor_id')),
          diagnosis: data.get('diagnosis'),
          notes: data.get('notes')
        }
      );
      setMessage(response.data.message || 'Consultation saved successfully.');
      e.currentTarget.reset();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not save consultation.');
    }
  }}>
    <label>Appointment ID</label>
    <input name="appointment_id" type="number" min="1" required />

    <label>Patient ID</label>
    <input name="patient_id" type="number" min="1" required />

    <label>Doctor ID</label>
    <input name="doctor_id" type="number" min="1" required />

    <label>Diagnosis</label>
    <input name="diagnosis" required />

    <label>Consultation Notes</label>
    <textarea name="notes" rows="3" />

    <button type="submit">Save Consultation</button>
  </form>
</section>

<section className="form-card">
  <h2>Create Prescription</h2>
  <form onSubmit={async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    try {
      const response = await axios.post(
        'http://localhost:5000/prescriptions',
        {
          appointment_id: Number(data.get('appointment_id')),
          patient_id: Number(data.get('patient_id')),
          doctor_id: Number(data.get('doctor_id')),
          medication: data.get('medication'),
          instructions: data.get('instructions')
        }
      );
      setMessage(response.data.message || 'Prescription saved successfully.');
      e.currentTarget.reset();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not save prescription.');
    }
  }}>
    <label>Appointment ID</label>
    <input name="appointment_id" type="number" min="1" required />

    <label>Patient ID</label>
    <input name="patient_id" type="number" min="1" required />

    <label>Doctor ID</label>
    <input name="doctor_id" type="number" min="1" required />

    <label>Medication</label>
    <input name="medication" required />

    <label>Instructions</label>
    <textarea name="instructions" rows="3" />

    <button type="submit">Save Prescription</button>
  </form>
</section>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(item => (
              <tr key={item.appointment_id}>
                <td>{item.patient_name}</td>
                <td>{item.doctor_name}</td>
                <td>{new Date(item.appointment_date).toLocaleString()}</td>
                <td>{item.status}</td>
                <td>
                  <select
                    value={item.status}
                    onChange={e =>
                      updateStatus(item.appointment_id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}

            {appointments.length === 0 && (
              <tr>
                <td colSpan="5">No appointments available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
