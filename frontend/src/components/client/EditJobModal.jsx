import React, { useState } from 'react';

const EditJobModal = ({ job, onClose, onJobUpdated, handleDelete }) => {
  const [formData, setFormData] = useState({
    title: job.title,
    location: job.location,
    salary: job.salary,
    timing: job.timing || '',
    category: job.category || 'Full-time',
    skills: job.skills.join(', '),
    description: job.description,
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async () => {
    const updatedJob = {
      ...formData,
      skills: formData.skills.split(',').map(skill => skill.trim())
    };

    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${job._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedJob)
      });

      const result = await res.json();

      if (res.ok) {
        alert('Job updated successfully!');
        onJobUpdated();
      } else {
        alert(result.message || 'Update failed.');
      }
    } catch (err) {
      console.error('Error updating job:', err);
      alert('Server error.');
    }
  };

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      handleDelete(job._id);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Edit Job</h2>

        <label>Title:</label>
        <input name="title" value={formData.title} onChange={handleChange} />

        <label>Location:</label>
        <input name="location" value={formData.location} onChange={handleChange} />

        <label>Salary:</label>
        <input name="salary" value={formData.salary} onChange={handleChange} />

        <label>Timing:</label>
        <input name="timing" value={formData.timing} onChange={handleChange} />

        <label>Category:</label>
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Freelance">Freelance</option>
        </select>

        <label>Skills (comma separated):</label>
        <input name="skills" value={formData.skills} onChange={handleChange} />

        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />

        <div style={styles.buttons}>
          <button onClick={handleUpdate} style={styles.updateBtn}>Update</button>
          <button onClick={handleDeleteClick} style={styles.deleteBtn}>Delete</button>
          <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px'
  },
  updateBtn: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  cancelBtn: {
    backgroundColor: '#6c757d',
    color: 'white',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default EditJobModal;
