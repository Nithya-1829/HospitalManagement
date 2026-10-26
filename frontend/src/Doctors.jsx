
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/doctors')
      .then(response => setDoctors(response.data))
      .catch(() => setError('Unable to load doctors. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page-container">
      <p className="eyebrow">OUR MEDICAL TEAM</p>
      <h1>Meet Our Doctors</h1>
      <p>Find a doctor for your healthcare needs.</p>

      {loading && <p>Loading doctors...</p>}
      {error && <p className="message">{error}</p>}

      {!loading && !error && doctors.length === 0 && (
        <p>No doctors have been added yet.</p>
      )}

      <div className="doctor-grid">
        {doctors.map(doctor => (
          <article className="doctor-card" key={doctor.doctor_id}>
            <div className="doctor-avatar">
              {doctor.full_name.charAt(0).toUpperCase()}
            </div>
            <h2>{doctor.full_name}</h2>
            <p className="specialization">{doctor.specialization}</p>
            <p>{doctor.email}</p>
            <p>{doctor.phone || 'Contact details unavailable'}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
