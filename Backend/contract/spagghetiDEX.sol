// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "./Spaggheti.sol";

contract spagghetiDex {
    using Math for uint256;
    //Liqui pool
    struct TokenInfo {
        address tokenAddress;
        string tokenSymbol;
    }
    TokenInfo[] public tokenList;

    mapping(address => mapping(address => uint256)) public tokenReserves;

    //Reward User
    uint256 public constant rewardAmount = 1e16;
    mapping(address => uint256) public lastClaimed;
    mapping(address => uint256) public dailyReward;
    //DEX security
    mapping(address => bytes32) public userHashes;

    Spaggheti public spagghetiToken;

    constructor() {
        // require(spagghetiToken.owner() == msg.sender);
        spagghetiToken = Spaggheti(0xBC7B476f4639B34661489F8C263FE181F4AD33E1);
        spagghetiToken.grantMinterRole(address(this));
    }

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB
    ) public {
        require(
            amountA > 0 && amountB > 0,
            "Must send tokens to add liquidity"
        );

        _addTokenIfNotExists(tokenA);
        _addTokenIfNotExists(tokenB);

        ERC20(tokenA).transferFrom(msg.sender, address(this), amountA);
        ERC20(tokenB).transferFrom(msg.sender, address(this), amountB);

        tokenReserves[tokenA][tokenB] += amountA;
        tokenReserves[tokenB][tokenA] += amountB;

        _rewardUser(msg.sender);
    }

    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB
    ) public {
        require(
            tokenReserves[tokenA][tokenB] >= amountA,
            "Not enough liquidity for tokenA"
        );
        require(
            tokenReserves[tokenB][tokenA] >= amountB,
            "Not enough liquidity for tokenB"
        );

        tokenReserves[tokenA][tokenB] -= amountA;
        tokenReserves[tokenB][tokenA] -= amountB;

        ERC20(tokenA).transfer(msg.sender, amountA);
        ERC20(tokenB).transfer(msg.sender, amountB);
    }

    function swap(
        address fromToken,
        address toToken,
        uint256 fromAmount
    ) public returns (uint256 toAmount) {
        require(fromAmount > 0, "Amount must be greater than zero");

        uint256 fromReserve = tokenReserves[fromToken][toToken];
        uint256 toReserve = tokenReserves[toToken][fromToken];

        require(fromReserve > 0 && toReserve > 0, "Invalid reserves");

        uint256 fee = (fromAmount * 1) / 1000; // fee for swap
        uint256 amountAfterFee = fromAmount - fee;

        toAmount = getAmountOfTokens(amountAfterFee, fromReserve, toReserve);

        require(
            ERC20(toToken).balanceOf(address(this)) >= toAmount,
            "Not enough liquidity in pool"
        );

        ERC20(fromToken).transferFrom(msg.sender, address(this), fromAmount);
        ERC20(toToken).transfer(msg.sender, toAmount);

        tokenReserves[fromToken][toToken] += amountAfterFee;
        tokenReserves[toToken][fromToken] -= toAmount;

        ERC20(fromToken).transfer(spagghetiToken.owner(), fee); // Owner

        return toAmount;
    }

    function getAmountOfTokens(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    ) public pure returns (uint256) {
        require(inputReserve > 0 && outputReserve > 0, "Invalid reserves");
        uint256 inputAmountWithFee = inputAmount;
        uint256 numerator = inputAmountWithFee * outputReserve;
        uint256 denominator = inputReserve + inputAmountWithFee;
        return numerator / denominator;
    }

    function _rewardUser(address user) internal {
        uint256 currentDay = block.timestamp / (24 * 60 * 60);
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

    function _addTokenIfNotExists(address token) internal {
        if (!_tokenExists(token)) {
            string memory tokenSymbol = _getTokenSymbol(token);
            tokenList.push(
                TokenInfo({tokenAddress: token, tokenSymbol: tokenSymbol})
            );
        }
    }

    function _getTokenSymbol(
        address token
    ) internal view returns (string memory) {
        ERC20 tokenContract = ERC20(token);
        return tokenContract.symbol();
    }

    function _tokenExists(address token) internal view returns (bool) {
        for (uint i = 0; i < tokenList.length; i++) {
            if (tokenList[i].tokenAddress == token) {
                return true;
            }
        }
        return false;
    }

    function getAllTokens() public view returns (TokenInfo[] memory) {
        return tokenList;
    }

    // Securiry zone

    function setUserHash(address user) public {
        bytes32 userHash = keccak256(abi.encodePacked(user));
        userHashes[user] = userHash;
    }

    function getUserHash(address user) public view returns (bytes32) {
        return userHashes[user];
    }
}
