// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Spaggheti is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    constructor(address initialOwner)
        ERC20("Spaggheti", "SPD")
        Ownable(initialOwner)
    {
    }    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }

    function getTokensInContract() public view returns(uint256){
         return address(this).balance;
    } 

//Trade function
   function transfer(address from, address to, uint256 value) public virtual returns (bool) {
        _transfer(from, to, value);
        return true;
    }
    function addLiquidity (uint256 _amount) public payable returns (uint256){
        uint256 _liquidity;
        uint256 balanceInEth = address(this).balance;
        uint256 tokenReserve = getTokensInContract();
        ERC20 _token = ERC20(address(this));

        if(tokenReserve == 0) {
            _token.transferFrom(msg.sender, address(this), _amount);
            _liquidity = balanceInEth;
            _mint(msg.sender, _amount);
        }

        else {
            uint256 reservedEth = balanceInEth - msg.value;
            require(
            _amount >= (msg.value * tokenReserve) / reservedEth,
            "Amount of tokens sent is less than the minimum tokens required"
            );
            _token.transferFrom(msg.sender, address(this), _amount);
            unchecked {
                _liquidity = (totalSupply() * msg.value) / reservedEth;
            }
            _mint(msg.sender, _liquidity);
        }
        return _liquidity;
    }

    function removeLiquidity(uint256 _amount) public returns (uint256, uint256) {
        require(
            _amount > 0, "Amount should be greater than zero"
        );
        uint256 _reservedEth = address(this).balance;
        uint256 _totalSupply = totalSupply();

        uint256 _ethAmount = (_reservedEth * _amount) / _totalSupply;
        uint256 _tokenAmount = (getTokensInContract() * _amount) / _totalSupply;
        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(_ethAmount);
        ERC20(address(this)).transfer(msg.sender,_tokenAmount);
        return (_ethAmount, _tokenAmount);
    }

    function getAmountOfTokens(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    )
    public pure returns (uint256) 
    {
        require(inputReserve > 0 && outputReserve > 0, "Invalid Reserves");
        // We are charging a fee of `1%`
        // uint256 inputAmountWithFee = inputAmount * 99;
        uint256 inputAmountWithFee = inputAmount;
        uint256 numerator = inputAmountWithFee * outputReserve;
        uint256 denominator = (inputReserve * 100) + inputAmountWithFee;
        unchecked {
            return numerator / denominator;
        }
    }

    function swapEthTotoken() public payable {
        uint256 _reservedTokens = getTokensInContract();
        uint256 _tokensBought = getAmountOfTokens(
            msg.value, 
            address(this).balance, 
            _reservedTokens
        );
        ERC20(address(this)).transfer(msg.sender, _tokensBought);

    }

}