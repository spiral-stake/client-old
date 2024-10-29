import { useAccount } from "wagmi";
import positionNftImage from "../assets/images/position-nft.png";

const Boxes = ({ totalPositions, boxSize, spokeLength, handlePositionBoxClick, currentCycle }) => {
  const { address } = useAccount();

  return totalPositions.map((position, index) => {
    const angle = (360 / totalPositions.length) * index;
    const offsetX = (Math.cos((angle * Math.PI) / 180) * spokeLength) / 2;
    const offsetY = (Math.sin((angle * Math.PI) / 180) * spokeLength) / 2;

    const owner = address && position.owner === address;

    const renderPositionNft = () => {
      if (owner) {
        return <span>YOUR POSITION</span>;
      } else if (position.owner) {
        return <img src={positionNftImage} alt="" />;
      }
    };

    return (
      <div
        onClick={() => position.owner && handlePositionBoxClick(index)}
        key={index}
        className={`floating-box ${position.owner ? "floating-box--filled" : ""} ${
          owner ? "floating-box--beeping" : ""
        } ${
          position.winningCycle && position.winningCycle === currentCycle
            ? "floating-box--winner"
            : ""
        }`}
        style={{
          width: `${boxSize}px`,
          height: `${boxSize * 1.5}px`,
          transform: `translate(${offsetX}px, ${offsetY}px) rotate(${angle}deg) rotate(${-angle}deg)`,
          position: "absolute",
        }}
      >
        {renderPositionNft()}
      </div>
    );
  });
};

export default Boxes;
