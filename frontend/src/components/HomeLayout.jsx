import React from 'react';
import Navbar from './Navbar';

function HomeLayout({ children }) {
  return (
    <>
      <Navbar />  {/* Navbar sirf home page par dikhayega */}
      {children}
    </>
  );
}

export default HomeLayout;
