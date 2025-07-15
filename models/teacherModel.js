const db = require('../db');

// Get all teachers with their assigned courses
exports.getAllTeachers = (callback) => {
  const teacherQuery = 'SELECT * FROM teachers';

  db.query(teacherQuery, (err, teachers) => {
    if (err) return callback(err);

    const teacherIds = teachers.map(t => t.id);
    if (teacherIds.length === 0) return callback(null, []);

    const courseQuery = `
      SELECT tc.teacher_id, c.id, c.name
      FROM teacher_course tc
      JOIN courses c ON tc.course_id = c.id
      WHERE tc.teacher_id IN (?)
    `;

    db.query(courseQuery, [teacherIds], (err, courseData) => {
      if (err) return callback(err);

      const courseMap = {};
      courseData.forEach(c => {
        if (!courseMap[c.teacher_id]) courseMap[c.teacher_id] = [];
        courseMap[c.teacher_id].push({ id: c.id, name: c.name });
      });

      const enrichedTeachers = teachers.map(teacher => ({
        ...teacher,
        courses: courseMap[teacher.id] || []
      }));

      callback(null, enrichedTeachers);
    });
  });
};

// ✅ Add Teacher
exports.addTeacher = (teacher, callback) => {
  const query = 'INSERT INTO teachers (name) VALUES (?)';
  db.query(query, [teacher.name], callback);
};

// ✅ Delete Teacher
exports.deleteTeacher = (id, callback) => {
  const query = 'DELETE FROM teachers WHERE id = ?';
  db.query(query, [id], callback);
};
