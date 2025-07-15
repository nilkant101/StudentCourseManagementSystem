const express = require('express');
const router = express.Router();
const studentModel = require('../models/studentModel');
const db = require('../db');

// 🧠 GET: List all students
router.get('/', (req, res) => {
  studentModel.getAllStudents((err, result) => {
    if (err) {
      console.error("Error fetching students:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.render('students', { students: result });
  });
});

// 🧠 GET: Show Add Student Form
router.get('/add', (req, res) => {
  const query = 'SELECT * FROM courses';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching courses:', err);
      return res.status(500).send('Error loading form');
    }
    res.render('addStudent', { courses: result });
  });
});

// ✅ POST: Handle Add Student Form Submission
router.post('/add', (req, res) => {
  const { name, email, phone, course_id } = req.body;
  const newStudent = { name, email, phone, course_id };

  studentModel.addStudent(newStudent, (err, result) => {
    if (err) {
      console.error("Error adding student:", err);
      return res.status(500).send("Error saving student");
    }
    res.redirect('/students');
  });
});

// 🧠 GET: Show Edit Student Form
router.get('/edit/:id', (req, res) => {
  const studentId = req.params.id;

  studentModel.getStudentById(studentId, (err, studentResult) => {
    if (err || studentResult.length === 0) {
      console.error("Error fetching student:", err);
      return res.status(404).send("Student not found");
    }

    db.query('SELECT * FROM courses', (err, coursesResult) => {
      if (err) {
        console.error("Error fetching courses:", err);
        return res.status(500).send("Internal Server Error");
      }

      res.render('editStudent', {
        student: studentResult[0],
        courses: coursesResult
      });
    });
  });
});

// ✅ POST: Handle Edit Student Form Submission
router.post('/edit/:id', (req, res) => {
  const studentId = req.params.id;
  const { name, email, phone, course_id } = req.body;

  const updatedStudent = { name, email, phone, course_id };

  studentModel.updateStudent(studentId, updatedStudent, (err, result) => {
    if (err) {
      console.error("Error updating student:", err);
      return res.status(500).send("Update failed");
    }
    res.redirect('/students');
  });
});

// 🗑️ POST: Delete Student
router.post('/delete/:id', (req, res) => {
  const studentId = req.params.id;

  studentModel.deleteStudent(studentId, (err, result) => {
    if (err) {
      console.error("Error deleting student:", err);
      return res.status(500).send("Deletion failed");
    }
    res.redirect('/students');
  });
});

module.exports = router;
