import { watchBlockNumber } from '@wagmi/core';
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

  /**
 * Automatically generated hook to read the attestation
 * @see https://wagmi.sh/react/execute-hooks/useContractRead
 */
  const { refetch: refetchFlameSize, data: flameSize } = useKeepAliveGameFlameSize();
  const { refetch: refetchFlameHistory, data: flameHistory } = useKeepAliveGameFlameHistory();

  const [flameAge, setFlameAge] = useState(null);

  const unwatch = watchBlockNumber(
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
        <div className="networkOrb optimism active"></div>
        <div className="networkOrb mode"></div>
        <div className="networkOrb base"></div>
        <div className="networkOrb zora"></div>
      </div>
      <h2 className="networkScore">
        <span>Optimism Flame</span>&nbsp;
        <span className="textColor1">{ flameAge?.toString()} Blocks • { flameSize?.toString() } Lumens</span>
      </h2>
    </div>
  );
}
