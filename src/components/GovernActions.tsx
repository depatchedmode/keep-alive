import { useState } from "react";
import { useNetwork, useWaitForTransaction } from "wagmi";

/**
 * These react hooks are generated with the wagmi cli via `wagmi generate`
 * @see ROOT/wagmi.config.ts
 */
import {
  usePrepareKeepAliveGameGovern,
  useKeepAliveGameGovern
} from "../generated";

export function GovernActions() {
  const [governAction, setGovernAction] = useState(0);
  const [addressToGovern, setAddressToGovern] = useState();

  const { config } = usePrepareKeepAliveGameGovern({ args: [governAction, addressToGovern] });

  const { data, write } = useKeepAliveGameGovern(config);

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
      <h3 className="textColor1">Govern the flame 🧑‍⚖️</h3>
      <div className="buttonGroup">
        <button onMouseDown={() => setGovernAction(0)} onClick={() => write?.()}>🫵 Accuse</button>
        <button onMouseDown={() => setGovernAction(1)} onClick={() => write?.()}>🛡️ Defend</button>
      </div>
      <input value={addressToGovern} onChange={(e) => setAddressToGovern(e.target.value)}></input>
      <table>
        <tr>
          <th>Available governs:</th><td>0</td>
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
