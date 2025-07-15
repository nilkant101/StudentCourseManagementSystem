const db = require('../db');

exports.getAllCourses = (callback) => {
  db.query('SELECT * FROM courses', callback);
};

exports.getCourseById = (id, callback) => {
  db.query('SELECT * FROM courses WHERE id = ?', [id], callback);
};

exports.addCourse = (course, callback) => {
  db.query('INSERT INTO courses (name) VALUES (?)', [course.name], callback);
};

exports.updateCourse = (id, course, callback) => {
  db.query('UPDATE courses SET name = ? WHERE id = ?', [course.name, id], callback);
};

exports.deleteCourse = (id, callback) => {
  db.query('DELETE FROM courses WHERE id = ?', [id], callback);
};
