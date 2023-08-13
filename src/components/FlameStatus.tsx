import { fetchBlockNumber } from '@wagmi/core';
import { useState, useEffect } from 'react';
import { LightActions } from "./LightActions";

/**
 * These react hooks are generated with the wagmi cli via `wagmi generate`
 * @see ROOT/wagmi.config.ts
 */
import {
  useKeepAliveGameFlameSize,
  useKeepAliveGameCurrentFanning,
  useKeepAliveGameCurrentFuel,
} from "../generated";

export function FlameStatus() {

  /**
 * Automatically generated hook to read the attestation
 * @see https://wagmi.sh/react/execute-hooks/useContractRead
 */
  const { data: flameSize } = useKeepAliveGameFlameSize();
  const { data: currentFanning } = useKeepAliveGameCurrentFanning();
  const { data: currentFuel } = useKeepAliveGameCurrentFuel();
  const flameLayers = Number(flameSize) > 0 ? Math.ceil(Math.log10(Number(flameSize))) : 0;

  return (
    <div className="flameStatus">
      <div>
        <div className="flameContainer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 480">
            {flameLayers >= 7 ?
              <path className="flameLayer flameLayer-7" fill="#FEFFE4" d="M10 352c-2-10-3-19-3-29 0-12 0-22-4-34-1-5-3-9-3-15v-11l2-1 2-4 3-9c2-3 2-5 2-8v-19l2-15 1-48 2 6 4 10c2 5 6 9 9 14 1 2 2 1 2-1l5-12 1-7c0-5 1-5 3-8l4-3c-2-3-1-12-1-16 0-6 1-15 3-21l1-3 2-15 2-11c-3-4-6-7-7-12-1-4-1-7-4-10 0-1-1-6 1-4 3 2 7 4 9 8 3 3 3 13 1 16v2l4 5 5 14 4 9 1 7 5-8c1-3 4-6 4-9s3-2 5-4c1-2 4-4 4 0s2-4 2-5c2-5 6-8 8-12v-8c0-5 2-8 4-13 1-4-1-9 1-13v-9l1-8-2-1c-1-2-4-2-4-5 0-1-6-10-3-10 3-2 7 10 8 12l1 4 4 10 5 7 6 6c3 3 7 5 12 4 3-1 5-7 6-10l8-13-5-12-10-21c-3-4 11-9 14-9 2 0 6-1 5 2l-6 8c-6 6-4 11 0 19 2 3 5 7 3 12l-1 1 1 3 5 15v22s0 8 2 7c4-5 18 4 18-4 1-7 9-7 11-2 2 6 1 14 3 20v1c1 4 2 9 5 13l4 6 3 2 3 6c2 5 17-22 17-9 0 12-1 25 3 36 4 8 4 17 7 26 3 6 6-5 10-6l4-3 2-2c4-1 3 9 3 11l1 26 2 17-1 14v19c0 13 3 25 3 38v27c-1 12-5 39-11 49l-14 17c-39 47-108 52-158 32-20-10-31-14-42-36-5-11-7-21-9-35Z"/>
              : null
            }
            {flameLayers >= 6 ?
              <path className="flameLayer flameLayer-6" fill="#F9FBA5" d="m22 283 1 24-3 4c-2 1 2 9 2 10l2 7v5l2 24 5 30c1 4 7 9 9 13 21 29 53 30 84 30 56 2 111-43 107-106 0-8-2-18-4-25-8-22 6-48-5-70 0-1-1-6-2-5l-2 4c-2 3-3 5-7 6-3 0-2-12-3-14l-1-5-4-12c-4-7-9-16-10-24l-1-5-4 4-3 3-2 1-1 2c-5 0-3-3-5-7l-6-11-4-13c-1-2-1-6-3-7-1-2-7-7-9-6-4 1-5 8-8 10l-4 7-3-3c-4-4-10-6-13-11-5-8-15-14-23-18-2-1-10-3-11 0-2 3-3 7-3 10 1 7-3 13-3 20v20c0 2-8-1-9 0-4 0-5-6-7-8-2-3-3 8-4 9l-4 12c-1 1 0 5-1 4l-4-2-5-9-2-5-2 4 1 11 2 8 1 11 2 8c1 2-1 1-2 2-2 1-5 3-8 3-1 0-2-2-3 0l-2 5v19c-1 3-2 15-4 15-3 1-6-1-9-2-3-2-4 2-4 6 1 5 0 11-1 17Z"/>
              : null
            }
            {flameLayers >= 5 ?
              <path className="flameLayer flameLayer-5" fill="#EFF178" d="M211 309c0 2 3 4 3 7 3 37-11 67-37 93-19 19-37 18-63 18l-14-1c-18 0-30-5-43-17l-3-5-5-6-6-6-2-5c-2-2-4-3-5-6l-3-7-1-9c1-6 3-11 3-17l-1-11-3-6-1-12c-1-11 3-22 4-33 0-2 6-2 8-2s2 3 4 3 1-2 2-3l1-4 2-6 1-5 1-7 1-11 3-1h5l5 2c1 1 2 1 2-1l1-4 4-16c3-6 6-10 6-16v-8c0-2 2 1 2 2l3 1 5 2 8 7 3 2 1-4 2-8 1-10 1-13v-15c0-3 0-4 2-2 3 2 5 6 9 8l7 4 5 5 5 4 7 8c3 2 2 5 4 8 2 1 5 7 7 4l3-4 2-3c0-2 6-9 7-6 1 2 0 5 2 7l2 4 4 9 2 5 5 12 1 4v1l1-2 2-4 5-4 3-4c1-1 1 3 2 4l1 4 3 7v6c1 4 3 7 3 11s4 10 4 13v9c3 0 6-2 7-5 2-7 3 1 2 4-2 4 0 8-1 13l-1 9v9Z"/>
              : null
            }
            {flameLayers >= 4 ?
              <path className="flameLayer flameLayer-4" fill="#E7C346" d="m185 391-7 8-7 8c-18 20-52 19-76 14a62 62 0 0 1-43-31l-2-4-3-4v-1c-2-3-4-7-4-11l-2-18v-12l1-5 2-10 1-21v-4l4 1 3 3 1 2c2-1 3-4 3-6l1-7c2-5 1-11 2-16 1-4 2-13 8-10l7 2s1 3 2 2l2-7 3-10 4-12 3-13c0-2 0-4 1-2l3 3 7 6 6 7c1 3 1 0 1-1l2-8 3-14c2-6 3-11 3-17v-7c0-3 1-2 1 0 1 5 8 6 12 9l5 2c2 1 3 4 4 6l8 11c3 3 5 9 10 6 3-1 4-6 5-9 0-1 1-5 2-3l3 6 5 11 1 7c0 4 1 5 3 8 1 2 4 11 6 10l5-6c1-1 4-5 5-3l2 11 2 8 2 10 2 13c1 4 4 7 4 11l1 12 2 12v14l-2 11c0 5-1 11-3 15l-3 6-3 8-8 9Z"/>
              : null
            }
            {flameLayers >= 3 ?
              <path className="flameLayer flameLayer-3" fill="#E38B23" d="M61 326c-4 5-4 13-4 18l-2 6-1 14 1 11v2l1 4c1 5 17 25 21 28 15 8 39 13 56 10 20-4 28-9 42-23l4-5 2-5 4-8c8-15 4-25 4-42 0-12 4-20 0-32-2-7-4-14-4-22v-8l-1-1-1 1-4 3c-1 1-2 3-5 4-1 1-2-2-2-3l-5-11-2-10-2-7c0-2 1-5-1-3l-7 5c-2 2-7 2-8 4v-3c-1-2-1-6-3-8l-7-7c-2-2-3-6-5-7-3-2-5-2-8-2l-3 1-2 5-3 15c0 3 1 6-1 8-2 4-2 6-2 10l-3-1c-2-1-3-4-4-6l-7-9-3-3-1 1-2 10-2 5v15l-1 3-1 5c0 2-3 2-5 2h-3l-4-2s-4-3-4-1l-2 4v13l-3 12c-1 5-4 7-7 10Z"/>
              : null
            }
            {flameLayers >= 2 ?
              <path className="flameLayer flameLayer-2" fill="#E35123" d="m81 400-7-8-2-2-1-7c0-7-2-15-1-22l2-5 1-3 2-3c1-4 0-8 2-12l1-1 2-4c3-6 5-12 5-18l-1-4c-2-1 0-3 0-2v2h3c2 0 4 2 5 4l4 5c2 1 1-2 1-3l2-14 6-13v-2l-2-5v-2c2 1 3 4 2 7l1 1 4 7c2 2 2 5 3 8l2 5v1-2l1-4c2-4 5-7 5-12l1-10c2-7 2-13 2-19 0-1 1-3 2-1 1 3 6 4 9 6s4 4 4 8c1 5-2 10-3 15v7l-1 4 3 1 6 3h1v-19c1-2 5-3 6-4 2-1 3-2 4-5s1 2 2 3c2 10 3 19 3 29l1 5c0 2 2 3 3 4l2-5 3-4c2-1 2-3 3-5 1 0 2-3 2-1l-1 29v7l1 5 1 19v6l-2 8c-1 5-1 10-3 14-1 3-3 4-5 6l-8 8c-20 14-60 13-76-6Z"/>
              : null
            }
            {flameLayers >= 1 ?
              <path className="flameLayer flameLayer-1" fill="#D80B0B" d="M87 390c-3-8-3-17 1-24 3-6 3-21 3-28v-2 2l4 3c2 0 2-1 2-3 1-2 4-4 4-7 1-4 2-1 4 0 4 1 7 14 10 11 3-2 6-10 6-14 0-1 4-7 4-4s2 5 3 8l4 7 5 5c9 0-8-13 2-13 2 0 2 5 3 6l2 3 7-5v-2l-1-1 1 1 1 2c1 1 2 7 3 6 2 0 6-6 5-1v12c0 8-2 17-4 26-4 22-22 41-51 32-11-3-15-10-18-20Z"/>
              : null
            }
          </svg>
        </div>
        <div className="flameBase">
        </div>
      </div>
      {flameLayers == 0 ?
        <LightActions /> :
        <div className="balanceMeter">
          <div className="balanceMeterChartWrapper">
            <div className="balanceMeterLabel">{ `${currentFanning}` } 💨</div>
            <div className="balanceMeterChart">
              <div className="balanceMeterKnob"></div>
              <div className="balanceMeterLine"></div>
            </div>
            <div className="balanceMeterLabel">{ `${currentFuel}` } 🪵</div>
          </div>
          <div className="balanceMeterAssessment">
            🙅 Unbalanced
          </div>
        </div>
      }

    </div>
  );
}
