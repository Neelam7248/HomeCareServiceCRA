import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../utils/auth';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userType) {
      alert("Please select a user type (Candidate or Client)");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, userType })
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || 'Login failed');
        return;
      }

      alert(result.message);
      setToken(result.token);
      localStorage.setItem('userId', result.user.id);
      localStorage.setItem('userName', result.user.name || '');
      localStorage.setItem('userType', result.user.userType);

      if (result.user.userType === 'candidate') {
        navigate('/pages/CandidatePortal');
      } else {
        navigate('/pages/ClientPortal');
      }

    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong!');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#d9a3a3ff' }}>
      <form 
        onSubmit={handleSubmit} 
        style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign In</h2>

        <label>User Type:</label>
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
          required
        >
          <option value="">-- Select User Type --</option>
          <option value="candidate">Candidate</option>
          <option value="client">Client</option>
        </select>

        <label>Email:</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
        />

        <label>Password:</label>
        <input
          type="password"
          required
           autoComplete="new-password"  // ✅ disable autofill for password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
        />

        <button 
          type="submit" 
          style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignInForm;
