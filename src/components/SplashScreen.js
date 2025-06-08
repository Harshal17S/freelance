import React, { useContext, useEffect } from 'react';
import './SplashScreen.css'; // Import the CSS file
import logo from '../assets/image/onlineLogo.jpg'; // Import the logo image
import { motion } from 'framer-motion'; // Import framer-motion
import { Store } from '../Store';

const SplashScreen = () => {
  const { state } = useContext(Store);
  useEffect(() => {
    console.log('SplashScreen mounted');
    // This will help debug if the component is rendering
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const splashContent = document.querySelector('.splash-content');
      if (splashContent) {
        splashContent.classList.add('fade-out');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="splash-container">
      <motion.div
        className="splash-content"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1,
          ease: "easeInOut"
        }}
      >
        <img src={state.logoImg} alt="OnOrder Logo" className="splash-logo" />
        <motion.h1
          className="splash-text"
           initial={{ y: -50, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ duration: 0.8, delay: 0.5 }}
        >
          Welcome to OnOrder!
        </motion.h1>
        <p className="splash-subtext">Loading...</p>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
