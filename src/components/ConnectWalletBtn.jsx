import { useConnectWallet } from "@web3-onboard/react";
import { useDisconnect } from "wagmi";

const ConnectWalletBtn = ({ className }) => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const { disconnect: wagmiDisconnect } = useDisconnect();

  const handleDisconnect = () => {
    disconnect(wallet);
    wagmiDisconnect();
  };

  return (
    <button
      className={className}
      disabled={connecting}
      onClick={() => (wallet ? handleDisconnect() : connect())}
    >
      {connecting ? "connecting" : wallet ? "Disconnect" : "Connect"}
    </button>
  );
};

export default ConnectWalletBtn;
