import React, { useState } from "react";
import { IndiaMap } from "@vishalvoid/react-india-map";
import { HandloomData } from "../data/HandloomData";
import HandloomModal from "./HandloomModel";
import Title from './Title';

const IndianMap = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);

  // Textile-inspired colors for each state
  const stateColors = {
    "Andhra Pradesh": "#8B4513",
    "Arunachal Pradesh": "#FF6B6B",
    "Assam": "#2ECC71",
    "Bihar": "#E74C3C",
    "Chhattisgarh": "#F39C12",
    "Goa": "#3498DB",
    "Gujarat": "#9B59B6",
    "Haryana": "#E67E22",
    "Himachal Pradesh": "#1ABC9C",
    "Jharkhand": "#C0392B",
    "Karnataka": "#D35400",
    "Kerala": "#16A085",
    "Madhya Pradesh": "#8E44AD",
    "Maharashtra": "#2C3E50",
    "Manipur": "#27AE60",
    "Meghalaya": "#F1C40F",
    "Mizoram": "#E91E63",
    "Nagaland": "#795548",
    "Odisha": "#FF5722",
    "Punjab": "#FFC107",
    "Rajasthan": "#D32F2F",
    "Sikkim": "#00BCD4",
    "Tamil Nadu": "#9C27B0",
    "Telangana": "#673AB7",
    "Tripura": "#009688",
    "Uttar Pradesh": "#4CAF50",
    "Uttarakhand": "#607D8B",
    "West Bengal": "#E91E63",
    "Andaman and Nicobar Islands": "#00ACC1",
    "Chandigarh": "#FFA726",
    "Dadra and Nagar Haveli and Daman and Diu": "#26C6DA",
    "Delhi": "#EF5350",
    "Jammu and Kashmir": "#AB47BC",
    "Ladakh": "#7E57C2",
    "Lakshadweep": "#29B6F6",
    "Puducherry": "#EC407A"
  };

  const stateData = Object.keys(HandloomData).map(key => ({
    id: key,
    color: stateColors[key] || "#f9fafb",
    customData: {
      handlooms: HandloomData[key],
      color: stateColors[key]
    },
  }));

  const handleStateClick = (id, data) => {
    setSelectedState({
      name: id,
      handlooms: HandloomData[id] || ["No data found"],
      color: stateColors[id]
    });
  };

  const handleStateHover = (id, data) => {
    setHoveredState({
      name: id,
      handlooms: HandloomData[id] || [],
      color: stateColors[id]
    });
  };

  const handleStateLeave = () => {
    setHoveredState(null);
  };

  return (
    <div className="relative">
      {/* Header Section */}
      <div className="text-center mb-6">
        <Title text1="HANDLOOM" text2="HERITAGE MAP" />
        <p className="text-gray-600 mt-2">Explore traditional handloom crafts across India</p>
      </div>

      {/* Map Container */}
      <div className="relative px-8 md:px-12 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute -top-6 -left-6 w-32 h-32 border-l-2 border-t-2 border-black opacity-10"></div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r-2 border-b-2 border-black opacity-10"></div>

        {/* Map Wrapper */}
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-6 border border-gray-200 flex justify-center items-center">
          
          {/* Interactive Map */}
          <div className="relative w-full max-w-3xl mx-auto">
            <IndiaMap
              stateData={stateData}
              onStateClick={handleStateClick}
              onStateHover={handleStateHover}
              onStateLeave={handleStateLeave}
              mapStyle={{
                backgroundColor: "transparent",
                hoverColor: "#FFA500",
                clickedColor: "#D2691E",
                stroke: "#374151",
                strokeWidth: 1.5,
                defaultColor: "#f3e8dc",
                tooltipConfig: { 
                  backgroundColor: "rgba(0,0,0,0.85)",
                  color: "#ffffff",
                  fontSize: "14px",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontFamily: "system-ui"
                }
              }}
              className="w-full drop-shadow-lg"
            />

            {/* Hover Info Card */}
            {hoveredState && (
              <div className="absolute top-4 right-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-4 shadow-xl border-2 border-gray-200 max-w-xs z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: hoveredState.color }}
                  ></div>
                  <h4 className="font-semibold text-black uppercase tracking-wide">
                    {hoveredState.name}
                  </h4>
                </div>
                <p className="text-gray-600 text-sm">
                  {hoveredState.handlooms.length > 0 
                    ? `${hoveredState.handlooms.length} Traditional Craft${hoveredState.handlooms.length > 1 ? 's' : ''}`
                    : "Click to explore"
                  }
                </p>
                {hoveredState.handlooms.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    Click to view details & textile images
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Color Legend */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 italic">
            Hover over states to explore • Click to view detailed textile information
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <div className="text-center bg-white rounded-lg p-8 shadow-lg border-l-4 border-black">
          <div className="text-3xl font-bold text-black mb-2">300+</div>
          <div className="text-gray-600 uppercase tracking-wider">Artisans</div>
        </div>
        <div className="text-center bg-white rounded-lg p-8 shadow-lg border-l-4 border-black">
          <div className="text-3xl font-bold text-black mb-2">15+</div>
          <div className="text-gray-600 uppercase tracking-wider">States Covered</div>
        </div>
        <div className="text-center bg-white rounded-lg p-8 shadow-lg border-l-4 border-black">
          <div className="text-3xl font-bold text-black mb-2">50+</div>
          <div className="text-gray-600 uppercase tracking-wider">Craft Forms</div>
        </div>
      </div>

      {/* Quote Section */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-gray-100 to-transparent rounded-lg p-10 border-l-4 border-black shadow max-w-4xl mx-auto">
          <p className="text-xl text-gray-700 italic">
            "Each state tells a story, each craft carries a culture, <br />
            and each artisan weaves a legacy that transcends time."
          </p>
        </div>
      </div>

      {/* Modal */}
      {selectedState && (
        <HandloomModal
          title={selectedState.name}
          description={selectedState.handlooms.join(", ")}
          color={selectedState.color}
          onClose={() => setSelectedState(null)}
        />
      )}
    </div>
  );
};

export default IndianMap;