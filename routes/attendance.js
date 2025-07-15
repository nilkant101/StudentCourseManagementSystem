
const express = require('express');
const router = express.Router();

// Dummy students data (replace with DB later)
const students = [
    { id: 1, name: 'Amit Kumar' },
    { id: 2, name: 'Sneha Patil' },
    { id: 3, name: 'Rahul Verma' }
];

// GET: Attendance page
router.get('/', (req, res) => {
    res.render('attendance', { students });
});

// POST: Handle attendance form submission
router.post('/submit', (req, res) => {
    const { date, attendance } = req.body;
    console.log('📅 Attendance Submitted:', date, attendance);
    res.redirect('/attendance');
});
// Dummy attendance records for now
let attendanceData = [
  { studentId: 1, name: "Ravi Sharma", date: "2024-07-10", status: "Present" },
  { studentId: 2, name: "Sneha Desai", date: "2024-07-10", status: "Absent" },
  { studentId: 3, name: "Aman Verma", date: "2024-07-10", status: "Present" }
];

// View attendance page
router.get('/view', (req, res) => {
  const selectedDate = req.query.date;

  if (!selectedDate) {
    return res.render('viewAttendance', { attendance: [], selectedDate: "" });
  }

  // Filter data by selected date
  const filtered = attendanceData.filter(record => record.date === selectedDate);
  res.render('viewAttendance', { attendance: filtered, selectedDate });
});



module.exports = router;
