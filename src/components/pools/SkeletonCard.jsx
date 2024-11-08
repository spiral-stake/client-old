import Skeleton from "react-loading-skeleton";

const SkeletonCard = () => {
  return (
    <div className="card_ liSt mobileCard">
      <div className="card_Title">
        <div className="cryLogo">
          <Skeleton circle width={40} height={40} />
          <div>
            <h3>
              <Skeleton width={80} />
            </h3>
            <h4 style={{ color: "#dba501" }}>
              <Skeleton width={100} />
            </h4>
          </div>
        </div>
        <div>
          <Skeleton width={90} height={25} style={{ marginRight: "4px" }} />
          <Skeleton width={50} height={25} />
        </div>
      </div>
      <div className="card_body">
        <ul>
          <li>
            <small>Total Cycles</small>
            <h3>
              <Skeleton width={50} />
            </h3>
          </li>
          <li>
            <small>Cycle Duration</small>
            <h3>
              <Skeleton width={60} />
            </h3>
          </li>
          <li>
            <small>YBT Collateral</small>
            <h3>
              <Skeleton width={80} />
            </h3>
          </li>
          <li>
            <small>Cycle Deposit</small>
            <h3>
              <Skeleton width={80} />
            </h3>
          </li>
        </ul>
      </div>
      <div className="card_footer">
        <div className="saleTime">
          <h3>
            <Skeleton width={150} />
          </h3>
        </div>
        <div className="share">
          <Skeleton width={60} height={25} />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
