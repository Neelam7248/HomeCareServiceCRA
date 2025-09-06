import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{
      backgroundColor: '#333',
      padding: '10px',
      display: 'flex',
      justifyContent: 'center',
      gap: '20px'
    }}> 
    <Link to="/adminsignup" style={{ color: 'white', textDecoration: 'none' }}>AdminSign Up</Link>
<Link to="/adminsignin" style={{ color: 'white', textDecoration: 'none' }}>AdminSign In</Link>

      <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Sign Up</Link>
      <Link to="/signin" style={{ color: 'white', textDecoration: 'none' }}>Sign In</Link>
    </nav>
  );
};

export default Navbar;
