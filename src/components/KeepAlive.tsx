// import { useState } from "react";
import { useAccount, useNetwork, useWaitForTransaction } from "wagmi";

/**
 * These react hooks are generated with the wagmi cli via `wagmi generate`
 * @see ROOT/wagmi.config.ts
 */
import {
  usePrepareKeepAliveGameLight,
  useKeepAliveGameLight,
  // useKeepAliveGameTend,
} from "../generated";

export function KeepAlive() {
  const { address } = useAccount();
  // const [action, setAction] = useState(0);

  const { config: lightConfig } = usePrepareKeepAliveGameLight();
  console.log('Light Config:', lightConfig); // Log the lightConfig

  const { data, write } = useKeepAliveGameLight(lightConfig);
  // const { data: tendData, write: writeTend } = useKeepAliveGameTend({ args: [action] });

  const { isLoading } = useWaitForTransaction({ hash: data?.hash });
  // const { isLoading: isTendLoading } = useWaitForTransaction({ hash: tendData?.hash });
  // const isLoading = isLightLoading || isTendLoading;
  // const hash = lightData?.hash || tendData?.hash;

  if (!address) {
    return <div>Please connect your wallet to play the Keep Alive Game</div>;
  }

  return (
    <div>
      <h2>Keep Alive Game</h2>
      <button onClick={() => write?.()}>Light the Flame</button>
      {/* <div>
        Tend to the flame:
        <select onChange={(e) => setAction(parseInt(e.target.value))} value={action}>
          <option value="0">Fan</option>
          <option value="1">Fuel</option>
        </select>
        <button onClick={() => writeTend?.()}>Tend</button>
      </div> */}
      {isLoading && <ProcessingMessage hash={data?.hash} />}
      <div>
        Gas fee: <span>{lightConfig.request?.gas?.toString()}</span>
      </div>
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
