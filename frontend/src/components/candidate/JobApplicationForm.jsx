import React, { useState } from "react";
import "./JobApplicationForm.css"; // custom CSS (optional)

const JobApplicationForm = ({ job, candidateId, onClose }) => {
  const [formData, setFormData] = useState({
    coverLetter: "",
    expectedSalary: "",
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataObj = new FormData();
      formDataObj.append("jobId", job._id);
      formDataObj.append("candidateId", candidateId);
      formDataObj.append("coverLetter", formData.coverLetter);
      formDataObj.append("expectedSalary", formData.expectedSalary);
      if (formData.resume) formDataObj.append("resume", formData.resume);

      const response = await fetch("http://localhost:5000/api/applications/apply", {
        method: "POST",
        body: formDataObj,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Application submitted successfully!");
        onClose(); // close modal
      } else {
        alert(result.message || "Failed to apply.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error while submitting application.");
    }
  };

  return (
    <div className="application-modal">
      <div className="application-content">
        <h2>Apply for {job.title}</h2>
        <form onSubmit={handleSubmit} className="application-form">
          <label>Job Title</label>
          <input type="text" value={job.title} disabled />

          <label>Expected Salary</label>
          <input
            type="text"
            name="expectedSalary"
            value={formData.expectedSalary}
            onChange={handleChange}
            required
          />

          <label>Cover Letter</label>
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            required
          ></textarea>

          <label>Upload Resume</label>
          <input
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
          />

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Submit Application</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationForm;
