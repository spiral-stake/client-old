import "../styles/networkOverlay.css";
import { chainConfig } from "../config/chainConfig";
import closeIcon from "../assets/images/close.svg";
import { toastError } from "../utils/toastWrapper";
import { useSwitchChain } from "wagmi";
import { addChainConfig } from "../config/addChainConfig";

const NetworkOverlay = ({ switchingNetwork, setSwitchingNetwork }) => {
  const chains = Object.values(chainConfig);

  const { switchChain } = useSwitchChain();

  const handleNetworkChange = async (chainId) => {
    const chain = addChainConfig[chainId];

    try {
      switchChain({ chainId, addEthereumChainParameter: { ...chain } });
    } catch (error) {
      toastError(error.shortMessage);
    } finally {
      setSwitchingNetwork(false);
    }
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
              <div onClick={() => handleNetworkChange(chain.id)} className="network-option">
                <img src={chain.logo} alt="Ethereum Mainnet" className="network-icon" />
                <span className="bold">{chain.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  );
};

export default NetworkOverlay;
