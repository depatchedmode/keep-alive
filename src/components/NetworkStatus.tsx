import { watchBlockNumber } from '@wagmi/core';
import { baseGoerli, foundry, optimismGoerli, zoraTestnet } from "wagmi/chains";
import { useNetwork } from 'wagmi';
import { useState } from 'react';

/**
 * These react hooks are generated with the wagmi cli via `wagmi generate`
 * @see ROOT/wagmi.config.ts
 */
import {
  useKeepAliveGameFlameSize,
  useKeepAliveGameFlameHistory
} from "../generated";

export function NetworkStatus() {

  const { chain } = useNetwork();
  const { refetch: refetchFlameSize, data: flameSize } = useKeepAliveGameFlameSize();
  const { refetch: refetchFlameHistory, data: flameHistory } = useKeepAliveGameFlameHistory();

  const [flameAge, setFlameAge] = useState(null);

  const unwatchBlock = watchBlockNumber(
    {
      listen: true,
    },
    (blockNumber) => {
      const lastLit = flameHistory ? flameHistory[1] : 0;
      refetchFlameSize();
      refetchFlameHistory();
      setFlameAge(blockNumber && lastLit && flameSize > 0 ? (blockNumber-lastLit) : 0)
    },
  )

  return (
    <div className="networkStatus">
      <div className="networkOrbsList">
        <div className={`networkOrb optimism ${ chain.id === optimismGoerli.id ? 'active' : '' }`}></div>
        <div className={`networkOrb zora ${ chain.id === zoraTestnet.id ? 'active' : '' }`}></div>
        <div className={`networkOrb base ${ chain.id === baseGoerli.id ? 'active' : '' }`}></div>
        <div className={`networkOrb mode ${ chain.id === foundry.id ? 'active' : '' }`}></div>
      </div>
      <h2 className="networkScore">
        <span className="textColor2">{chain.name} Flame</span>&nbsp;
        <span className="textColor1">{ flameAge?.toString()} Blocks • { flameSize?.toString() } Lumens</span>
      </h2>
    </div>
  );
}
