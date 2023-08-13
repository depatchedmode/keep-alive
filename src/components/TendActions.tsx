import { useState } from "react";
import { useNetwork, useWaitForTransaction } from "wagmi";

/**
 * These react hooks are generated with the wagmi cli via `wagmi generate`
 * @see ROOT/wagmi.config.ts
 */
import {
  usePrepareKeepAliveGameTend,
  useKeepAliveGameTend,
} from "../generated";

export function TendActions() {
  const [tendAction, setTendAction] = useState(0);

  const { config } = usePrepareKeepAliveGameTend({ args: [tendAction] });

  const { data, write } = useKeepAliveGameTend(config);

  const { isLoading } = useWaitForTransaction({ hash: data?.hash });

  /**
 * Automatically generated hook to read the attestation
 * @see https://wagmi.sh/react/execute-hooks/useContractRead
 */
  // const { refetch, data: attestation } = useAttestationStationAttestations({
  //   args: [address!, address!, key],
  // });

  return (
    <div className="actionGroup">
        <h3 className="textColor1">☄️ Tend to the flame</h3>
        <div className="buttonGroup">
          <button onMouseDown={() => setTendAction(0)} onClick={() => write?.()}>💨 FAN IT</button>
          <button onMouseDown={() => setTendAction(1)} onClick={() => write?.()}>🪵 ADD FUEL</button>
        </div>
        <table>
          <tr>
            <th>Blocks until next tend:</th><td>0</td>
          </tr>
          <tr>
            <th>Your blame:</th><td>0</td>
          </tr>
          <tr>
            <th>Blame penalty:</th><td>0</td>
          </tr>
        </table>
      {isLoading && <ProcessingMessage hash={data?.hash} />}
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
