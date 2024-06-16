// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./LiquidityPool.sol";

contract Spaggheti is ERC20, Ownable {
    uint256 public constant priceOfToken = 1e17; // 0.1 ETH per SPD

    constructor(address initialOwner)
        ERC20("Spaggheti", "SPD")
        Ownable(initialOwner)
    {
        transferOwnership(initialOwner);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function swap(address fromToken, address toToken, uint256 fromAmount) public {
        LiquidityPool(owner()).swap(fromToken, toToken, fromAmount);
    }
}