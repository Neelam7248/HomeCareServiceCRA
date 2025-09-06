import React, { useState } from 'react';
import './PostJobForm.css'; // custom CSS file

const PostJobForm = ({ clientId }) => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    salary: '',
    timing :'',
    category:'',
    skills: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jobData = {
      ...formData,
      skills: formData.skills.split(',').map(skill => skill.trim()),
      clientId,
    };
 console.log("Submitting with clientId:", clientId);
    try {
      const response = await fetch('http://localhost:5000/api/jobs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Job posted successfully!');
        setFormData({
          title: '',
          location: '',
          salary: '',
          skills: '',
          description: '',
        });
      } else {
        alert(result.message || 'Error posting job');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="job-form">
      <h2>Post a New Job</h2>

      <label>Job Title</label>
      <input type="text" name="title" value={formData.title} onChange={handleChange} required />
<label>Category:</label>
<select name="category" value={formData.category} onChange={handleChange}>
  <option value="Full-time">Full-time</option>
  <option value="Part-time">Part-time</option>
  <option value="Internship">Internship</option>
  <option value="Freelance">Freelance</option>
</select>

      <label>Location</label>
      <input type="text" name="location" value={formData.location} onChange={handleChange} required />

      <label>Salary</label>
      <input type="text" name="salary" value={formData.salary} onChange={handleChange} required />

      <label>Required Skills (comma separated)</label>
      <input type="text" name="skills" value={formData.skills} onChange={handleChange} required />

      <label>Job Description</label>
      <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>

      <button type="submit">Post Job</button>
    </form>
  );
};

export default PostJobForm;
