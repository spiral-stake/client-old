import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { onboard } from "../utils/onboard";
import { handleAsync } from "../utils/handleAsyncFunction";
import { useState } from "react";
import { addChainConfig } from "../config/addChainConfig";
import ClipLoader from "react-spinners/ClipLoader";

const OnboardingOverlay = ({ onboarding, setOnboarding }) => {
  const [loading, setLoading] = useState();

  const chainId = useChainId();
  const { address } = useAccount();
  const { switchChain } = useSwitchChain();

  const handleOnboarding = async () => {
    switchChain({ chainId, addEthereumChainParameter: { ...addChainConfig[chainId] } });

    await onboard(chainId, address);
    setOnboarding(false);
  };

  return (
    onboarding && (
      <section className="overlay">
        <div className="overlay-content">
          <h2>To Get Started</h2>
          <button onClick={handleAsync(handleOnboarding, setLoading)} className="btn btn--primary">
            {loading ? <ClipLoader size={20} color="#fff" /> : "Claim Faucet & Test tokens"}
          </button>
        </div>
      </section>
    )
  );
};

export default OnboardingOverlay;
