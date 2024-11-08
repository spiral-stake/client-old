import ClipLoader from "react-spinners/ClipLoader";

const Loader = ({ loading, size, color }) => {
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <ClipLoader color="var(--color-primary)" />
    </div>
  );
};

export default Loader;
