import React, { useState } from "react";

const FeaturesWeights = () => {
  const [weights, setWeights] = useState({
    feature1: 0.5,
    feature2: 0.3,
    feature3: 0.2,
  });

  const handleWeightChange = (e, feature) => {
    setWeights({
      ...weights,
      [feature]: parseFloat(e.target.value),
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-[#5B2333]">Feature Weights</h2>
      <div className="mt-4 space-y-4">
        {Object.keys(weights).map((feature) => (
          <div key={feature} className="flex items-center justify-between">
            <label className="text-lg font-medium">{feature}</label>
            <input
              type="number"
              value={weights[feature]}
              onChange={(e) => handleWeightChange(e, feature)}
              min="0"
              max="1"
              step="0.01"
              className="border border-gray-300 p-2 rounded-lg"
            />
          </div>
        ))}
      </div>
      <button className="mt-6 bg-[#5B2333] text-white py-2 px-6 rounded-lg hover:bg-[#7a2d42]">
        Save Weights
      </button>
    </div>
  );
};

export default FeaturesWeights;
