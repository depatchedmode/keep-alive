import { useState } from "react";
import { useAccount, useNetwork, useWaitForTransaction } from "wagmi";

/**
 * These react hooks are generated with the wagmi cli via `wagmi generate`
 * @see ROOT/wagmi.config.ts
 */
import {
  usePrepareKeepAliveGameLight,
  useKeepAliveGameLight,
} from "../generated";

export function LightActions() {

  const { config } = usePrepareKeepAliveGameLight();
  const { data, write } = useKeepAliveGameLight(config);
  const { isLoading } = useWaitForTransaction(
    { hash: data?.hash,
      // onSuccess: () => refetch(),
    }
  );
  /**
 * Automatically generated hook to read the attestation
 * @see https://wagmi.sh/react/execute-hooks/useContractRead
 */
  // const { refetch, data: attestation } = useAttestationStationAttestations({
  //   args: [address!, address!, key],
  // });

  return (
    <div>
      <button disabled={isLoading} onClick={() => write?.()}>Light the Flame</button>
    </div>
  );
}

function ProcessingMessage({ hash }: { hash?: `0x${string}` }) {
  const { chain } = useNetwork();
  const etherscan = chain?.blockExplorers?.etherscan;
  return (
    <span>
      Processing transaction...{" "}
      {etherscan && (
        <a href={`${etherscan.url}/tx/${hash}`}>{etherscan.name}</a>
      )}
    </span>
  );
}
