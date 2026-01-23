const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

// get all resources from a course
const getResources = async (req, res) => {
  try {
    const { courseId } = req.params;

    // check if course exists and belongs to user
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const resources = await prisma.resource.findMany({
      where: { courseId: parseInt(courseId) },
      orderBy: { createdAt: 'desc' }
    });

    res.json(resources);
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// get one resource by id
const getResource = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await prisma.resource.findUnique({
      where: { id: parseInt(id) },
      include: {
        course: true
      }
    });

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // check if resource belongs to user
    if (resource.course.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(resource);
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// create new resource
const createResource = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, url, type, description } = req.body;

    if (!title || !url || !type) {
      return res.status(400).json({ error: 'Title, URL and type are required' });
    }

    // check if course belongs to user
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        url,
        type,
        description,
        courseId: parseInt(courseId)
      }
    });

    res.status(201).json(resource);
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// update a resource
const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, type, description } = req.body;

    const resource = await prisma.resource.findUnique({
      where: { id: parseInt(id) },
      include: { course: true }
    });

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    if (resource.course.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedResource = await prisma.resource.update({
      where: { id: parseInt(id) },
      data: {
        title: title || resource.title,
        url: url || resource.url,
        type: type || resource.type,
        description: description !== undefined ? description : resource.description
      }
    });

    res.json(updatedResource);
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// delete a resource
const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await prisma.resource.findUnique({
      where: { id: parseInt(id) },
      include: { course: true }
    });

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    if (resource.course.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.resource.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// share resource on facebook
const shareOnFacebook = async (req, res) => {
  try {
    const { id } = req.params;

    // find the resource and include course info
    const resource = await prisma.resource.findUnique({
      where: { id: parseInt(id) },
      include: { course: true }
    });

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // verify resource belongs to the authenticated user
    if (resource.course.userId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // get Facebook credentials from environment variables
    const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    const PAGE_ID = process.env.FACEBOOK_PAGE_ID;

    // check if Facebook credentials are configured
    if (!PAGE_ACCESS_TOKEN || !PAGE_ID) {
      return res.status(500).json({ 
        error: 'Facebook credentials not configured' 
      });
    }

    // try to post on Facebook page
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${PAGE_ID}/feed`,
        {
          message: `Check out this learning resource: ${resource.title}\n\n${resource.description || ''}`,
          link: resource.url
        },
        {
          params: {
            access_token: PAGE_ACCESS_TOKEN
          }
        }
      );

      // log successful share event
      await prisma.shareEvent.create({
        data: {
          resourceId: resource.id,
          userId: req.userId,
          status: 'SUCCESS'
        }
      });

      res.json({
        success: true,
        message: 'Resource shared on Facebook successfully',
        postId: response.data.id
      });

    } catch (fbError) {
      console.error('Facebook API error:', fbError.response?.data || fbError.message);

      // log failed share event
      await prisma.shareEvent.create({
        data: {
          resourceId: resource.id,
          userId: req.userId,
          status: 'FAILED'
        }
      });

      res.status(500).json({
        error: 'Failed to share on Facebook',
        details: fbError.response?.data?.error?.message || fbError.message
      });
    }

  } catch (error) {
    console.error('Share resource error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  shareOnFacebook
}; 