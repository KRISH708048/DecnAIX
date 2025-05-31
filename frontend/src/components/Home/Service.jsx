import { useEffect, useState, } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { benefits } from "@/constants";
import { ArrowRight } from "lucide-react";
import ClipPath from "../modern/ClipPath";

const Service = ({ startGlow }) => {
  const [glow, setGlow] = useState(false);

  useEffect(() => {
    if (startGlow) {
      setGlow(true);
      setTimeout(() => setGlow(false), 5000); // Glow effect for 2 seconds
    }
  }, [startGlow]);

  return (
    <div className="w-full flex justify-center mx-auto relative p-6">
      <div className="flex flex-wrap gap-10 mb-10">
        {benefits.map((item) => (
          <div
            className="block relative p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[24rem] text-[#5b2333]"
            style={{ backgroundImage: `url(${item.backgroundUrl})` }}
            key={item.id}
          >
            <div className="relative z-2 rounded-2xl flex flex-col min-h-[22rem] p-[2.4rem] bg-[#e5b89c]">
              <h5 className="h5 mb-5 text-xl font-bold text-center md:text-left">{item.title}</h5>
              <p className="body-2 mb-6 text-md font-mono">{item.text}</p>
              <div className="flex items-center mt-auto">
                <img src={item.iconUrl} width={48} height={48} alt={item.title} />
                <Link to={item.link || "#"} className="ml-auto flex items-center">
                  <Button
                    className={`bg-[#5b2333] text-[#f7f4f3] transition-all ${
                      glow ? "animate-glow" : ""
                    }`}
                  >
                    <span>Explore more</span>
                    <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            <ClipPath />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Service;
