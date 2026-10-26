
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="hero">
      <p className="eyebrow">YOUR HEALTH, OUR PRIORITY</p>
      <h1>Healthcare made simpler.</h1>
      <p className="hero-text">
        Book appointments, connect with doctors, and access your
        prescriptions from one convenient platform.
      </p>

      <div className="hero-actions">
        <Link className="primary-btn" to="/appointments">
          Book an Appointment
        </Link>
        <Link className="secondary-btn" to="/doctors">
          Meet Our Doctors
        </Link>
      </div>

      <div className="feature-grid">
        <article className="feature-card">
          <span>01</span>
          <h3>Easy Appointments</h3>
          <p>Request appointments with available doctors.</p>
        </article>
        <article className="feature-card">
          <span>02</span>
          <h3>Patient Records</h3>
          <p>Access your prescription information.</p>
        </article>
        <article className="feature-card">
          <span>03</span>
          <h3>Doctor Dashboard</h3>
          <p>Manage appointments and consultation records.</p>
        </article>
      </div>
    </main>
  );
}
