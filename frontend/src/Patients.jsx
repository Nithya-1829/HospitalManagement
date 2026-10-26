
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [message, setMessage] = useState('');

  async function loadPatients() {
    try {
      const response = await axios.get('http://localhost:5000/patients');
      setPatients(response.data);
    } catch {
      setMessage('Unable to load patients. Check the backend.');
    }
  }

  useEffect(() => {
    loadPatients();
  }, []);

  async function deletePatient(id) {
    if (!window.confirm('Are you sure you want to delete this patient?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/patients/${id}`);
      setMessage('Patient deleted successfully.');
      loadPatients();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        'Unable to delete patient. Related records may exist.'
      );
    }
  }

  return (
    <main className="page-container">
      <p className="eyebrow">ADMINISTRATION</p>
      <h1>Patient Management</h1>
      <p>View registered patient records.</p>

      {message && <p className="message">{message}</p>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <tr key={patient.patient_id}>
                <td>{patient.patient_id}</td>
                <td>{patient.full_name}</td>
                <td>{patient.email}</td>
                <td>{patient.phone || '-'}</td>
                <td>
                  <button onClick={() => deletePatient(patient.patient_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {patients.length === 0 && (
              <tr>
                <td colSpan="5">No patients found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
