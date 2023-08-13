import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { baseGoerli, foundry, optimismGoerli, zoraTestnet } from "wagmi/chains";
import { useNetwork } from 'wagmi';

import { KeepAlive } from "./components";

export function App() {
  const { chain } = useNetwork();
  const { isConnected } = useAccount();

  return (
    <div className={`container ${ chain.network }`}>
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
