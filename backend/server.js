
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Test API
app.get('/', (req, res) => {
    res.send('Hospital Management API is running!');
});

// Get all doctors
app.get('/doctors', (req, res) => {
    db.query(
        `SELECT doctor_id, full_name, email, phone, specialization
         FROM doctors`,
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        }
    );
});

// Register patient
app.post('/patients/register', async (req, res) => {
    const { full_name, email, phone, dob, gender, password } = req.body;

    if (!full_name || !email || !password) {
        return res.status(400).json({
            message: 'Name, email and password are required.'
        });
    }

    try {
        const password_hash = await bcrypt.hash(password, 10);

        db.query(
            `INSERT INTO patients
             (full_name, email, phone, dob, gender, password_hash)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                full_name,
                email,
                phone || null,
                dob || null,
                gender || null,
                password_hash
            ],
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({
                            message: 'Email is already registered.'
                        });
                    }

                    return res.status(500).json({
                        error: err.message
                    });
                }

                res.status(201).json({
                    message: 'Patient registered successfully.',
                    patient_id: result.insertId
                });
            }
        );
    } catch (err) {
        res.status(500).json({
            message: 'Registration failed.'
        });
    }
});

// Patient login - only one login route
app.post('/patients/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required.'
        });
    }

    db.query(
        `SELECT patient_id, full_name, email, password_hash
         FROM patients
         WHERE email = ?`,
        [email],
        async (err, results) => {
            if (err) {
                console.error('Login database error:', err.message);
                return res.status(500).json({
                    message: 'Database error.'
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    message: 'Invalid email or password.'
                });
            }

            try {
                const patient = results[0];

                const validPassword = await bcrypt.compare(
                    password,
                    patient.password_hash
                );

                if (!validPassword) {
                    return res.status(401).json({
                        message: 'Invalid email or password.'
                    });
                }

                res.json({
                    message: 'Login successful.',
                    patient: {
                        patient_id: patient.patient_id,
                        full_name: patient.full_name,
                        email: patient.email
                    }
                });
            } catch (error) {
                console.error('Login error:', error.message);
                res.status(500).json({
                    message: 'Login could not be completed.'
                });
            }
        }
    );
});

// Get all patients
app.get('/patients', (req, res) => {
    db.query(
        `SELECT patient_id, full_name, email, phone, dob, gender
         FROM patients
         ORDER BY patient_id DESC`,
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        }
    );
});

// Delete patient
app.delete('/patients/:id', (req, res) => {
    db.query(
        'DELETE FROM patients WHERE patient_id = ?',
        [req.params.id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: 'Could not delete patient. They may have related records.'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Patient not found.'
                });
            }

            res.json({
                message: 'Patient deleted successfully.'
            });
        }
    );
});

// Book appointment
app.post('/appointments', (req, res) => {
    const { patient_id, doctor_id, appointment_date, reason } = req.body;

    if (!patient_id || !doctor_id || !appointment_date) {
        return res.status(400).json({
            message: 'Patient, doctor and appointment date are required.'
        });
    }

    db.query(
        `INSERT INTO appointments
         (patient_id, doctor_id, appointment_date, reason)
         VALUES (?, ?, ?, ?)`,
        [patient_id, doctor_id, appointment_date, reason || null],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                message: 'Appointment booked successfully.',
                appointment_id: result.insertId
            });
        }
    );
});

// View appointments
app.get('/appointments', (req, res) => {
    const sql = `
        SELECT
            a.appointment_id,
            a.appointment_date,
            a.reason,
            a.status,
            p.full_name AS patient_name,
            d.full_name AS doctor_name,
            d.specialization
        FROM appointments a
        JOIN patients p ON a.patient_id = p.patient_id
        JOIN doctors d ON a.doctor_id = d.doctor_id
        ORDER BY a.appointment_date DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Update appointment status
app.patch('/appointments/:id/status', (req, res) => {
    const { status } = req.body;
    const allowed = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

    if (!allowed.includes(status)) {
        return res.status(400).json({
            message: 'Invalid appointment status.'
        });
    }

    db.query(
        'UPDATE appointments SET status = ? WHERE appointment_id = ?',
        [status, req.params.id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Appointment not found.'
                });
            }

            res.json({
                message: 'Appointment status updated successfully.'
            });
        }
    );
});

// Add prescription
app.post('/prescriptions', (req, res) => {
    const {
        appointment_id,
        patient_id,
        doctor_id,
        medication,
        instructions
    } = req.body;

    if (!appointment_id || !patient_id || !doctor_id || !medication) {
        return res.status(400).json({
            message: 'Required fields are missing.'
        });
    }

    db.query(
        `INSERT INTO prescriptions
         (appointment_id, patient_id, doctor_id, medication, instructions)
         VALUES (?, ?, ?, ?, ?)`,
        [
            appointment_id,
            patient_id,
            doctor_id,
            medication,
            instructions || null
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                message: 'Prescription saved successfully.',
                prescription_id: result.insertId
            });
        }
    );
});

// View prescriptions for a patient
app.get('/prescriptions/patient/:patientId', (req, res) => {
    db.query(
        `SELECT prescription_id, appointment_id, medication,
                instructions, prescribed_at
         FROM prescriptions
         WHERE patient_id = ?
         ORDER BY prescribed_at DESC`,
        [req.params.patientId],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        }
    );
});

// Add consultation record
app.post('/consultations', (req, res) => {
    const {
        appointment_id,
        patient_id,
        doctor_id,
        diagnosis,
        notes
    } = req.body;

    if (!appointment_id || !patient_id || !doctor_id) {
        return res.status(400).json({
            message: 'Appointment, patient and doctor are required.'
        });
    }

    db.query(
        `INSERT INTO consultation_records
         (appointment_id, patient_id, doctor_id, diagnosis, notes)
         VALUES (?, ?, ?, ?, ?)`,
        [
            appointment_id,
            patient_id,
            doctor_id,
            diagnosis || null,
            notes || null
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                message: 'Consultation record saved successfully.',
                record_id: result.insertId
            });
        }
    );
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Hospital API running at http://localhost:${PORT}`);
});
