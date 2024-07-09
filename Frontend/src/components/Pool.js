/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { Button, Spin, Alert } from "antd";
import "../App.css";
import { ContextWeb3 } from "../context";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Pool() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessAdd, setShowSuccessAdd] = useState(false);

  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [tokenASymbol, setTokenASymbol] = useState("");
  const [tokenASymbolLoading, setTokenASymbolLoading] = useState(false);
  const [tokenBSymbol, setTokenBSymbol] = useState("");
  const [tokenBSymbolLoading, setTokenBSymbolLoading] = useState(false);


  const navigate = useNavigate();

  const { contract } = useContext(ContextWeb3);

  const {t, _} = useTranslation();

  const ABI = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function allowance(address owner, address spender) public view returns (uint256)",
    "function balanceOf(address account) public view returns (uint256)",
    "function decimals() public view returns (uint8)",
    "function symbol() public view returns (string)"
  ];

  const checkToken = async (tokenAddress, spenderAddress, amount) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(tokenAddress, ABI, signer);
    
    const ownerAddress = await signer.getAddress();
    const balance = await tokenContract.balanceOf(ownerAddress);
    const allowance = await tokenContract.allowance(ownerAddress, spenderAddress);
  
    if (allowance.lt(balance)) {
      const tx = await tokenContract.approve(spenderAddress, balance);
      await tx.wait();
      console.log(`Approved ${balance.toString()} tokens for ${spenderAddress}`);
    } else {
      console.log(`Already approved ${allowance.toString()} tokens for ${spenderAddress}`);
    }
  };

  const handleButtonClick = async () => {
    setIsLoading(true);
    setShowSuccessAdd(false);
    try {
      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
      const contractWithSigner = contract.connect(signer);
  
      const amountAConver = ethers.utils.parseEther(amountA.toString());
      const amountBConver = ethers.utils.parseEther(amountB.toString());
  
      await Promise.all([
        checkToken(tokenA, contractWithSigner.address, amountAConver),
        checkToken(tokenB, contractWithSigner.address, amountAConver),
      ]);
  
      await contractWithSigner.addLiquidity(tokenA, tokenB, amountAConver, amountBConver, { gasLimit: 1000000 });
      console.log("Liquidity added successfully!");

      setShowSuccessAdd(true);
      setTimeout(() => {
        setShowSuccessAdd(false);
      }, 6000);

    } catch (error) {
      console.error("Error adding liquidity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIconClick = () => {
    navigate("/Token");
  };

  const handleTokenAChange = async (e) => {
    setTokenA(e.target.value);
    setTokenASymbolLoading(true);
    setTimeout(async () => {
      const tokenSymbol = await contract._getTokenSymbol(e.target.value);
      setTokenASymbol(tokenSymbol);
      setTokenASymbolLoading(false);
    }, 2000);
  };

  const handleTokenBChange = async (e) => {
    setTokenB(e.target.value);
    setTokenBSymbolLoading(true);
    setTimeout(async () => {
      const tokenSymbol = await contract._getTokenSymbol(e.target.value);
      setTokenBSymbol(tokenSymbol);
      setTokenBSymbolLoading(false);
    }, 2000);
  };

  return (
    <div className="tradeBox" style={{ height: "450px" }}>
      <div style={{ display: "flex" }}>
        <LeftOutlined
          className="highlight-icon"
          style={{ cursor: "pointer" }}
          onClick={handleIconClick}
        />
        <h4
          style={{
            justifyContent: "center",
            textAlign: "center",
            paddingLeft: "130px",
            paddingRight: "100px",
          }}
        >
          {t("Add Liquidity")}
        </h4>
      </div>
      <div className="Token">
        <div className="tokenInfor">
          <input
            className="inputAddress"
            placeholder={t("Token 1 address")}
            value={tokenA}
            onChange={handleTokenAChange}
          ></input>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <input
              className="inputAmount"
              placeholder={t("Amount")}
              type="number"
              value={amountA}
              onChange={(e) => setAmountA(e.target.value)}></input>
            <div className="tokenSymbol">
              {tokenASymbolLoading ? (
                <Spin size="small" />
              ) : (
                tokenASymbol
              )}
            </div>
          </div>
        </div>
        <div className="tokenInfor">
          <input
            className="inputAddress"
            placeholder={t("Token 2 address")}
            value={tokenB}
            onChange={handleTokenBChange}></input>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <input
              className="inputAmount"
              placeholder={t("Amount")}
              type="number"
              value={amountB}
              onChange={(e) => setAmountB(e.target.value)}></input>
            <div className="tokenSymbol">
              {tokenBSymbolLoading ? (
                <Spin size="small" />
              ) : (
                tokenBSymbol
              )}
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <Button type="primary" loading={isLoading} onClick={handleButtonClick}>
          {isLoading ? t("Adding Liquidity") : t("Add Liquidity")}
        </Button>
      </div>
      {showSuccessAdd && (
        <Alert
          message={t("sent")}
          description={t("Check progress")}
          type="success"
          showIcon
          style={{ marginTop: '-50px', width: '400px' }}
        />
      )}
    </div>
  );
}

export default Pool;
