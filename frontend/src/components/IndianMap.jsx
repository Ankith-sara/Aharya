import React, { useState } from "react";
import { IndiaMap } from "@vishalvoid/react-india-map";
import { HandloomData } from "../data/HandloomData";
import HandloomModal from "./HandloomModel";
import Title from './Title';

const IndianMap = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);

  const stateData = Object.keys(HandloomData).map(key => ({
    id: key,
    customData: {
      handlooms: HandloomData[key],
    },
  }));

  const handleStateClick = (id, data) => {
    setSelectedState({
      name: id,
      handlooms: HandloomData[id] || ["No data found"]
    });
  };

  const handleStateHover = (id, data) => {
    setHoveredState({
      name: id,
      handlooms: HandloomData[id] || []
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
      </div>

      {/* Map Container */}
      <div className="relative  px-8 md:px-12 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute -top-6 -left-6 w-32 h-32 border-l-2 border-t-2 border-black opacity-10"></div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r-2 border-b-2 border-black opacity-10"></div>

        {/* Map Wrapper */}
        <div className="relative bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex justify-center items-center">
          <IndiaMap
            stateData={stateData}
            onStateClick={handleStateClick}
            onStateHover={handleStateHover}
            onStateLeave={handleStateLeave}
            mapStyle={{
              backgroundColor: "#fafafa",
              hoverColor: "#f3f4f6",
              clickedColor: "#e5e7eb",
              stroke: "#374151",
              strokeWidth: 1.5,
              defaultColor: "#f9fafb",
              tooltipConfig: { 
                backgroundColor: "rgba(0,0,0,0.85)",
                color: "#ffffff",
                fontSize: "14px",
                padding: "8px 12px",
                borderRadius: "6px",
                fontFamily: "system-ui"
              }
            }}
            className="w-full max-w-3xl mx-auto"
          />

          {/* Hover Info Card */}
          {hoveredState && (
            <div className="absolute top-4 right-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200 max-w-xs">
              <h4 className="font-semibold text-black mb-2 uppercase tracking-wide">
                {hoveredState.name}
              </h4>
              <p className="text-gray-600 text-sm">
                {hoveredState.handlooms.length > 0 
                  ? `${hoveredState.handlooms.length} Traditional Craft${hoveredState.handlooms.length > 1 ? 's' : ''}`
                  : "Click to explore"
                }
              </p>
              {hoveredState.handlooms.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  Click to view details
                </div>
              )}
            </div>
          )}
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
          onClose={() => setSelectedState(null)}
        />
      )}
    </div>
  );
};

export default IndianMap;