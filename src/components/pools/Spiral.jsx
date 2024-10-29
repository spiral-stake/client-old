import React, { useEffect, useRef, useState } from "react";
import Spokes from "../Spokes";
import Boxes from "../Boxes";
import "../../styles/spiral.css";
import PositionOverlay from "./PositionOverlay";

const defaultSpokeLength = 600;

const Spiral = ({ pool, allPositions: filledPositions, updatePosition, currentCycle }) => {
  const [positionNft, setPositionNft] = useState();
  const [totalPositions, setTotalPositions] = useState(
    new Array(pool.totalPositions).fill(null).map(() => ({}))
  );

  useEffect(() => {
    const _totalPositions = totalPositions;

    for (let i = 0; i < filledPositions.length; i++) {
      _totalPositions[i] = filledPositions[i];
    }

    setTotalPositions(_totalPositions);

    if (positionNft) {
      setPositionNft(_totalPositions[positionNft.id]);
    }
  }, [filledPositions]);

  const defaultPositionBoxSize = Math.min(30, 600 / totalPositions.length);
  const [spokeLength, setSpokeLength] = useState(defaultSpokeLength);
  const [boxSize, setBoxSize] = useState(defaultPositionBoxSize);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setSpokeLength(defaultSpokeLength / 2);
        setBoxSize(Math.min(25, spokeLength / totalPositions.length));
      } else {
        setSpokeLength(defaultSpokeLength - 50);
        setBoxSize(Math.min(50, spokeLength / totalPositions.length));
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [defaultSpokeLength]);

  const openPositionOverlay = (positionId) => {
    setPositionNft(totalPositions[positionId]);
  };

  const closePositionOverlay = () => {
    setPositionNft(undefined);
  };

  return (
    <div
      ref={containerRef}
      className="spiral-container"
      style={{ width: spokeLength, height: spokeLength }}
    >
      <Spokes spokeLength={spokeLength} />
      <Boxes
        currentCycle={currentCycle}
        handlePositionBoxClick={openPositionOverlay}
        totalPositions={totalPositions}
        boxSize={boxSize}
        spokeLength={spokeLength}
      />
      {positionNft && (
        <PositionOverlay
          updatePosition={updatePosition}
          pool={pool}
          positionNft={positionNft}
          closePositionOverlay={closePositionOverlay}
        />
      )}
    </div>
  );
};

export default Spiral;
