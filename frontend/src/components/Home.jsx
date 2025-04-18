/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-start bg-custom-bg bg-cover bg-center pl-10 md:pl-20"
      style={{
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Left-aligned Content Section */}
      <div className="w-full md:w-1/2 text-left px-6 md:px-12 space-y-6">
        <h1 className="text-5xl md:text-7xl font-extrabold text-black leading-snug">
          Smarter <span className=" font-bold bg-gradient-to-r from-purple-500  to-blue-500 bg-clip-text text-transparent">Examinations</span>, 
          <br /> Seamless Experience
        </h1>
        <p className="text-lg md:text-xl text-white/30 leading-relaxed">
          The future of online exams is here. Conduct secure, efficient, and 
          AI-powered tests with ease.
        </p>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          <Button
            variant="contained"
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-purple-500  to-blue-500 hover:bg-gradient-to-l hover:from-purple-500 hover:to-blue-500 text-white text-lg px-8 py-4 rounded-xl shadow-lg transition-all duration-300"
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/signup")}
            className="border-2 border-black text-black text-lg px-8 py-4 rounded-xl hover:border-gray-700 transition-all duration-300"
          >
            Access Portal
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;