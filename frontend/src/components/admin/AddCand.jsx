import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { getToken } from "./../../utils/auth"; // Admin token for API
const AdminAddUser = ({ onUserAdded }) => {
  const daysOfWeek = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const [resumeFile, setResumeFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    occupation: "",
    userType:"",
    // Candidate fields
    age: "",
    dob: "",
    gender: "",
    skills: "",
    availability: { days: [], hours: "" },
    chargesType:"",
    charges: "",
    experience: "",
    // Client fields
    serviceType: "",
    requiredExperience: "",
    preferredAge: "",
    preferredGender: "",
    preferredChargesType:"",
    maxBudget:"",
    requiredAvailability:""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvailabilitySelect = (e) => {
    const selectedDay = e.target.value;
    if (!selectedDay) return;
    setFormData(prev => ({
      ...prev,
      availability: { ...prev.availability, days: [...prev.availability.days, selectedDay] }
    }));
    e.target.value = "";
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    ["name","email","password","phone","address","occupation","userType"].forEach(f => data.append(f, formData[f] || ""));
    data.append("approved", true); // auto-approved by admin

    if (formData.userType === "candidate") {
      ["age","dob","gender","skills","experience","chargesType","charges"].forEach(f => data.append(f, formData[f] || ""));
      data.append("availability", JSON.stringify(formData.availability));
      if (resumeFile) data.append("resume", resumeFile);
    }

    if (formData.userType === "client") {
      ["serviceType","requiredExperience","preferredChargesType","maxBudget","preferredAge","preferredGender","requiredAvailability"].forEach(f => data.append(f, formData[f] || ""));
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/add-user", {
        method: "POST",
        body: data,
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const result = await res.json();
      if (!res.ok) return alert(result.message || "Add user failed");
      alert(result.message);
      if (onUserAdded) onUserAdded(result.user); // update parent AdminDashboard
      setFormData({ name:"", email:"", password:"", phone:"", address:"", occupation:"", userType:"",
        age:"", dob:"", gender:"", skills:"", availability:{days:[],hours:""}, chargesType:"", charges:"", experience:"",
        serviceType:"", requiredExperience:"", preferredAge:"", preferredGender:"", preferredChargesType:"", maxBudget:"", requiredAvailability:""
      });
      setResumeFile(null);
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded bg-light">
      <h3>Add User</h3>

      <div className="mb-3">
        <label className="form-label">User Type</label>
        <select className="form-select" name="userType" value={formData.userType} onChange={handleChange} required>
          <option value="">-- Select User Type --</option>
          <option value="candidate">Candidate</option>
          <option value="client">Client</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Name</label>
        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Password</label>
        <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Phone</label>
        <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label className="form-label">Address</label>
        <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} />
      </div>

     
      {/* Candidate Fields */}
      {formData.userType === "candidate" && (
        <>
          <div className="mb-3">
            <label className="form-label">DOB</label>
            <input type="date" className="form-control" name="dob" value={formData.dob} onChange={e => {
              const dob = e.target.value;
              const age = calculateAge(dob);
              setFormData(prev => ({ ...prev, dob, age }));
            }} />
            <p>Age: {formData.age}</p>
          </div>

          <div className="mb-3">
            <label className="form-label">Gender</label>
            <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">-- Select Gender --</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Skills</label>
            <input type="text" className="form-control" name="skills" value={formData.skills} onChange={handleChange} placeholder="Comma separated" />
          </div>

          <div className="mb-3">
            <label className="form-label">Availability Days</label>
            <select className="form-select" onChange={handleAvailabilitySelect}>
              <option value="">-- Select a Day --</option>
              {daysOfWeek.filter(day => !formData.availability.days.includes(day)).map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <div className="mt-2">
              {formData.availability.days.map(day => (
                <span key={day} className="badge bg-primary me-1" style={{cursor:"pointer"}} onClick={() => setFormData(prev => ({ ...prev, availability: {...prev.availability, days: prev.availability.days.filter(d => d!==day) } }))}>{day} &times;</span>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Availability Hours</label>
            <input type="text" className="form-control" name="hours" value={formData.availability.hours} onChange={e => setFormData(prev => ({ ...prev, availability: {...prev.availability, hours: e.target.value} }))} placeholder="e.g., 9am-5pm" />
          </div>

          <div className="mb-3">
            <label className="form-label">Charges Type</label>
            <select className="form-select" name="chargesType" value={formData.chargesType} onChange={handleChange}>
              <option value="">-- Select --</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Charges Amount</label>
            <input type="number" className="form-control" name="charges" value={formData.charges} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Experience</label>
            <select className="form-select" name="experience" value={formData.experience} onChange={handleChange}>
              <option value="">Select Experience</option>
              <option value="0-1">0-1 Year</option>
              <option value="1-3">1-3 Years</option>
              <option value="3-5">3-5 Years</option>
              <option value="5+">5+ Years</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Resume Upload</label>
            <input type="file" className="form-control" onChange={e => setResumeFile(e.target.files[0])} />
          </div>
        </>
      )}

      {/* Client Fields */}
      {formData.userType === "client" && (
        <>
          <div className="mb-3">
            <label className="form-label">Service Type Required</label>
            <input type="text" className="form-control" name="serviceType" value={formData.serviceType} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Required Experience</label>
            <input type="text" className="form-control" name="requiredExperience" value={formData.requiredExperience} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Preferred Candidate Age</label>
            <input type="number" className="form-control" name="preferredAge" value={formData.preferredAge} onChange={handleChange} />
          </div>
           <div className="mb-3">
        <label className="form-label">Occupation</label>
        <input type="text" className="form-control" name="occupation" value={formData.occupation} onChange={handleChange} />
      </div>

          <div className="mb-3">
            <label className="form-label">Preferred Candidate Gender</label>
            <select className="form-select" name="preferredGender" value={formData.preferredGender} onChange={handleChange}>
              <option value="">Any</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Preferred Charges Type</label>
            <select className="form-select" name="preferredChargesType" value={formData.preferredChargesType} onChange={handleChange}>
              <option value="">-- Select --</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Maximum Budget (Rs)</label>
            <input type="number" className="form-control" name="maxBudget" value={formData.maxBudget} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Required Availability</label>
            <select className="form-select" name="requiredAvailability" value={formData.requiredAvailability} onChange={handleChange}>
              <option value="">-- Select --</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Weekends">Weekends</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>
        </>
      )}

      <button type="submit" className="btn btn-success">Add User</button>
    </form>
  );
};

export default AdminAddUser;
