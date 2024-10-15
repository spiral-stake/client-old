import popup from "../styles/popup.module.css";
import link from "../assets/images/link.svg";
import close from "../assets/images/close.svg";

const Popup = ({ closePopup }) => {
  return (
    <section className={popup.overlay}>
      <div className={popup.popup}>
        <a target="blank" style={{ textAlign: "center" }} href={""} className="btn btn--main">
          <span>See the Interaction on XYZ</span>
          <img className={popup.iconSmall} src={link} alt="" />
        </a>
        <img
          onClick={closePopup}
          className={`${popup.iconSmall} ${popup.close}`}
          src={close}
          alt=""
        />
      </div>
    </section>
  );
};

export default Popup;
