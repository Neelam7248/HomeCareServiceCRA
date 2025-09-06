import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {setToken} from "../utils/auth"
const SignUp = () => {
  const navigate = useNavigate();
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
    dob: "",  // keep only DOB
    gender: "",
    skills: "",
    availability: {
  days: [],      // array of selected days
  hours: ""      // e.g., "9am-5pm"
}
,chargesType:"",
    charges: "",
    experience: "",

    // Client requirement fields
    serviceType: "",
    requiredExperience: "",
    preferredAge: "",
    preferredGender: "",
     preferredChargesType:"", // hourly/daily/weekly
  maxBudget:"",
  requiredAvailability :""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  //handle user tp
  
// Function to calculate age from DOB
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
// Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("userType", formData.userType);

    // Common fields
    ["name","email","password","phone","address","occupation"].forEach((field) => {
      formDataToSend.append(field, formData[field] || "");
    });

    if (formData.userType === "candidate") {
  ["age","dob","gender","skills","experience","chargesType","charges"].forEach((field) => {
    formDataToSend.append(field, formData[field] || "");
  });

  // Handle availability separately
  formDataToSend.append(
    "availability",
    JSON.stringify(formData.availability || { days: [], hours: "" })
  );

  // Append resume file if exists
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

      alert(result.message);
setToken(result.token)
      if (formData.userType === "client") {
        navigate("/clientPortal");
      } else if (formData.userType === "candidate") {
        navigate("/candidatePortal");
      }

    } catch (error) {
      console.error("Form submit error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit}>
  <div className="mb-3">
    <label className="form-label">Name</label>
    <input
      type="text"
      className="form-control"
      name="name"
      value={formData.name}
      onChange={handleChange}
      required
    />
  </div>

  <div className="mb-3">
    <label className="form-label">Email</label>
    <input
      type="email"
      className="form-control"
      name="email"
      value={formData.email}
      onChange={handleChange}
      required
    />
  </div>
  <div className="mb-3">
  <label className="form-label">Password</label>
  <input
    type="password"
    className="form-control"
    name="password"
    placeholder="Enter your password"
    value={formData.password}
    onChange={handleChange}
    required
  />
</div>
<div className="mb-3">
  <label className="form-label">Phone</label>
  <input
    type="text"
    className="form-control"
    name="phone"
    placeholder="Enter your phone number"
    value={formData.phone}
    onChange={handleChange}
    required
  />
</div>

<div className="mb-3">
  <label className="form-label">Address</label>
  <input
    type="text"
    className="form-control"
    name="address"
    placeholder="Enter your address"
    value={formData.address}
    onChange={handleChange}
    required
  />
</div>


  {/* ✅ UserType Selection */}
  <div className="mb-3">
    <label className="form-label">Select User Type</label>
    <select
      className="form-select"
      name="userType"
      value={formData.userType}
      onChange={handleChange}
      required
    >
      <option value="">-- Select User Type --</option>
      <option value="client">Client</option>
      <option value="candidate">Candidate</option>
    </select>
  </div>

  {/* ✅ Candidate extra fields */}
  {formData.userType === "candidate" && (
    <>
    <section>
      <h2>Basic Information</h2>
   <div className="mb-3">
  <label className="form-label">Upload Resume</label>
  <input
    type="file"
    className="form-control"
    onChange={(e) => setResumeFile(e.target.files[0])}
  />
</div>
<div className="mb-3">
  <label className="form-label">Date of Birth (YYYY-MM-DD)</label>
  <input
    type="text"
    name="dob"
    className="form-control"
    placeholder="YYYY-MM-DD"
    value={formData.dob || ""}
    onChange={(e) => {
      const dob = e.target.value;
      const age = calculateAge(dob);
      setFormData(prev => ({ ...prev, dob, age }));
    }}
    required
  />
  <p>Calculated Age: {formData.age}</p>
</div>

<div className="mb-3">
      <label className="form-label">Gender:</label>
      <select
        className="form-select"
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        required
      >
        <option value="">-- Select Gender --</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

    </div>  

      
    </section>
<section>
      <h2> Information About Availability and skills</h2>
    

<div className="mb-3">
  <label className="form-label">Available Days:</label>
  <select
    className="form-select"
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
      <span
        key={index}
        className="badge bg-primary me-1"
        style={{cursor:"pointer"}}
        onClick={() => {
          // remove day on click
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
<div className="mb-3">
  <label className="form-label">Available Hours:</label>
  <input
    type="text"
    className="form-control"
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
<section>
  <h2>Work Details</h2>

  {/* Charges selection */}
  <div className="mb-3">
    <label className="form-label">Charges:</label>
    <select
      className="form-select"
      name="chargesType"
      value={formData.chargesType}
      onChange={handleChange}
      required
    >
      <option value="">-- Select Charges --</option>
      <option value="hourly">Hourly</option>
      <option value="daily">Daily</option>
      <option value="weekly">Weekly</option>
    </select>
  </div>
<div className="mb-3">
  <label className="form-label">Charges (in Rupees)</label>
  <input
    type="number"
    name="charges"
    className="form-control"
    placeholder="Enter charges in Rs"
    value={formData.charges || ""}
    onChange={handleChange}
    min="0"
  />
</div>
<div className="mb-3">
  <label className="form-label"> Experience</label>
  <select className="form-select"
   name="experience"
   onChange={handleChange}
    value={formData.experience} required >
    <option value="">Select Experience</option>
    <option value="0-1">0–1 Year</option>
    <option value="1-3">1–3 Years</option>
    <option value="3-5">3–5 Years</option>
    <option value="5+">5+ Years</option>
  </select>
</div>


</section>


<div className="mb-3">
  <label className="form-label">Skills:</label>
  <select
    className="form-select"
    name="skills"          // using 'category' from your formData
    value={formData.skills}
    onChange={handleChange}
    required
  >
    <option value="">-- Select Skill --</option>
    <option value="baby sitter">Baby Sitter</option>
    <option value="cook">Cook</option>
    <option value="maid">Maid</option>
  </select>
</div>

</section>
    </>
  )}

  {/* ✅ Client extra fields */}
  {formData.userType === "client" && (
    <><div className="mb-3">
        <select
  className="form-select"
  name="occupation"
  value={formData.occupation}       // <- value state se bind
  onChange={handleChange}           // <- change hone par state update
>
  <option value="">Select Occupation</option>
  <option value="business_owner">Business Owner</option>
  <option value="student">Student</option>


  <option value="company_director">Company Director</option>
  <option value="freelancer">Freelancer</option>
  <option value="student">Student</option>
  <option value="retired">Retired</option>
  <option value="other">Other</option>
</select>

      </div>
      <div className="mb-3">
  <label className="form-label">Service Type Required</label>
  <select className="form-select" name="serviceType"
   onChange={handleChange} value={formData.serviceType}   required>
    <option value="">Select Service</option>
    <option value="baby sitter">Baby Sitter</option>
    <option value="maid">Maid</option>
    <option value="cook">Cook</option>
  </select>
</div>

<div className="mb-3">
  <label className="form-label">Required Experience</label>
  <select className="form-select"
   name="requiredExperience"
   onChange={handleChange}
    value={formData.requiredExperience} required >
    <option value="">Select Experience</option>
    <option value="0-1">0–1 Year</option>
    <option value="1-3">1–3 Years</option>
    <option value="3-5">3–5 Years</option>
    <option value="5+">5+ Years</option>
  </select>
</div>
<div className="mb-3">
    <label>Preferred Candidate Age</label>
    <input 
      type="number" 
      name="preferredAge" 
      className="form-control" 
      placeholder="Enter preferred age" 
      value={formData.preferredAge} 
      onChange={handleChange} 
      min="0"
    />
  </div>

<div className="mb-3">
  <label className="form-label">Preferred Candidate Gender</label>
  <select className="form-select" name="preferredGender" onChange={handleChange} value={formData.preferredGender} required>
    <option value="">Any</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
  </select>
</div>{/* Required Availability */}
<div className="mb-3">
  <label className="form-label">Required Availability</label>
  <select
    className="form-select"
    name="requiredAvailability"
    onChange={handleChange}
    value={formData.requiredAvailability || ""}
    required
  >
    <option value="">Select Availability</option>
    <option value="Full-time">Full-time</option>
    <option value="Part-time">Part-time</option>
    <option value="Weekends">Weekends</option>
    <option value="Flexible">Flexible</option>
  </select>
</div>

{/* Preferred Charges Type */}
<div className="mb-3">
  <label className="form-label">Preferred Charges Type</label>
  <select
    className="form-select"
    name="preferredChargesType"
    onChange={handleChange}
    value={formData.preferredChargesType || ""}
    required
  >
    <option value="">Select Charges Type</option>
    <option value="hourly">Hourly</option>
    <option value="daily">Daily</option>
    <option value="weekly">Weekly</option>
  </select>
</div>

{/* Budget in Rs */}
<div className="mb-3">
  <label className="form-label">Maximum Budget (in Rs)</label>
  <input
    type="number"
    name="maxBudget"
    className="form-control"
    placeholder="Enter max budget in Rs"
    value={formData.maxBudget || ""}
    onChange={handleChange}
    min="0"
    required
  />
</div>

    </>
  )}

  <button type="submit" className="btn btn-primary">
    Sign Up
  </button>
</form>


    </div>
  );
};
export default SignUp;
