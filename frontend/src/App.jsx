
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './Home';
import Register from './Register';
import Doctors from './Doctors';
import Appointments from './Appointments';
import Prescriptions from './Prescriptions';
import DoctorDashboard from './DoctorDashboard';
import './App.css';
import Patients from './Patients';
import ManageDoctors from './ManageDoctors';
import Login from './Login';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/patients" element={<Patients />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/manage-doctors" element={<ManageDoctors />} />
        <Route path="/login" element={<Login />} />
      </Routes>



    </BrowserRouter>
  );
}
