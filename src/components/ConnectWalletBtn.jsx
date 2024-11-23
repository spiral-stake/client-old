import { ConnectButton } from "@rainbow-me/rainbowkit";
import dropdownSvg from "../assets/images/dropdown.svg";
import { chainConfig } from "../config/chainConfig";
import { useChainId } from "wagmi";

const ConnectWalletBtn = ({ className, networkOption, setSwitchingNetwork }) => {
  const appChainId = useChainId();

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // If your app doesn't use authentication, remove 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        if (!connected) {
          return (
            <>
              {networkOption && (
                <div onClick={() => setSwitchingNetwork(true)} className="navbar__network">
                  <img className="logo" src={chainConfig[appChainId].logo} alt="Network Icon" />
                  <img
                    style={{ width: "25px" }}
                    className="dropdown"
                    src={dropdownSvg}
                    alt="Dropdown Icon"
                  />
                </div>
              )}
              <button className={className} onClick={openConnectModal} type="button">
                Connect
              </button>
            </>
          );
        }

        if (chain.unsupported) {
          return (
            <>
              {networkOption && (
                <div onClick={openChainModal} className="navbar__network">
                  <img
                    className="logo"
                    src={
                      (chain.hasIcon && chain.iconUrl) ||
                      chainConfig[chain.id]?.logo ||
                      chainConfig[appChainId].logo
                    }
                    alt="Network Icon"
                  />
                  <img
                    style={{ width: "25px" }}
                    className="dropdown"
                    src={dropdownSvg}
                    alt="Dropdown Icon"
                  />
                </div>
              )}
              <button className={className} onClick={openChainModal} type="button">
                Wrong network
              </button>
            </>
          );
        }

        return (
          <>
            {networkOption && (
              <div onClick={openChainModal} className="navbar__network">
                <img
                  className="logo"
                  src={
                    (chain.hasIcon && chain.iconUrl) ||
                    chainConfig[chain.id]?.logo ||
                    chainConfig[appChainId].logo
                  }
                  alt="Network Icon"
                />
                <img
                  style={{ width: "25px" }}
                  className="dropdown"
                  src={dropdownSvg}
                  alt="Dropdown Icon"
                />
              </div>
            )}
            <button className={className} onClick={openAccountModal} type="button">
              {account.displayName}
            </button>
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectWalletBtn;
