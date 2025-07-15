const express = require('express');
const router = express.Router();
const teacherModel = require('../models/teacherModel');
const courseModel = require('../models/courseModel');
const db = require('../db');

// GET all teachers with assigned courses
router.get('/', (req, res) => {
  const query = `
    SELECT t.id AS teacher_id, t.name AS teacher_name, c.id AS course_id, c.name AS course_name
    FROM teachers t
    LEFT JOIN teacher_course tc ON t.id = tc.teacher_id
    LEFT JOIN courses c ON tc.course_id = c.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching teachers:", err);
      return res.status(500).send("Internal Server Error");
    }

    const teacherMap = {};
    results.forEach(row => {
      if (!teacherMap[row.teacher_id]) {
        teacherMap[row.teacher_id] = {
          id: row.teacher_id,
          name: row.teacher_name,
          courses: []
        };
      }
      if (row.course_id) {
        teacherMap[row.teacher_id].courses.push({ id: row.course_id, name: row.course_name });
      }
    });

    const teachers = Object.values(teacherMap);
    res.render('teachers', { teachers });
  });
});

// GET: Add Teacher form
router.get('/add', (req, res) => {
  courseModel.getAllCourses((err, courses) => {
    if (err) return res.status(500).send("Failed to load courses");
    res.render('addTeacher', { courses });
  });
});

// POST: Add Teacher
router.post('/add', (req, res) => {
  const { name } = req.body;
  let courseIds = req.body.course_ids;
  if (!Array.isArray(courseIds)) courseIds = courseIds ? [courseIds] : [];

  const insertTeacher = 'INSERT INTO teachers (name) VALUES (?)';
  db.query(insertTeacher, [name], (err, result) => {
    if (err) return res.status(500).send("Failed to add teacher");
    const teacherId = result.insertId;

    if (courseIds.length === 0) return res.redirect('/teachers');

    const values = courseIds.map(cid => [teacherId, cid]);
    const insertCourses = 'INSERT INTO teacher_course (teacher_id, course_id) VALUES ?';
    db.query(insertCourses, [values], (err2) => {
      if (err2) return res.status(500).send("Failed to assign courses");
      res.redirect('/teachers');
    });
  });
});

// GET: Edit Teacher
router.get('/edit/:id', (req, res) => {
  const teacherId = req.params.id;
  const teacherQuery = 'SELECT * FROM teachers WHERE id = ?';
  const courseQuery = 'SELECT * FROM courses';
  const assignedQuery = 'SELECT course_id FROM teacher_course WHERE teacher_id = ?';

  db.query(teacherQuery, [teacherId], (err, teacherResult) => {
    if (err || teacherResult.length === 0) return res.status(404).send("Teacher not found");

    const teacher = teacherResult[0];

    db.query(courseQuery, (err2, allCourses) => {
      if (err2) return res.status(500).send("Failed to load courses");

      db.query(assignedQuery, [teacherId], (err3, assignedCourses) => {
        if (err3) return res.status(500).send("Failed to load assigned courses");

        const assignedIds = assignedCourses.map(c => c.course_id);
        res.render('editTeacher', {
          teacher,
          courses: allCourses,
          assignedCourseIds: assignedIds
        });
      });
    });
  });
});

// POST: Edit Teacher
router.post('/edit/:id', (req, res) => {
  const teacherId = req.params.id;
  const { name } = req.body;
  let courseIds = req.body.course_ids;
  if (!Array.isArray(courseIds)) courseIds = courseIds ? [courseIds] : [];

  const updateTeacher = 'UPDATE teachers SET name = ? WHERE id = ?';
  db.query(updateTeacher, [name, teacherId], (err) => {
    if (err) return res.status(500).send("Failed to update teacher");

    const deleteOld = 'DELETE FROM teacher_course WHERE teacher_id = ?';
    db.query(deleteOld, [teacherId], (err2) => {
      if (err2) return res.status(500).send("Failed to clear old courses");

      if (courseIds.length === 0) return res.redirect('/teachers');

      const values = courseIds.map(cid => [teacherId, cid]);
      const insertNew = 'INSERT INTO teacher_course (teacher_id, course_id) VALUES ?';
      db.query(insertNew, [values], (err3) => {
        if (err3) return res.status(500).send("Failed to assign new courses");
        res.redirect('/teachers');
      });
    });
  });
});

// POST: Delete Teacher
router.post('/delete/:id', (req, res) => {
  const teacherId = req.params.id;
  const deleteCourses = 'DELETE FROM teacher_course WHERE teacher_id = ?';
  const deleteTeacher = 'DELETE FROM teachers WHERE id = ?';

  db.query(deleteCourses, [teacherId], (err1) => {
    if (err1) return res.status(500).send("Failed to delete linked courses");

    db.query(deleteTeacher, [teacherId], (err2) => {
      if (err2) return res.status(500).send("Failed to delete teacher");
      res.redirect('/teachers');
    });
  });
});

module.exports = router;
