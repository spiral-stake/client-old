import React from "react";

const Experiment = ({ spokeCount = 100, size = 1000, spokeLength = 500 }) => {
  const spokes = Array.from({ length: spokeCount });
  const boxes = Array.from({ length: 10 }); // 5 boxes
  const boxSize = Math.min(70, 1000 / boxes.length);

  return (
    <div className="spiral-container" style={{ width: size, height: size }}>
      {/* Render Spokes */}
      {spokes.map((_, index) => {
        const angle = (360 / spokeCount) * index;
        return (
          <div
            key={index}
            className="spoke"
            style={{
              transform: `rotate(${angle}deg) translate(${30}px)`,
              height: `${spokeLength}px`,
            }}
          />
        );
      })}

      {/* Render Floating Boxes */}
      {boxes.map((_, index) => {
        // Calculate angle based on box index
        const angle = (360 / boxes.length) * index; // Spread boxes equally
        const offsetX = Math.cos((angle * Math.PI) / 180) * 10; // Small horizontal offset
        const offsetY = Math.sin((angle * Math.PI) / 180) * 10; // Small vertical offset

        return (
          <div
            key={index}
            className="floating-box"
            style={{
              width: `${boxSize}px`, // Dynamic box size
              height: `${boxSize}px`, // Dynamic box size
              transform: `rotate(${angle}deg) translate(${
                spokeLength / 2
              }px, 0) translate(${offsetX}px, ${offsetY}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

export default Experiment;
