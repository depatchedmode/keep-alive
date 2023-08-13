// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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
    address lastLitBy;
  }

  struct FlameActivity {
    uint256 fanning;
    uint256 fuel;
    uint256 accusations;
    uint256 defends;
  }

  struct GameSettings {
    uint256 timeBetweenTends;
    uint256 tendsPerGovern;
    uint256 balanceThreshold;
    uint256 decayHorizon;
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
  GameSettings public gameSettings;
  FlameHistory public flameHistory;
  uint256 public currentFanning;
  uint256 public currentFuel;
  uint256 public currentTenders;
  uint256 public currentGovernors;
  mapping(uint256 => FlameActivity) public flameActivityByBlock;
  mapping(address => AccountStatus) public accountStatusByAddress;

  // Constructor to initialize game settings
  constructor() {
    gameSettings = GameSettings({
      timeBetweenTends: 0,
      tendsPerGovern: 10,
      balanceThreshold: 20,
      decayHorizon: 10
    });
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
    currentFuel = flameActivityByBlock[block.number].fuel += gameSettings
      .decayHorizon;
    currentFanning = flameActivityByBlock[block.number].fanning += gameSettings
      .decayHorizon;
    currentTenders = 0;
    currentGovernors = 0;
    flameHistory.firstLit = block.number;
    flameHistory.lastLit = flameHistory.lastTendedTo = block.number;
    flameHistory.lastLitBy = _msgSender();

    AccountStatus storage tender = accountStatusByAddress[_msgSender()];
    tender.lastTended = flameHistory.lastTendedTo = block.number;
  }

  // Function to tend to the flame
  function tend(Act act) public {
    require(canTend(_msgSender()), "Cannot tend at this time");
    AccountStatus storage tender = accountStatusByAddress[_msgSender()];
    if (act == Act.FAN) {
      currentFanning += 1;
      flameActivityByBlock[block.number].fanning += 1;
      tender.totalFans += 1;
    } else if (act == Act.FUEL) {
      currentFuel += 1;
      flameActivityByBlock[block.number].fuel += 1;
      tender.totalFuels += 1;
    }

    if (tender.lastTended < flameHistory.lastLit) currentTenders += 1;
    tender.lastTended = flameHistory.lastTendedTo = block.number;
  }

  // Function to check if an address can tend
  function canTend(address _address) public view returns (bool) {
    AccountStatus storage account = accountStatusByAddress[_address];
    uint256 delay = gameSettings.timeBetweenTends + (2 ** account.blame) - 1;
    return
      (account.blame < 10) &&
      (account.lastTended == 0 || block.number - account.lastTended > delay);
  }

  // Function to check if an address can govern
  function canGovern(address _address) public view returns (bool) {
    return availableGoverns(_address) > 0;
  }

  // Function to check if an address can govern
  function availableGoverns(address _address) public view returns (uint256) {
    AccountStatus storage account = accountStatusByAddress[_address];
    uint256 totalTends = account.totalFans + account.totalFuels;
    uint256 usedGoverns = account.totalDefends + account.totalAccusations;
    uint256 earnedGoverns = totalTends / gameSettings.tendsPerGovern;
    return earnedGoverns - usedGoverns;
  }

  // Function to govern the flame
  function govern(GovernAct act, address _address) public {
    require(canGovern(_msgSender()), "Cannot govern at this time");
    AccountStatus storage governor = accountStatusByAddress[_msgSender()];
    if (act == GovernAct.ACCUSE) {
      if (accountStatusByAddress[_address].blame < 10) {
        accountStatusByAddress[_address].blame += 1;
        governor.totalAccusations += 1;
      }
    } else if (act == GovernAct.DEFEND) {
      if (accountStatusByAddress[_address].blame > 0) {
        accountStatusByAddress[_address].blame -= 1;
        governor.totalDefends += 1;
      }
    }

    if (governor.lastGoverned < flameHistory.lastLit) currentTenders += 1;
    governor.lastGoverned = block.number;
  }

  // Function to calculate flame size
  function flameSize() public view returns (uint256) {
    // check if it's ever been lit
    if (flameHistory.firstLit == 0) return 0;

    // check for stagnation
    uint256 stagnantBlocks = block.number - flameHistory.lastTendedTo;
    if (stagnantBlocks >= gameSettings.decayHorizon) return 0;

    uint256 flameBalance = _flameBalance();
    bool flameIsBurningClean = flameBalance < gameSettings.balanceThreshold;
    uint256 flameModifier = flameIsBurningClean
      ? gameSettings.balanceThreshold - flameBalance
      : 100 - flameBalance;
    uint256 totalActs = currentFuel + currentFanning;
    uint256 maxSize = currentTenders * 2;
    uint256 baseSize = (totalActs <= maxSize) ? totalActs : maxSize;
    uint256 provisionalSize = flameIsBurningClean
      ? (baseSize * flameModifier) / 100 + baseSize
      : (baseSize * flameModifier) / 100;
    uint256 flameDecayPenalty = (provisionalSize / gameSettings.decayHorizon) *
      stagnantBlocks;
    return provisionalSize - flameDecayPenalty;
  }

  function _flameBalance() private view returns (uint256) {
    uint256 total = currentFuel + currentFanning;
    if (total > 0) {
      uint256 difference = currentFanning > currentFuel
        ? currentFanning - currentFuel
        : currentFuel - currentFanning;
      return (100 * difference) / total;
    } else {
      return 0;
    }
  }
}
