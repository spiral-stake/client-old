import ClipLoader from "react-spinners/ClipLoader";
import "../styles/overlay.css";

const LoadingOverlay = ({ cssOverride, size, color, loading }) => {
  return (
    loading && (
      <section className="overlay">
        <ClipLoader
          color={color || "var(--color-primary)"}
          loading={loading || false}
          cssOverride={
            cssOverride || {
              display: "block",
              margin: "0 auto",
              borderColor: "fbd77a",
            }
          }
          size={size || 30}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </section>
    )
  );
};

export default LoadingOverlay;
