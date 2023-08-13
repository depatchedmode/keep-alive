import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";
import * as chains from "wagmi/chains";

/**
 * Wagmi cli will automatically generate react hooks from your forge contracts
 * @see https://wagmi.sh/cli/getting-started
 * You can also generate hooks from etherscan
 * @see https://wagmi.sh/cli/plugins/etherscan
 * Or for erc20 erc721 tokens
 * @see https://wagmi.sh/cli/plugins/erc
 * Or from hardhat
 * @see https://wagmi.sh/cli/plugins/hardhat
 * Or from an arbitrary fetch request
 * @see https://wagmi.sh/cli/plugins/fetch
 *
 * You can also generate vanilla actions for @wagmi/core
 * @see https://wagmi.sh/cli/plugins/actions
 */
export default defineConfig({
  out: "src/generated.ts",
  plugins: [
    /**
     * Generates react hooks from your forge contracts
     * @see https://wagmi.sh/cli/plugins/foundry
     */
    foundry({
      deployments: {
        KeepAliveGame: {
          // [chains.optimism.id]: "",
          [chains.optimismGoerli.id]:
            "0xE38B9CE0BeaD92D46716E69920CbDc6322F31c32",
          [chains.foundry.id]: "0x809d550fca64d94Bd9F66E60752A544199cfAC3D",
          // [chains.base.id]: "",
          [chains.baseGoerli.id]: "0xfa71B861832C46B71d6e1B5324501945E7E4A420",
          // [chains.zora.id]: "",
          [chains.zoraTestnet.id]: "0xc2DDdD6A5c129a8E48BBC8F343843915B471489a",
        },
      },
    }),
    /**
     * Generates react hooks from your abis
     * @see https://wagmi.sh/cli/plugins/react
     */
    react(),
  ],
});
