import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resourceService, courseService } from '../services/api';

function Resources() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('article');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    loadCourse();
    loadResources();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const response = await courseService.getOne(courseId);
      setCourse(response.data);
    } catch (err) {
      setError('Failed to load course');
    }
  };

  const loadResources = async () => {
    try {
      const response = await resourceService.getAllByCourse(courseId);
      setResources(response.data);
    } catch (err) {
      setError('Failed to load resources');
    }
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await resourceService.create(courseId, { title, url, type, description });
      setTitle('');
      setUrl('');
      setType('article');
      setDescription('');
      setShowForm(false);
      loadResources();
    } catch (err) {
      setError('Failed to create resource');
    }
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await resourceService.delete(id);
        loadResources();
      } catch (err) {
        setError('Failed to delete resource');
      }
    }
  };

  const handleShareOnFacebook = async (id) => {
    setShareMessage('');
    try {
      const response = await resourceService.shareOnFacebook(id);
      setShareMessage('Successfully shared on Facebook!');
      setTimeout(() => setShareMessage(''), 3000);
    } catch (err) {
      setShareMessage('Failed to share on Facebook: ' + (err.response?.data?.details || 'Unknown error'));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/courses')}
        style={{ marginBottom: '20px', padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        ← Back to Courses
      </button>

      <h2>{course?.title || 'Loading...'}</h2>
      <p>{course?.description}</p>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {shareMessage && <div style={{ color: shareMessage.includes('Failed') ? 'red' : 'green', marginBottom: '10px' }}>{shareMessage}</div>}

      <button 
        onClick={() => setShowForm(!showForm)} 
        style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        {showForm ? 'Cancel' : 'Add New Resource'}
      </button>

      {showForm && (
        <form onSubmit={handleCreateResource} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd' }}>
          <div style={{ marginBottom: '15px' }}>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>URL:</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Type:</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="article">Article</option>
              <option value="video">Video</option>
              <option value="link">Link</option>
              <option value="document">Document</option>
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '80px' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
            Add Resource
          </button>
        </form>
      )}

      <div>
        {resources.length === 0 ? (
          <p>No resources yet. Add your first resource!</p>
        ) : (
          resources.map((resource) => (
            <div key={resource.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '5px' }}>
              <h3>{resource.title}</h3>
              <p><strong>Type:</strong> {resource.type}</p>
              <p><strong>URL:</strong> <a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.url}</a></p>
              <p>{resource.description || 'No description'}</p>
              <div style={{ marginTop: '10px' }}>
                <button 
                  onClick={() => handleShareOnFacebook(resource.id)}
                  style={{ padding: '8px 16px', backgroundColor: '#4267B2', color: 'white', border: 'none', cursor: 'pointer', marginRight: '10px' }}
                >
                  Share on Facebook
                </button>
                <button 
                  onClick={() => handleDeleteResource(resource.id)}
                  style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Resources;