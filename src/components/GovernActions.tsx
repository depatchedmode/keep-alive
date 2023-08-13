import { useState } from "react";
import { useNetwork, useWaitForTransaction, useAccount } from "wagmi";

/**
 * These react hooks are generated with the wagmi cli via `wagmi generate`
 * @see ROOT/wagmi.config.ts
 */
import {
  usePrepareKeepAliveGameGovern,
  useKeepAliveGameGovern,
  useKeepAliveGameAvailableGoverns,
  useKeepAliveGameCurrentTenders,
  useKeepAliveGameCanGovern,
} from "../generated";

export function GovernActions() {
  const { address } = useAccount();

  const [governAction, setGovernAction] = useState(0);
  const [addressToGovern, setAddressToGovern] = useState();

  const { config } = usePrepareKeepAliveGameGovern({ args: [governAction, addressToGovern] });

  const { data, write } = useKeepAliveGameGovern(config);

  const { refetch: refetchCanGovern, data: canGovern } = useKeepAliveGameCanGovern({ args: [address] });
  const { refetch: refetchCurrentTenders, data: currentTenders } = useKeepAliveGameCurrentTenders();
  const { refetch: refetchAvailableGoverns, data: availableGoverns } = useKeepAliveGameAvailableGoverns({ args: [address] });

  const { isLoading } = useWaitForTransaction({ hash: data?.hash });

  return (
    <div className="actionGroup">
      <h3 className="textColor1">Govern the flame 🧑‍⚖️</h3>
      <div className="buttonGroup">
        <button disabled={!canGovern || !write || isLoading} onMouseDown={() => setGovernAction(0)} onClick={() => write?.()}>🫵 Accuse</button>
        <button disabled={!canGovern || !write || isLoading} onMouseDown={() => setGovernAction(1)} onClick={() => write?.()}>🛡️ Defend</button>
      </div>
      { canGovern ? <input value={addressToGovern} onChange={(e) => setAddressToGovern(e.target.value)}></input> : 'You earn 1 act of governance every 10th time you tend to the flame.'}
      <table>
        <tbody>
          <tr>
            <th>Available acts:</th><td>{availableGoverns?.toString()}</td>
          </tr>
          <tr>
            <th>Current tenders:</th><td>{currentTenders?.toString()}</td>
          </tr>
        </tbody>
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
