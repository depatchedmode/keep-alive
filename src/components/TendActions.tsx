import { useState } from "react";
import { useNetwork, useWaitForTransaction, useAccount } from "wagmi";

/**
 * These react hooks are generated with the wagmi cli via `wagmi generate`
 * @see ROOT/wagmi.config.ts
 */
import {
  usePrepareKeepAliveGameTend,
  useKeepAliveGameTend,
  useKeepAliveGameAccountStatusByAddress,
} from "../generated";

export function TendActions() {
  const { address } = useAccount();

  const [tendAction, setTendAction] = useState(0);

  const { config } = usePrepareKeepAliveGameTend({ args: [tendAction] });
  const { data: accountStatus } = useKeepAliveGameAccountStatusByAddress({ args: [address]});
  const { data, write } = useKeepAliveGameTend(config);
  const { isLoading } = useWaitForTransaction({ hash: data?.hash });

  const blame = accountStatus ? accountStatus[7] : 0;

  return (
    <div className="actionGroup">
        <h3 className="textColor1">☄️ Tend to the flame</h3>
        <div className="buttonGroup">
          <button disabled={!write || isLoading} onMouseDown={() => setTendAction(0)} onClick={() => write?.()}>💨 FAN IT</button>
          <button disabled={!write || isLoading} onMouseDown={() => setTendAction(1)} onClick={() => write?.()}>🪵 ADD FUEL</button>
        </div>
        {isLoading && <ProcessingMessage hash={data?.hash} />}
        { blame > 0 ? <div>Blame has been cast upon you! This will slow your ability to tend to the flame.</div> : null }
        { blame > 0 ?
          <table>
          <tbody>
            <tr>
              <th>Your blame</th><td>{blame}</td>
            </tr>
            <tr>
              <th>Blame penalty</th><td>{2 ^ blame - 1} Blocks</td>
            </tr>
            <tr>
              <th>Blocks until next tend</th><td>{}</td>
            </tr>
          </tbody>
        </table>
        : null }
    </div>
  );
}

function ProcessingMessage({ hash }: { hash?: `0x${string}` }) {
  const { chain } = useNetwork();
  const etherscan = chain?.blockExplorers?.etherscan;
  return (
    <span>
      Carrying out your wishes...{" "}
      {etherscan && (
        <a href={`${etherscan.url}/tx/${hash}`}>{etherscan.name}</a>
      )}
    </span>
  );
}
