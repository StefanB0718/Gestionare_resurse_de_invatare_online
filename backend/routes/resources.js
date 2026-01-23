const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  shareOnFacebook
} = require('../controllers/resourceController');

const router = express.Router();

// all routes need authentication
router.use(authMiddleware);

// get all resources from a course
router.get('/courses/:courseId/resources', getResources);

// create new resource in a course
router.post('/courses/:courseId/resources', createResource);

// get one resource by id
router.get('/:id', getResource);

// update resource
router.put('/:id', updateResource);

// delete resource
router.delete('/:id', deleteResource);

// share resource on facebook
router.post('/:id/share/facebook', shareOnFacebook);

module.exports = router;