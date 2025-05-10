import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="relative min-h-screen w-full text-white flex flex-col items-center py-16 px-8 overflow-hidden">
      {/* Background animation effect */}
      <div className="absolute top-0 left-0 w-full h-full opacity-50 z-0"></div>

      {/* Main Content Section */}
      <div className="z-10 max-w-6xl  w-full flex flex-col items-center justify-center gap-4">
        <h1 className="text-6xl md:text-8xl font-bold text-center tracking-wider text-[#d49c79]">
          AI-Powered Compute for Your Model
        </h1>
        <p className="text-lg md:text-xl text-[#e6bab5] text-center font-medium opacity-80">
          Supercharge your models with cutting-edge compute power. Unlock AI
          like never before!
        </p>

        <div className="flex flex-col md:flex-row space-y-10 md:space-x-6 mt-20 md: h-56 w-full justify-between">
          <div className="w-full min-h-4xl sm:w-1/2 bg-gradient-to-br from-[#674943] to-[#994532] rounded-2xl p-8 shadow-xl hover:scale-105 transform transition-all duration-300">
            <h2 className="text-3xl font-bold text-white">
              Empower Your Tasks
            </h2>
            <p className="text-lg font-medium italic text-white mt-4">
              Rent the most powerful machines available and push your tasks
              beyond limits. Performance is our promise.
            </p>
          </div>
          <div className="w-full flex-col gap-10 sm:w-1/2 bg-gradient-to-br from-[#674943] to-[#994532] rounded-2xl p-8 shadow-xl hover:scale-105 transform transition-all duration-300">
            <h2 className="text-3xl font-bold text-white">
              Looking for Your AI Console?
            </h2>
            <p className="text-lg font-medium italic text-white mt-4">
              All your deployments are ready to go. Start your next journey now!
            </p>
            <div className="flex justify-end ">
              <Button
                asChild
                className="flex items-center max-w-48 gap-2 bg-[#f7f4f3] text-black py-3 px-6 rounded-lg font-semibold hover:bg-[#5b2333] hover:text-[#f7f4f3] transition-all duration-300"
              >
                <Link to="/rent/dashboard">
                  Your Console <ArrowRight />
                </Link>
              </Button>
            </div>
            {/* </div> */}
          </div>
        </div>

        {/* Dashboard Link */}
        {/* <div className="my-16 w-full bg-gradient-to-br from-[#9c27b0] to-[#673ab7] rounded-2xl p-8 shadow-xl flex justify-between items-center">
          <div className="text-white">
            <h2 className="text-2xl font-bold">Looking for Your AI Console?</h2>
            <p className="text-lg">
              All your deployments are ready to go. Start your next journey now!
            </p>
          </div>
          <Button
            asChild
            className="flex items-center gap-2 bg-[#00e676] text-black py-3 px-6 rounded-full font-semibold hover:bg-[#00c853] transition-all duration-300"
          >
            <Link to="/rent/dashboard">
              It&apos;s Here <ArrowRight />
            </Link>
          </Button>
        </div> */}

        {/* Optional: AI Daemon Download */}
        {/* <div className="bg-gradient-to-br from-[#4caf50] to-[#8bc34a] p-12 rounded-xl shadow-xl mt-16 flex flex-col items-center justify-center text-white">
          <h2 className="text-3xl font-bold">Download the AI Daemon</h2>
          <p className="text-lg text-center opacity-80 mt-4">
            Download the TAppIN daemon to share your device's resources and boost AI training. Let your device contribute to the future of AI.
          </p>
          <Button className="mt-8 bg-[#00e676] text-black py-3 px-6 rounded-full text-lg font-semibold shadow-lg hover:bg-[#00c853] transition-all duration-300">
            Download Daemon
          </Button>
        </div> */}
      </div>

      {/* Optional: Floating Geometric Elements (AI/Tech Vibe) */}
      {/* <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-[#ff4081] to-[#ff9100] opacity-30 transform rotate-45 animate-spin-slow z-0"></div> */}
      {/* <div className="absolute top-1/3 left-2/3 w-80 h-80 rounded-full bg-gradient-to-br from-[#aead46] to-[#d3e10b] opacity-30 transform rotate-45 animate-spin-slow z-0"></div> */}
    </div>
  );
};

export default Dashboard;
