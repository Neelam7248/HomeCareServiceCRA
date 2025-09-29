import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUpForm from './components/SignUpForm.jsx';
import SignInForm from './components/SignInForm.jsx';
import Navbar from './components/Navbar.jsx';
import ClientPortal from './pages/ClientPortal.jsx'; //
import CandidatePortal from './pages/CandidatePortal.jsx';
import './App.css';
import AdminSignup from './components/AdminSignUp.jsx';   
import AdminSignin from './components/AdminSignin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import logo from './images/logo.png'
import HomePage from './pages/HomePage';
import HomeLayout from './components/HomeLayout.jsx';
function App() {
   const clientId = '664f2b29b12f20a1cd22a123'; // ⬅️ Add this
  return (
  
      <>
       <div className="header">
        <img src={logo} alt="Logo" width="100" height="70" />
        <h1>Career Connect</h1>
      </div>
        


        <Routes>
          {/* Home page with Navbar */}
        <Route path="/" element={<HomeLayout><HomePage /></HomeLayout>} />


          <Route path="/adminsignup" element={<AdminSignup />} />
       <Route path="/adminsignin" element={<AdminSignin />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/signin" element={<SignInForm />} />
        <Route path="/pages/clientportal" element={<ClientPortal clientId={clientId} />} /> {/* ✅ added route */}
        <Route path="/pages/candidateportal" element={<CandidatePortal />} />
        <Route path="/pages/admindashboard" element={<AdminDashboard />} />

        </Routes>
      </>
  
  );
}

export default App;
