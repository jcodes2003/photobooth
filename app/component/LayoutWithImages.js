import React, { useEffect, useState } from "react";

// List your pose images here
const poseImages = [
  "./assets/img/pose 1.jpg",
  "./assets/img/pose 2.jpg",
  "./assets/img/pose 3.jpg",
  "./assets/img/pose 4.jpg",
  "./assets/img/pose 5.png",
  "./assets/img/pose 6.png",
  "./assets/img/pose 7.png",
  "./assets/img/pose 8.png",
  "./assets/img/pose 9.png",
  "./assets/img/pose 10.png",
  // Add more if you have them
];

function getRandomPose() {
  const idx = Math.floor(Math.random() * poseImages.length);
  return poseImages[idx];
}

const getUniqueRandomPoses = (usedIndexes, count) => {
  const availableIndexes = poseImages
    .map((_, i) => i)
    .filter((i) => !usedIndexes.includes(i));
  const result = [];
  for (let i = 0; i < count; i++) {
    if (availableIndexes.length === 0) break;
    const idx = Math.floor(Math.random() * availableIndexes.length);
    result.push(availableIndexes[idx]);
    availableIndexes.splice(idx, 1);
  }
  return result;
};

const frameClass =
  "relative flex items-center justify-center bg-white rounded-xl shadow-lg border-4 border-pink-300 overflow-hidden";

const LayoutWithImages = ({ selectedLayout, capturedImages }) => {
  const [randomPoseIndexes, setRandomPoseIndexes] = useState([null, null, null, null]);

  useEffect(() => {
    // Find which slots are empty
    const usedIndexes = [];
    // If any capturedImages are poseImages, mark their indexes as used
    // (not needed if only user photos are in capturedImages)
    // For now, just ensure randoms are unique
    const emptySlots = capturedImages.map((img, i) => img ? null : i).filter(i => i !== null);
    const uniqueIndexes = getUniqueRandomPoses([], emptySlots.length);
    setRandomPoseIndexes(prev => prev.map((poseIdx, i) => capturedImages[i] ? poseIdx : uniqueIndexes.shift() ?? poseIdx));
    // eslint-disable-next-line
  }, [selectedLayout]);

  useEffect(() => {
    // When an image is taken, keep previous randoms for empty slots, but don't change filled slots
    setRandomPoseIndexes(prev => prev.map((poseIdx, i) => capturedImages[i] ? poseIdx : poseIdx));
  }, [capturedImages]);

  const renderSlot = (img, idx) => {
    const src = img || poseImages[randomPoseIndexes[idx]] || poseImages[0];
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
              <div key={i} className="h-40 w-40 min-w-40">
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