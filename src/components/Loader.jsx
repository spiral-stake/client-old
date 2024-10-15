import { PropagateLoader } from "react-spinners";

const Loader = ({ loading, size, color }) => {
  return (
    <PropagateLoader cssOverride={{ bottom: "4px" }} loading={loading} size={size} color={color} />
  );
};

export default Loader;
