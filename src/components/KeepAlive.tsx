import { useAccount } from "wagmi";

import { FlameStatus } from "./FlameStatus";
import { TendActions } from "./TendActions";
import { GovernActions } from "./GovernActions";
import { NetworkStatus } from "./NetworkStatus";

import {
  useKeepAliveGameFlameSize
} from "../generated";

export function KeepAlive() {
  const { address } = useAccount();

  const { data: flameSize } = useKeepAliveGameFlameSize();
  const flameIsLit = Number(flameSize) > 0;

  if (!address) {
    return <div>Please connect your wallet to play the Keep Alive Game</div>;
  }

  return (
    <div className="keepAliveContainer">
      <div className="gamePlay">
        {flameIsLit ? <TendActions /> : null}
        <FlameStatus />
        {flameIsLit ? <GovernActions /> : null}
      </div>
      <NetworkStatus />
    </div>
  );
}
