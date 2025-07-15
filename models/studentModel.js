const db = require('../db');

// Get all students with course name
exports.getAllStudents = (callback) => {
  const query = `
    SELECT students.*, courses.name AS course_name
    FROM students
    LEFT JOIN courses ON students.course_id = courses.id
  `;
  db.query(query, callback);
};

// Get one student by ID
exports.getStudentById = (id, callback) => {
  const query = `SELECT * FROM students WHERE id = ?`;
  db.query(query, [id], callback);
};

// Add new student
exports.addStudent = (student, callback) => {
  const query = `INSERT INTO students (name, email, phone, course_id) VALUES (?, ?, ?, ?)`;
  const values = [student.name, student.email, student.phone, student.course_id];
  db.query(query, values, callback);
};

// Update student
exports.updateStudent = (id, student, callback) => {
  const query = `
    UPDATE students SET name = ?, email = ?, phone = ?, course_id = ?
    WHERE id = ?
  `;
  const values = [student.name, student.email, student.phone, student.course_id, id];
  db.query(query, values, callback);
};

// Delete student
exports.deleteStudent = (id, callback) => {
  const query = `DELETE FROM students WHERE id = ?`;
  db.query(query, [id], callback);
};
