
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link className="brand" to="/">
        MediCare+
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/register">Patient Registration</Link>
        <Link to="/doctors">Doctors</Link>
        <Link to="/appointments">Appointments</Link>
        <Link to="/prescriptions">Prescriptions</Link>
        <Link to="/doctor-dashboard">Doctor Dashboard</Link>
        <Link to="/patients">Patients</Link>
        <Link to="/manage-doctors">Manage Doctors</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}
