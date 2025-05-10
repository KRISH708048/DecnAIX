import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Service4 from "../../assets/svg/robot.png";
import "./effect.css";
import Service from "./Service";
import NavBar from "./NavBar";

const Home = () => {
  const [uploading, setUploading] = useState(true);
  const serviceRef = useRef(null); 
  const [startGlow, setStartGlow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setUploading(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  // Function to scroll to Service section
  const scrollToService = () => {
    setStartGlow(true);
    if (serviceRef.current) {
      serviceRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className="relative min-h-[100vh] flex-col justify-center items-center pt-[15vh] pb-10 dark:text-white font-extrabold h-screen"
      id="home"
    >
      <NavBar />

      {/* Main Content */}
      <div className="z-10 mt-12 grid grid-cols-1 md:grid-cols-2 items-center text-center gap-6 max-w-7xl mx-auto">
        {/* Text Content */}
        <div className="text-[#e7d3cc]">
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight font-bold lato-bold leading-tight mb-4">
            Accelerate AI innovation with decentralized GPU power - train
            smarter, scale faster!
          </p>
          <p className="text-xs sm:text-sm md:text-lg font-semibold mb-6 px-6 md:max-w-[70%] mx-auto">
            Empower AI training with decentralized GPU contributors—seamless,
            scalable, and blockchain-secured!
          </p>
        </div>

        {/* Animated Image */}
        <motion.img
          src={Service4}
          alt="Decentralized GPU Service"
          className="w-[80%] sm:w-[500px] md:w-[720px] min-h-48 mb-8 mx-auto"
          animate={{
            clipPath: uploading ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 0%)",
          }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
      </div>

      {/* Get Started Button */}
      <div className="flex justify-center mt-8">
        <Button
          onClick={scrollToService} // Calls function to scroll down
          className="hover:bg-[#e7d3cc] hover:text-[#5B2333] text-[#5B2333] hover:shadow-4xl bg-[#F7F4F3] transition-transform ring-1 ring-black ring-offset-1 ring-offset-black transform hover:scale-105 p-3 font-semibold"
        >
          Get Started
          <ArrowRight />
        </Button>
      </div>

      {/* Service Section */}
      <div ref={serviceRef} className="mt-6">
        <Service startGlow={startGlow} />
      </div>
    </div>
  );
};

export default Home;
