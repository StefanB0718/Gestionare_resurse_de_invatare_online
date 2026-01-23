const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');

const router = express.Router();

// all routes need authentication
router.use(authMiddleware);

// get all courses for logged user
router.get('/', getCourses);

// create new course
router.post('/', createCourse);

// get one course by id
router.get('/:id', getCourse);

// update course
router.put('/:id', updateCourse);

// delete course
router.delete('/:id', deleteCourse);

module.exports = router;