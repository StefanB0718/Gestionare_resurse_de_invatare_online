import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../services/api';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // load courses when component loads
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await courseService.getAll();
      setCourses(response.data);
    } catch (err) {
      setError('Failed to load courses');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await courseService.create({ title, description });
      setTitle('');
      setDescription('');
      setShowForm(false);
      loadCourses();
    } catch (err) {
      setError('Failed to create course');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.delete(id);
        loadCourses();
      } catch (err) {
        setError('Failed to delete course');
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>My Courses</h2>
        <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <button 
        onClick={() => setShowForm(!showForm)} 
        style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        {showForm ? 'Cancel' : 'Add New Course'}
      </button>

      {showForm && (
        <form onSubmit={handleCreateCourse} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd' }}>
          <div style={{ marginBottom: '15px' }}>
            <label>Course Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
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
            Create Course
          </button>
        </form>
      )}

      <div>
        {courses.length === 0 ? (
          <p>No courses yet. Create your first course!</p>
        ) : (
          courses.map((course) => (
            <div key={course.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '5px' }}>
              <h3>{course.title}</h3>
              <p>{course.description || 'No description'}</p>
              <p style={{ fontSize: '12px', color: '#666' }}>
                Resources: {course.resources?.length || 0}
              </p>
              <div style={{ marginTop: '10px' }}>
                <button 
                  onClick={() => navigate(`/courses/${course.id}`)}
                  style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', marginRight: '10px' }}
                >
                  View Resources
                </button>
                <button 
                  onClick={() => handleDeleteCourse(course.id)}
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

export default Courses;