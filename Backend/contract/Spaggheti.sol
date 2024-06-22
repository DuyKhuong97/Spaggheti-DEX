// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./LiquidityPool.sol";

contract Spaggheti is ERC20, Ownable, AccessControl {
    uint256 public constant priceOfToken = 1e17;
    mapping(address => bytes32) public userHashes;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(address owner)
        ERC20("Spaggheti", "SPD")
        Ownable(owner)
    {
        _grantRole(MINTER_ROLE, address(this));
    }

    function mintForOwner(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function grantMinterRole(address account) public {
        _grantRole(MINTER_ROLE, account);
    }
    
    function mintForPool(address to, uint256 amount)
        public
        onlyRole(MINTER_ROLE)
    {
        _mint(to, amount);
    }


    // Trade zone
    function swapInPool(
        address fromToken,
        address toToken,
        uint256 fromAmount
    ) public {
        LiquidityPool(owner()).swap(fromToken, toToken, fromAmount);
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
