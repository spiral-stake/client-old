import "../styles/networkOverlay.css";
import { chainConfig } from "../config/chainConfig";
import closeIcon from "../assets/images/close.svg";
import { useChainId, useSwitchChain } from "wagmi";

const AppNetworkOverlay = ({ switchingNetwork, setSwitchingNetwork }) => {
  const chains = Object.values(chainConfig);

  const { switchChain } = useSwitchChain();
  const appChainId = useChainId();

  const handleNetworkChange = async (chainId) => {
    switchChain({ chainId });
    setSwitchingNetwork(false);
  };

  return (
    switchingNetwork && (
      <section className="overlay">
        <div className="overlay-content">
          <div className="overlay-header">
            <h2>Choose Network</h2>
            <img
              onClick={() => setSwitchingNetwork(false)}
              className="close-icon"
              src={closeIcon}
              alt=""
            />
          </div>
          <div className="network-options">
            {chains.map((chain) => (
              <div
                onClick={() => handleNetworkChange(chain.id)}
                className={`network-option ${
                  chain.id === appChainId && "network-option--selected"
                } `}
              >
                <img src={chain.logo} className="network-icon" />
                <span className="bold">{chain.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  );
};

export default AppNetworkOverlay;
