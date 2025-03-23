import React from "react";
import "./Hero.css";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
      <div className="hero">
        {/* <SplashCursor/> */}
      <div className="hero_text">
        <h1>Bridge the Gap with Sign Language.</h1>
        <p>
          Instantly convert text or speech into regional sign languages! Connect, 
          communicate, and create inclusivity—anytime, anywhere.
        </p>
        <div className="buttons">
           <Link to="/translate" className="button">Sign to Text</Link>
           <Link to="/texttosign" className="button">Text to Sign</Link>
        </div>
      </div>
      <div className="bg_img">
      <img 
        src={`${process.env.PUBLIC_URL}/assests/bg.jpg`} 
        alt="Background" 
        loading="eager"
      />
      </div>

    </div>
  );
};

export default Hero;
