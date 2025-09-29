import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { setToken } from "../utils/auth";

const SignUp = () => {
  const navigate = useNavigate();
  const daysOfWeek = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const [serverMessage, setServerMessage] = useState("");
const [messageType, setMessageType] = useState("success"); // success | danger | warning

  const [resumeFile, setResumeFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", phone: "", address: "", occupation: "",
    userType:"", age: "", dob: "", gender: "", skills: "",
    availability: { days: [], hours: "" },
    chargesType:"", charges: "", experience: "",
    serviceType: "", requiredExperience: "", preferredAge: "", preferredGender: "",
    preferredChargesType:"", maxBudget:"", requiredAvailability :""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("userType", formData.userType);

    ["name","email","password","phone","address","occupation"].forEach((field) => {
      formDataToSend.append(field, formData[field] || "");
    });

    if (formData.userType === "candidate") {
      ["age","dob","gender","skills","experience","chargesType","charges"].forEach((field) => {
        formDataToSend.append(field, formData[field] || "");
      });

      formDataToSend.append(
        "availability",
        JSON.stringify(formData.availability || { days: [], hours: "" })
      );

      if (resumeFile) formDataToSend.append("resume", resumeFile);
    }

    if (formData.userType === "client") {
      ["serviceType","requiredExperience","preferredChargesType",
      "maxBudget","preferredAge","preferredGender","requiredAvailability" ].forEach((field) => {
        formDataToSend.append(field, formData[field] || "");
      });
    }

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();
      if (!response.ok) {
        alert(result.message || "Signup failed");
        return;
      }
if (!response.ok) {
  setServerMessage(result.message || "Signup failed");
  setMessageType("danger");
  return;
}

if (result.requiresApproval) {
  setServerMessage("Signup successful. Your account is pending admin approval.");
  setMessageType("warning");
  navigate("/");
  return;
}

setServerMessage(result.message || "Signup successful!");
setMessageType("success");
setToken(result.token);
navigate("/");

      alert(result.message);
      setToken(result.token);

      if (formData.userType === "client") {
        navigate("/");
      } else if (formData.userType === "candidate") {
        navigate("/");
      }

    } catch (error) {
      console.error("Form submit error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white text-center">
              <h4>Sign Up</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="row g-3">

                {/* Name */}
                <div className="col-md-6">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control"
                    name="name" value={formData.name} onChange={handleChange} required />
                </div>

                {/* Email */}
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control"
                    name="email" value={formData.email} onChange={handleChange} required />
                </div>

                {/* Password */}
                <div className="col-md-6">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control"
                    name="password" value={formData.password} onChange={handleChange} required />
                </div>

                {/* Phone */}
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input type="text" className="form-control"
                    name="phone" value={formData.phone} onChange={handleChange} required />
                </div>

                {/* Address */}
                <div className="col-md-12">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-control"
                    name="address" value={formData.address} onChange={handleChange} required />
                </div>

                {/* User Type */}
                <div className="col-md-6">
                  <label className="form-label">User Type</label>
                  <select className="form-select"
                    name="userType" value={formData.userType} onChange={handleChange} required>
                    <option value="">-- Select User Type --</option>
                    <option value="client">Client</option>
                    <option value="candidate">Candidate</option>
                  </select>
                </div>

                {/* ✅ Candidate Extra Fields */}
                {/* ✅ Candidate Extra Fields */}
{formData.userType === "candidate" && (
  <>
    {/* Resume */}
    <div className="col-md-6">
      <label className="form-label">Upload Resume</label>
      <input type="file" className="form-control"
        onChange={(e) => setResumeFile(e.target.files[0])} />
    </div>

    {/* DOB */}
    <div className="col-md-6">
      <label className="form-label">Date of Birth</label>
      <input type="text" className="form-control"
        name="dob" placeholder="YYYY-MM-DD"
        value={formData.dob || ""}
        onChange={(e) => {
          const dob = e.target.value;
          const age = calculateAge(dob);
          setFormData(prev => ({ ...prev, dob, age }));
        }} required />
      <small className="text-muted">Age: {formData.age}</small>
    </div>

    {/* Gender */}
    <div className="col-md-6">
      <label className="form-label">Gender</label>
      <select className="form-select"
        name="gender" value={formData.gender} onChange={handleChange} required>
        <option value="">-- Select Gender --</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </div>

    {/* ✅ Availability Days */}
    <div className="col-md-6">
      <label className="form-label">Available Days</label>
      <select className="form-select"
        onChange={(e) => {
          const selectedDay = e.target.value;
          if (!selectedDay) return;
          setFormData(prev => {
            const currentDays = prev.availability?.days || [];
            return {
              ...prev,
              availability: {
                ...prev.availability,
                days: [...currentDays, selectedDay]
              }
            };
          });
          e.target.value = ""; // reset select
        }}
      >
        <option value="">-- Select a Day --</option>
        {daysOfWeek
          .filter(day => !(formData.availability?.days || []).includes(day))
          .map(day => (
            <option key={day} value={day}>{day}</option>
        ))}
      </select>

      {/* Display selected days */}
      <div className="mt-2">
        {formData.availability?.days?.map((day, index) => (
          <span key={index}
            className="badge bg-primary me-1"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                availability: {
                  ...prev.availability,
                  days: prev.availability.days.filter(d => d !== day)
                }
              }));
            }}
          >
            {day} &times;
          </span>
        ))}
      </div>
    </div>

    {/* ✅ Availability Hours */}
    <div className="col-md-6">
      <label className="form-label">Available Hours</label>
      <input type="text" className="form-control"
        placeholder="e.g., 9am-5pm"
        value={formData.availability.hours}
        onChange={(e) =>
          setFormData(prev => ({
            ...prev,
            availability: {
              ...prev.availability,
              hours: e.target.value
            }
          }))
        }
      />
    </div>

    {/* Charges Type */}
    <div className="col-md-6">
      <label className="form-label">Charges Type</label>
      <select className="form-select"
        name="chargesType" value={formData.chargesType} onChange={handleChange} required>
        <option value="">-- Select Charges --</option>
        <option value="hourly">Hourly</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>
    </div>

    {/* Charges */}
    <div className="col-md-6">
      <label className="form-label">Charges (Rs)</label>
      <input type="number" className="form-control"
        name="charges" placeholder="Enter charges in Rs"
        value={formData.charges || ""} onChange={handleChange} min="0" />
    </div>

    {/* Experience */}
    <div className="col-md-6">
      <label className="form-label">Experience</label>
      <select className="form-select"
        name="experience" value={formData.experience} onChange={handleChange} required>
        <option value="">Select Experience</option>
        <option value="0-1">0–1 Year</option>
        <option value="1-3">1–3 Years</option>
        <option value="3-5">3–5 Years</option>
        <option value="5+">5+ Years</option>
      </select>
    </div>

    {/* Skills */}
    <div className="col-md-6">
      <label className="form-label">Skills</label>
      <select className="form-select"
        name="skills" value={formData.skills} onChange={handleChange} required>
        <option value="">-- Select Skill --</option>
        <option value="baby sitter">Baby Sitter</option>
        <option value="cook">Cook</option>
        <option value="maid">Maid</option>
      </select>
    </div>
  </>
)}

                {/* ✅ Client Extra Fields */}
               {formData.userType === "client" && (
  <>
    {/* Occupation */}
    <div className="col-md-6">
      <label className="form-label">Occupation</label>
      <select className="form-select"
        name="occupation" value={formData.occupation} onChange={handleChange}>
        <option value="">Select Occupation</option>
        <option value="business_owner">Business Owner</option>
        <option value="student">Student</option>
        <option value="company_director">Company Director</option>
        <option value="freelancer">Freelancer</option>
        <option value="retired">Retired</option>
        <option value="other">Other</option>
      </select>
    </div>

    {/* Service Type */}
    <div className="col-md-6">
      <label className="form-label">Service Type Required</label>
      <select className="form-select"
        name="serviceType" value={formData.serviceType} onChange={handleChange} required>
        <option value="">Select Service</option>
        <option value="baby sitter">Baby Sitter</option>
        <option value="maid">Maid</option>
        <option value="cook">Cook</option>
      </select>
    </div>

    {/* Required Experience */}
    <div className="col-md-6">
      <label className="form-label">Required Experience</label>
      <select className="form-select"
        name="requiredExperience" value={formData.requiredExperience} onChange={handleChange}>
        <option value="">Select Experience</option>
        <option value="0-1">0-1 Year</option>
        <option value="1-3">1-3 Years</option>
        <option value="3-5">3-5 Years</option>
        <option value="5+">5+ Years</option>
      </select>
    </div>

    {/* Preferred Charges Type */}
    <div className="col-md-6">
      <label className="form-label">Preferred Charges Type</label>
      <select className="form-select"
        name="preferredChargesType" value={formData.preferredChargesType} onChange={handleChange}>
        <option value="">Select Type</option>
        <option value="hourly">Hourly</option>
        <option value="daily">Daily</option>
        <option value="monthly">Monthly</option>
      </select>
    </div>

    {/* Max Budget */}
    <div className="col-md-6">
      <label className="form-label">Max Budget</label>
      <input type="number" className="form-control"
        name="maxBudget" value={formData.maxBudget} onChange={handleChange} />
    </div>

    {/* Preferred Age */}
    <div className="col-md-6">
      <label className="form-label">Preferred Age</label>
      <input type="number" className="form-control"
        name="preferredAge" value={formData.preferredAge} onChange={handleChange} />
    </div>

    {/* Preferred Gender */}
    <div className="col-md-6">
      <label className="form-label">Preferred Gender</label>
      <select className="form-select"
        name="preferredGender" value={formData.preferredGender} onChange={handleChange}>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="any">Any</option>
      </select>
    </div>
  </>
)}

                <div className="col-12 text-center">
                  <button type="submit" className="btn btn-primary px-5">Sign Up</button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
