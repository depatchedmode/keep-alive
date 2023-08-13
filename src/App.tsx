import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import { KeepAlive } from "./components";

export function App() {
  /**
   * Wagmi hook for getting account information
   * @see https://wagmi.sh/docs/hooks/useAccount
   */
  const { isConnected } = useAccount();

  return (
    <div className="container">
      <header className="accountBar">
        <h1 className="keepAliveTitle">KEEP•ALIVE</h1>
        {/** @see https://www.rainbowkit.com/docs/connect-button */}
        <ConnectButton />
      </header>

      {isConnected && (
        <KeepAlive />
      )}
    </div>
  );
}
