// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Spaggheti.sol";

//token A: 0x3C01332993158deE68BE3886EF5B50002795bF42
//token B: 0xaeCf92ED261e63a29Dc1D4f6Bd8b422A64E26Bc8

interface spagghetiContract {
    function mintForPool(address user, uint256 amount) external;
    function grantMinterRole(address account) external;
}


contract testRewardUser{
    using SafeMath for uint256;

    uint256 public constant rewardAmount = 1e16;
    mapping(address => uint256) public lastClaimed;
    mapping(address => uint256) public dailyReward;

  
    spagghetiContract public spagghetiToken;
    
    constructor(){
        spagghetiToken = spagghetiContract(0x3ae80e48C49066dA4748D77291aF12839F3393BC);
        spagghetiToken.grantMinterRole(address(this));    
    }
    

    function _rewardUser(address user) internal {
        uint256 currentDay = block.timestamp / (24*60*60);
        if (lastClaimed[user] < currentDay) {
            dailyReward[user] = 0;
            lastClaimed[user] = currentDay;
        }
        require(dailyReward[user] < 5e16, "Daily reward limit reached"); // 0.5 SPD limit per day

        uint256 reward = rewardAmount;
        if (dailyReward[user] + reward > 5e16) {
            reward = 5e17 - dailyReward[user];
        }

        dailyReward[user] += reward; 
        spagghetiToken.mintForPool(user, reward);
    }

    function rewardUser() public {
    _rewardUser(msg.sender);
}
}