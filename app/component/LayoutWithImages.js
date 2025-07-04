import React, { useEffect, useState } from "react";

// List your pose images here
const poseImages = [
  "/assets/img/pose 1.jpg",
  "/assets/img/pose 2.jpg",
  "/assets/img/pose 3.jpg",
  "/assets/img/pose 4.jpg",
  // Add more if you have them
];

function getRandomPose() {
  const idx = Math.floor(Math.random() * poseImages.length);
  return poseImages[idx];
}

const frameClass =
  "relative flex items-center justify-center bg-white rounded-xl shadow-lg border-4 border-pink-300 overflow-hidden";

const LayoutWithImages = ({ selectedLayout, capturedImages }) => {
  const [randomPoses, setRandomPoses] = useState([null, null, null, null]);

  useEffect(() => {
    // Generate random poses for empty slots only on mount or when layout changes
    setRandomPoses((prev) =>
      prev.map((pose, i) => (capturedImages[i] ? pose : getRandomPose()))
    );
    // eslint-disable-next-line
  }, [selectedLayout]);

  useEffect(() => {
    // When an image is taken, keep previous randoms for empty slots, but don't change filled slots
    setRandomPoses((prev) =>
      prev.map((pose, i) => (capturedImages[i] ? pose : pose || getRandomPose()))
    );
  }, [capturedImages]);

  const renderSlot = (img, idx) => {
    const src = img || randomPoses[idx] || poseImages[0];
    return (
      <div key={idx} className={frameClass + " w-full h-full"}>
        <img
          src={src}
          alt={`Photo ${idx + 1}`}
          className="w-full h-full object-cover rounded"
          style={{ aspectRatio: "1/1" }}
        />
      </div>
    );
  };

  switch (selectedLayout) {
    case "grid":
      return (
        <div className="grid grid-cols-2 gap-4 w-full max-w-full">
          {[0, 1, 2, 3].map((i) => renderSlot(capturedImages[i], i))}
        </div>
      );
    case "row":
      return (
        <div className="w-full overflow-x-auto">
          <div className="flex flex-row gap-4 w-max px-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-30 w-36 min-w-30">
                {renderSlot(capturedImages[i], i)}
              </div>
            ))}
          </div>
        </div>
      );
    case "column":
      return (
        <div className="flex flex-col gap-4 w-full max-w-full">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-full">
              {renderSlot(capturedImages[i], i)}
            </div>
          ))}
        </div>
      );
    case "single":
      return (
        <div className="w-full flex justify-center">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            {renderSlot(capturedImages[0], 0)}
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default LayoutWithImages;