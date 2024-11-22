import "../styles/overlay.css";
import close from "../assets/images/close.svg";
import PositionNft from "./PositionNft";

const PositionOverlay = ({ pool, closePositionOverlay, positionNft, updatePosition }) => {
  return (
    <section className="overlay">
      <PositionNft pool={pool} positionNft={positionNft} updatePosition={updatePosition} />
      <img onClick={closePositionOverlay} className="close-icon" src={close} alt="" />
    </section>
  );
};

export default PositionOverlay;
