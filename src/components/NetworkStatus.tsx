import { fetchBlockNumber } from '@wagmi/core';
import { useState, useEffect } from 'react';

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
  const { data: flameSize } = useKeepAliveGameFlameSize();

  const [blockNumber, setBlockNumber] = useState(null);

  const { data: flameHistory } = useKeepAliveGameFlameHistory();
  const lastLit = flameHistory ? flameHistory[1] : 0;

  useEffect(() => {
    async function fetchData() {
      const blockNumber = await fetchBlockNumber();
      setBlockNumber(blockNumber);
    }

    fetchData();
  }, []);

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
        <span className="textColor1">{ blockNumber && lastLit ? (blockNumber-lastLit).toString() : 0 } Blocks • { flameSize?.toString() } Lumens</span>
      </h2>
    </div>
  );
}
