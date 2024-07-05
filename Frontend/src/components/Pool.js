import React, { useState, useContext } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import "../App.css";
import { ContextWeb3 } from "../context";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Pool() {
  const [isLoading, setIsLoading] = useState(false);
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

  const approveToken = async (tokenAddress, spenderAddress, amount) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(tokenAddress, ABI, signer);
    const tx = await tokenContract.approve(spenderAddress, amount);
    await tx.wait();
    console.log(`Approved ${amount} tokens for ${spenderAddress}`);
  };

  const handleButtonClick = async () => {
    setIsLoading(true);
    try {
      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
      const contractWithSigner = contract.connect(signer);
      
      const amountAConver = ethers.utils.parseEther(amountA.toString());
      const amountBConver = ethers.utils.parseEther(amountB.toString());
      
      await approveToken(tokenA, contractWithSigner.address, amountAConver);
      await approveToken(tokenA, contractWithSigner.address, amountAConver);
      
      await contractWithSigner.addLiquidity(tokenA, tokenB, amountAConver, amountBConver);
      console.log("Liquidity added successfully!");

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
    }, 3000);
  };

  const handleTokenBChange = async (e) => {
    setTokenB(e.target.value);
    setTokenBSymbolLoading(true);
    setTimeout(async () => {
      const tokenSymbol = await contract._getTokenSymbol(e.target.value);
      setTokenBSymbol(tokenSymbol);
      setTokenBSymbolLoading(false);
    }, 3000);
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
            placeholder={t("Token A address")}
            value={tokenA}
            onChange={handleTokenAChange}
          ></input>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <input
              className="inputAmount"
              placeholder={t("Amount A")}
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
            placeholder={t("Token B address")}
            value={tokenB}
            onChange={handleTokenBChange}></input>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <input
              className="inputAmount"
              placeholder={t("Amount B")}
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
    </div>
  );
}

export default Pool;
