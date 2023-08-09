// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {KeepAliveGame} from "../src/KeepAliveGame.sol";

import {Script} from "forge-std/Script.sol";

/**
 * @title KeepAliveGameScript
 * @notice Script for deploying KeepAliveGame.
 * @dev https://book.getfoundry.sh/reference/forge/forge-script
 *
 * @dev This script is used to deploy KeepAliveGame with forge script
 * example start anvil with `anvil` command and then run
 * forge script contracts/script/KeepAliveGame.s.sol:Deploy --rpc-url http://localhost:8545 --broadcast -vvv
 * @dev Scripts can be used for any scripting not just deployment
 */
contract KeepAliveGameScript is Script {
  function setUp() public {}

  function run() public {
    // read DEPLOYER_PRIVATE_KEY from environment variables
    uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

    // start broadcast any transaction after this point will be submitted to chain
    vm.startBroadcast(deployerPrivateKey);

    // deploy KeepAliveGame
    KeepAliveGame keepAliveGame = new KeepAliveGame();

    // stop broadcasting transactions
    vm.stopBroadcast();
  }
}
