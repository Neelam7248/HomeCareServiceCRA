import React from 'react';
import { Link } from "react-router-dom";
import logo from '../images/logo.png';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./HomePage.css";
import Navbar from "./../components/Navbar";
function HomePage() {
  return (
    <div className="hero-container">
      {/* Background Video */}
      <video className="hero-video" autoPlay loop muted>
        <source src="/banner.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Hero Text Content */}
      <div className="hero-content">
        <h1>Hire Trusted Helpers for Your Home</h1>
        <p>Find Babysitters, Cooks, and Maids – All in one platform</p>
        <Link to="/signup">
        <button className="hero-button">Get Started</button>
      </Link>
      </div>
    </div>
  );
}

export default HomePage;
