// routes/grades.js
const express = require('express');
const router = express.Router();

// Dummy data (replace with DB later)
const students = [
    { id: 1, name: 'Amit Kumar' },
    { id: 2, name: 'Sneha Patil' },
    { id: 3, name: 'Rahul Verma' }
];

const courses = [
    { id: 1, name: 'Web Development' },
    { id: 2, name: 'Java Programming' },
    { id: 3, name: 'Digital Marketing' }
];

// GET: Grades page
router.get('/', (req, res) => {
    res.render('grades', { students, courses });
});

// POST: Handle grade form
router.post('/submit', (req, res) => {
    const { course_id, marks } = req.body;
    console.log('🎯 Marks Submitted for Course ID:', course_id);
    console.log(marks);
    res.redirect('/grades');
});

module.exports = router;
