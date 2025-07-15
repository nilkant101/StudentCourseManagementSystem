const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import routes
const studentRoutes = require('./routes/students');
app.use('/students', studentRoutes);

const attendanceRoutes = require('./routes/attendance');
const gradeRoutes = require('./routes/grades');


app.use('/attendance', attendanceRoutes);
app.use('/grades', gradeRoutes);

const courseRoutes = require('./routes/courses');
app.use('/courses', courseRoutes);

const teacherRoutes = require('./routes/teachers');
app.use('/teachers', teacherRoutes);

// Dashboard route
app.get('/', (req, res) => {
    res.render('dashboard');
});

app.get('/test', (req, res) => {
  const sampleData = [
    { id: 1, name: 'Test User', email: 'test@mail.com', phone: '1234567890', course_name: 'Java' }
  ];
  res.render('students', { students: sampleData });
});




app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
