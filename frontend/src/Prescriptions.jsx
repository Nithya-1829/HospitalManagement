
import { useState } from 'react';
import axios from 'axios';

export default function Prescriptions() {
  const [patientId, setPatientId] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [message, setMessage] = useState('');
  const [searched, setSearched] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setSearched(false);

    try {
      const response = await axios.get(
        `http://localhost:5000/prescriptions/patient/${patientId}`
      );

      setPrescriptions(response.data);
      setSearched(true);

      if (response.data.length === 0) {
        setMessage('No prescriptions found for this patient ID.');
      }
    } catch {
      setMessage('Unable to load prescriptions. Check the backend.');
      setPrescriptions([]);
    }
  }

  return (
    <main className="page-container">
      <p className="eyebrow">PATIENT RECORDS</p>
      <h1>My Prescriptions</h1>
      <p>View medication details and instructions provided by a doctor.</p>

      <section className="form-card">
        <form onSubmit={handleSubmit}>
          <label>Patient ID</label>
          <input
            type="number"
            min="1"
            value={patientId}
            onChange={e => setPatientId(e.target.value)}
            placeholder="Enter your patient ID"
            required
          />
          <button type="submit">View Prescriptions</button>
        </form>

        {message && <p className="message" role="status">{message}</p>}
      </section>

      {searched && prescriptions.length > 0 && (
        <div className="prescription-grid">
          {prescriptions.map(item => (
            <article className="prescription-card" key={item.prescription_id}>
              <p className="eyebrow">
                PRESCRIPTION #{item.prescription_id}
              </p>
              <h2>Medication</h2>
              <p>{item.medication}</p>

              <h3>Instructions</h3>
              <p>{item.instructions || 'No additional instructions.'}</p>

              <p className="prescription-date">
                Prescribed: {new Date(item.prescribed_at).toLocaleString()}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
