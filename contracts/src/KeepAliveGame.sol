// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

struct GameSettings {
  uint256 timeBetweenTends;
  uint256 governsPerTend;
  uint256 balanceThreshold;
  uint256 decayHorizon;
}

contract KeepAliveGame is Pausable, Ownable {
  // Definitions
  enum Act {
    FAN,
    FUEL
  }
  enum GovernAct {
    ACCUSE,
    DEFEND
  }

  // Additional Definitions
  struct FlameHistory {
    uint256 firstLit;
    uint256 lastLit;
    uint256 lastExtinguished;
    uint256 lastTendedTo;
  }

  struct FlameActivity {
    uint256 tenders;
    uint256 fanning;
    uint256 fuel;
    uint256 accusations;
    uint256 defends;
  }

  struct AccountStatus {
    uint256 lastTended;
    uint256 lastGoverned;
    uint256 totalFans;
    uint256 totalFuels;
    uint256 totalDefends;
    uint256 totalAccusations;
    uint256 firstTended;
    uint8 blame; // Ensuring blame can only range between 0 and 10
  }

  // State Variables
  uint256 public currentFuel = 0;
  uint256 public currentFanning = 0;
  GameSettings public gameSettings;
  FlameHistory public flameHistory;
  mapping(uint256 => FlameActivity) public flameActivityByBlock;
  mapping(address => AccountStatus) public accountStatusByAddress;

  // Constructor to initialize game settings
  constructor(GameSettings memory _gameSettings) {
    gameSettings = _gameSettings;
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  // Function to light the flame
  function light() public {
    require(flameSize() == 0, "Flame is already lit");
    currentFuel += 10;
    currentFanning += 10;
    flameHistory.firstLit = block.number;
    flameHistory.lastLit = block.number;
  }

  // Function to tend to the flame
  function tend(Act act) public {
    require(canTend(_msgSender()), "Cannot tend at this time");
    if (act == Act.FAN) {
      currentFanning += 1;
      accountStatusByAddress[_msgSender()].totalFans += 1;
    } else if (act == Act.FUEL) {
      currentFuel += 1;
      accountStatusByAddress[_msgSender()].totalFuels += 1;
    }

    // Update flame activity and other required logic...
  }

  // Function to check if an address can tend
  function canTend(address _address) public view returns (bool) {
    AccountStatus storage account = accountStatusByAddress[_address];
    uint256 delay = 10 + (10 ** account.blame);
    return
      (account.blame < 10) &&
      (block.number - account.lastTended > delay) &&
      (flameSize() - flameActivityByBlock[block.number].tenders > 0);
  }

  // Function to check if an address can govern
  function canGovern(address _address) public view returns (bool) {
    AccountStatus storage account = accountStatusByAddress[_address];
    uint256 totalTends = account.totalFans + account.totalFuels;
    uint256 totalGoverns = account.totalDefends + account.totalAccusations;
    uint256 earnedGoverns = totalTends / gameSettings.governsPerTend;
    return (totalGoverns - earnedGoverns > 0);
  }

  // Function to govern the flame
  function govern(GovernAct act, address _address) public {
    require(canGovern(_msgSender()), "Cannot govern at this time");
    if (act == GovernAct.ACCUSE) {
      if (accountStatusByAddress[_address].blame < 10) {
        accountStatusByAddress[_address].blame += 1;
        accountStatusByAddress[_msgSender()].totalAccusations += 1;
      }
    } else if (act == GovernAct.DEFEND) {
      if (accountStatusByAddress[_address].blame > 0) {
        accountStatusByAddress[_address].blame -= 1;
        accountStatusByAddress[_msgSender()].totalDefends += 1;
      }
    }
    accountStatusByAddress[_msgSender()].lastGoverned = block.number;
  }

  // Function to calculate flame size
  function flameSize() public view returns (uint256) {
    FlameActivity storage latestFlameActivity = flameActivityByBlock[
      flameHistory.lastTendedTo
    ];
    uint256 flameDecay = flameHistory.lastTendedTo - block.number;
    uint256 flameBalance = (100 *
      (latestFlameActivity.fanning - latestFlameActivity.fuel)) /
      latestFlameActivity.tenders;
    int256 flameGrowthRatio = flameBalance >
      uint256(gameSettings.balanceThreshold)
      ? -1 * int256(flameBalance)
      : int256(gameSettings.balanceThreshold) - int256(flameBalance);
    int256 flameChange = (int256(latestFlameActivity.tenders) *
      flameGrowthRatio) / 100;
    uint256 provisionalSize = uint256(
      int256(latestFlameActivity.tenders) + flameChange
    );
    uint256 stagnantBlocks = block.number - flameHistory.lastTendedTo;
    uint256 flameDecayPenalty = (provisionalSize / gameSettings.decayHorizon) *
      stagnantBlocks;
    return (
      stagnantBlocks >= gameSettings.decayHorizon
        ? 0
        : provisionalSize - flameDecayPenalty
    );
  }
}
