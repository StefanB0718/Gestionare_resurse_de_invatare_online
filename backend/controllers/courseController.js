const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all courses for logged user
const getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: { userId: req.userId },
      include: {
        resources: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single course
const getCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
      include: {
        resources: true
      }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Verifică ownership
    if (course.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create course
const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        userId: req.userId
      }
    });

    res.status(201).json(course);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Verifică ownership
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        title: title || course.title,
        description: description !== undefined ? description : course.description
      }
    });

    res.json(updatedCourse);
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifică ownership
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.course.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
};