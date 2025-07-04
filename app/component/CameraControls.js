import React from "react";

const CameraControls = ({ handleTakePhoto, handleClearAll }) => (
  <div className="flex gap-2 w-full max-w-xs sm:max-w-sm">
    <button
      className="bg-blue-500 text-white py-2 px-4 rounded mt-4 flex-1"
      onClick={handleTakePhoto}
    >
      Take Photo
    </button>
    <button
      className="bg-red-500 text-white py-2 px-4 rounded mt-4 flex-1"
      onClick={handleClearAll}
    >
      Clear All
    </button>
  </div>
);

export default CameraControls;