<div align="center">
  <a href="https://optimism.io"><img alt="Optimism" src="https://raw.githubusercontent.com/ethereum-optimism/brand-kit/main/assets/svg/OPTIMISM-R.svg" width=320></a>
  <br />
  <br />
</div>

# keep-alive

Can your chain burn the brightest? A new slow arcade game for the OP stack superchain.

## Draft Game Logic:

- The goal is to keep your chain’s flame burning the brightest, of all the chains.
  - To grow the flame, you must keep the amount of `FlameActivity.fuel` and `FlameActivity.fanning` are balanced in the previous block.
  - When the difference between them is small, they will be considered balanced, and the flame will grow.
  - When the difference between them becomes too great, the flame is out of balance, and it will diminish.
  - It’s possible other chains will attempt to sabotage your flame, so there are also ways to govern who can tend to it.
- Someone must `light()` the flame if `flameSize()` is 0. This will initialize the flame with +10 to both `FlameActivity.fuel` and `FlameActivity.fanning`.
- There are 2 ways you can `tend(act)` to the flame.
  - An `address` can only `tend()` when `canTend(address)` returns true.
  - `FAN` - This act adds +1 to the `FlameActivity.fanning` of the flame for that block.
  - `FUEL` - This act adds +1 to the `FlameActivity.fuel` for the flame for that block.
- There are also 2 ways you can `govern(act, address)` the flame.
  - `ACCUSE` - It’s quite possible there are traitors among you. You accuse an `address` of acting in bad faith. This will add (+1) to that address’s `blame` score, if it is less than 10.
  - `DEFEND` - It’s also possible that traitors might be making false accusations! You can defend an `address` against accusations. This will subtract (-1) from that address’s `blame` score, if it is greater than 0.
  - After every `GameSettings.tendsPerGovern` `tend()` calls, your `abilityToGovern` will increase by 1. Each time you `govern()` your `abilityToGovern` will decrease by 1.
- We will keep track of general game settings in the `GameSettings` struct, that will track:
  - `timeBetweenTends` - the number of blocks that have to happen until your next opportunity to tend
  - `tendsPerGovern` - the number of times an account must call `tend()` in order to earn another opportunity to govern.
  - `balanceThreshold` - a number between 0 and 100 that determines the ratio at which a flame will be considered balanced.
  - `decayHorizon` - the number of blocks it takes a flame to extinguish itself, if nobody tends to it.
- We will keep track of the flame history in a `FlameHistory` struct, that will track:
  - `firstLit` - blocknumber of the first ever time this flame was lit
  - `lastLit` - blocknumber of the most recent time this flame was re-lit. This will have to happen
  - `lastExtinguished` - blocknumber of the most recent time the flame decayed to 0.
  - `lastTendedTo` - blocknumber of the most recent time the flame was tended to
- We will keep track of the flame status in a `FlameActivity` struct, that will track:
  - `tenders` - the number of accounts that acted in the block
  - `fanning` - the number of accounts that have `FANNED` in the block
  - `fuel` - the number of accounts that have `FUELED` in the block
  - `accusations` - the number of accusations that occurred in the block
  - `defends` - the number of defends that occured in the block
- We’ll record `FlameActivity` for each active block in a `flameActivityByBlock` map
- For each account, we will record its status in an `AccountStatus` struct, that will track:
  - `lastTended` will record the blocknumber of the accounts last `tend()` act
  - `lastGoverned` will record the blocknumber of the account’s last `govern()` act
  - `totalFans` will record the number of `tend(FAN)` acts this account has made
  - `totalFuels` will record the number of `tend(FUEL)` acts this account has made
  - `totalDefends` will record the number of `govern(DEFEND)` acts this account has made
  - `totalAccusations` will record the number of `govern(ACCUSE)` acts this account has made
  - `firstTended` will record the blocknumber of the account’s first `tend()` act
  - `blame` will record the current amount of blame this account carries. It cannot be greater than 10 or less than 0.
- We’ll record the `AccountStats` for each address in an `accountStatusByAddress` map
- The logic for `canTend(address)` is as follows.
  - `AccountStatus.blame` must be less than 10
  - (`block.number` - `AccountStatus.lastTended`) must be greater than `10 + 10^AccountStatus.blame`
  - `flameSize() - FlameStatus.activeTenders > 0`
- The logic for `canGovern(address)` is as follows:
  - `totalTends = AccountStatus.totalFans + AccountStatus.totalFuels`
  - `totalGoverns = AccountStatus.totalDefends + AccountStatus.totalAccuses`
  - `earnedGoverns = totalTends / GameSettings.tendsPerGovern`
  - `totalGoverns - earnedGoverns > 0`
- How to calculate `flameSize()`
  - Get the `latestFlameActivity` by grabbing `flameActivityByBlock(FlameHistory.lastTendedTo)`
  - Calculate the `flameDecay = FlameHistory.lastTendedTo - block.number`
  * `flameBalance` = the difference between `latestFlameActivity.fanning` and `latestFlameActivity.fuel` times 100, divided by `latestFlameActivity.tenders`. This should roughly provide a number between 0 and 100. Closer to 0 is better.
  * `flameGrowthRatio = flameBalance > GameSettings.balanceThreshold ? -1 * flameBalance : GameSettings.balanceThreshold - flameBalance`
  * `flameChange = (latestFlameActivity.tenders x flameGrowthRatio) / 100`
  * `provisionalSize = flameChange + latestFlameActivity.tenders`
  * `stagnantBlocks = block.number - FlameHistory.lastTendedTo`
  * We want to penalize the participants in the chain if nobody has been tending to the flame. So we calculate a flame decay. `flameDecay = provisionalSize / GameSettings.decayHorizon * stagnantBlocks`
  * finally, we return `stagnantBlocks >= GameSettings.decayHorizon ? 0 : provisionalSize - flameDecay`
- Flame size has levels by order of magnitude. There are 7 potential levels.
  - > = 1
  - > 10
  - > 100
  - > 1000
  - > 10000
  - > 100000
  - > 1000000

## Stretch Goals:

- Must possess a flint ERC-721 to play
- Mint ERC-721 on a chain to join that team
- Move from one chain to another at will. Can only be on one chain at a time
- You can only act once per block across all chains

## Plan:

- Get contract working on one local chain
- Get basic desktop interaction working on one local chain, no animation
- Calculation of current streak, longest streak, and biggest flame
- Interactions on multiple testnets
- Reads to multiple chains
- Restrict ERC-721 to one chain at a time
- Add animation to the UI

## Getting Started

### Install Node

[See here](https://nodejs.org/en/download/).
Note that you need Node at a later version than 14.18.0, or 16 and above.
These instructions were verified with Node 18.

### Install Foundry

You will need to install [Foundry](https://book.getfoundry.sh/getting-started/installation) to build your smart contracts.

1. Run the following command:

   ```sh
   curl -L https://foundry.paradigm.xyz | bash
   ```

1. Source your environment as requested by Foundry.

1. Run `foundryup`.

</details>

## Set up environment

### Get an Etherscan key

1. Register for [Etherscan on Optimism](https://explorer.optimism.io/register).
   This account is different from your normal Etherscan account.

1. Go to [the API keys page](https://explorer.optimism.io/myapikey) and click **Add** to create a new API key.

### Specify .env

You will first need to set up your `.env` to tell Forge where to deploy your contract.

1. Copy `.env.example` to `.env`.

   ```sh
   cp .env.example .env
   ```

1. Edit your `.env` to specify the environment variables.

   - `ETHERSCAN_API_KEY`: Your Etherscan API Key.

   - `FORGE_RPC_URL`: The RPC URL of the network to which you deploy.
     If you use [Alchemy](https://github.com/ethereum-optimism/optimism-tutorial/tree/main/ecosystem/alchemy), your URL will look like this: `https://opt-goerli.g.alchemy.com/v2/<Alchemy API Key>`

   - `FORGE_PRIVATE_KEY`: The private key of the wallet you want to deploy from.

   - `VITE_WALLETCONNECT_PROJECT_ID`: WalletConnect v2 requires a project ID. You can obtain it from your WC dashboard: https://docs.walletconnect.com/2.0/web/web3wallet/installation#obtain-project-id

## Start the application

<img width="450" alt="starter-app-screenshot" src="https://user-images.githubusercontent.com/389705/225778318-4e6fb8c0-c5d7-4aea-9fc2-2efd17ca435c.png">

1. Clone/fork the optimism-starter repo

   ```sh
   git clone https://github.com/ethereum-optimism/optimism-starter.git
   ```

1. Install the necessary node packages:

   ```sh
   cd optimism-starter
   npm install
   ```

1. Start the frontend with `npm run dev`

   ```sh
   npm run dev
   ```

   If you get errors during this step, you might need to [update your Foundry to the latest version](#install-foundry).

1. Open [localhost:5173](http://localhost:5173) in your browser.

   Once the webpage has loaded, changes made to files inside the `src/` directory (e.g. `src/App.tsx`) will automatically update the webpage.

See below for general usage instructions or [FAQ](./FAQ.md) for answers to general questions such as:

- [Where to get goerli eth]().
- [How to deploy a public version of your app](./FAQ.md#how-do-i-deploy-this).

## Generate ABIs & React Hooks

This project comes with `@wagmi/cli` built-in, which means you can generate wagmi-compatible (type safe) ABIs & React Hooks straight from the command line.

To generate ABIs & Hooks, follow the steps below.

## Generate code

To generate ABIs & React Hooks from your Foundry project (in `./contracts`), you can run:

```sh
npm run wagmi
```

This will use the wagmi config (`wagmi.config.ts`) to generate a `src/generated.ts` file which will include your ABIs & Hooks that you can start using in your project.

[Here is an example](https://github.com/ethereum-optimism/optimism-starter/blob/main/src/components/Attestoooooor.tsx#L77) of Hooks from the generated file being used.

## Deploying Contracts

To deploy your contracts to a network, you can use Foundry's [Forge](https://book.getfoundry.sh/forge/) – a command-line tool to tests, build, and deploy your smart contracts.

You can read a more in-depth guide on using Forge to deploy a smart contract [here](https://book.getfoundry.sh/forge/deploying), but we have included a simple script in the `package.json` to get you started.

Below are the steps to deploying a smart contract to Ethereum Mainnet using Forge:

## Deploy contract

You can now deploy your contract!

```sh
npm run deploy
```

## Developing with Anvil (Optimism Mainnet Fork)

Let's combine the above sections and use Anvil alongside our development environment to use our contracts (`./contracts`) against an Optimism fork.

### Start dev server

Run the command:

```sh
npm run dev:foundry
```

This will:

- Start a vite dev server,
- Start the `@wagmi/cli` in [**watch mode**](https://wagmi.sh/cli/commands/generate#options) to listen to changes in our contracts, and instantly generate code,
- Start an Anvil instance (Goerli Optimism Fork) on an RPC URL.

### Deploy our contract to Anvil

Now that we have an Anvil instance up and running, let's deploy our smart contract to the Anvil network:

```sh
npm run deploy:anvil
```

## Start developing

Now that your contract has been deployed to Anvil, you can start playing around with your contract straight from the web interface!

Head to [localhost:5173](http://localhost:5173) in your browser, connect your wallet, and try increment a counter on the Foundry chain. Use the generated code in `src/generated.ts` to do it and follow the [Attestooooor](https://github.com/ethereum-optimism/optimism-starter/blob/main/src/components/Attestoooooor.tsx) component as an example

> Tip: If you import an Anvil private key into your browser wallet (MetaMask, Coinbase Wallet, etc) – you will have 10,000 ETH to play with 😎. The private key is found in the terminal under "Private Keys" when you start up an Anvil instance with `npm run dev:foundry`.

## Alternatives

Looking to use burner wallets? Prefer hardhat? Prefer NEXT.js? Check out these amazing alternatives:

- [create wagmi cli](https://wagmi.sh/cli/create-wagmi) - A flexible cli with many templates (this starterkit was started from vite-react-cli-foundry)
- [scaffold-eth](https://github.com/scaffold-eth/se-2) - The new 2nd version of a popular NEXT.js based starter including hardhat, burner wallets, great documentation, and an active telegram for support
- [Awesome wagmi](https://github.com/wagmi-dev/awesome-wagmi#templates) - Has other alternative examples
- [Create Eth App](https://usedapp-docs.netlify.app/docs/Getting%20Started/Create%20Eth%20App) - Uses a wagmi alternative called useDapp that is used at OP Labs

## Learn more

To learn more about [Optimism](https://optimism.io), [Vite](https://vitejs.dev/), [Foundry](https://book.getfoundry.sh/), [Rainbow kit](https://www.rainbowkit.com/) or [wagmi](https://wagmi.sh), check out the following resources:

- [Foundry Documentation](https://book.getfoundry.sh/) – learn more about the Foundry stack (Anvil, Forge, etc).
- [wagmi Documentation](https://wagmi.sh) – learn about wagmi Hooks and API.
- [wagmi Examples](https://wagmi.sh/examples/connect-wallet) – a suite of simple examples using wagmi.
- [@wagmi/cli Documentation](https://wagmi.sh/cli) – learn more about the wagmi CLI.
- [Vite Documentation](https://vitejs.dev/) – learn about Vite features and API.
