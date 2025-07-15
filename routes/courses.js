const express = require('express');
const router = express.Router();
const courseModel = require('../models/courseModel');
const db = require('../db');


// List all courses
router.get('/', (req, res) => {
  courseModel.getAllCourses((err, result) => {
    if (err) return res.status(500).send('Error loading courses');
    res.render('courses', { courses: result });
  });
});

// Show Add Form
router.get('/add', (req, res) => {
  res.render('addCourse');
});

// Handle Add Course
router.post('/add', (req, res) => {
  const { name } = req.body;
  courseModel.addCourse({ name }, (err) => {
    if (err) return res.status(500).send('Error adding course');
    res.redirect('/courses');
  });
});

// Show Edit Form
router.get('/edit/:id', (req, res) => {
  courseModel.getCourseById(req.params.id, (err, result) => {
    if (err || result.length === 0) return res.status(404).send('Course not found');
    res.render('editCourse', { course: result[0] });
  });
});

// Handle Edit Submission
router.post('/edit/:id', (req, res) => {
  const { name } = req.body;
  courseModel.updateCourse(req.params.id, { name }, (err) => {
    if (err) return res.status(500).send('Update failed');
    res.redirect('/courses');
  });
});

// Handle Delete
router.post('/delete/:id', (req, res) => {
  courseModel.deleteCourse(req.params.id, (err) => {
    if (err) return res.status(500).send('Delete failed');
    res.redirect('/courses');
  });
});

// View Students and Teachers for a Specific Course
router.get('/:id/students', (req, res) => {
  const courseId = req.params.id;

  const studentQuery = `
    SELECT * FROM students WHERE course_id = ?
  `;

  const teacherQuery = `
    SELECT t.id, t.name
    FROM teachers t
    JOIN teacher_course tc ON t.id = tc.teacher_id
    WHERE tc.course_id = ?
  `;

  const courseNameQuery = `SELECT name FROM courses WHERE id = ?`;

  // First get course name
  courseModel.getCourseById(courseId, (err, courseResult) => {
    if (err || courseResult.length === 0) return res.status(404).send("Course not found");
    const courseName = courseResult[0].name;

    // Get students
    db.query(studentQuery, [courseId], (err1, students) => {
      if (err1) return res.status(500).send("Error loading students");

      // Get teachers
      db.query(teacherQuery, [courseId], (err2, teachers) => {
        if (err2) return res.status(500).send("Error loading teachers");

        res.render('courseStudents', {
          courseId,
          courseName,
          students,
          teachers
        });
      });
    });
  });
});


module.exports = router;
