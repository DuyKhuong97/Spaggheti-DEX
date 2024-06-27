import React, { useState, useContext } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import "../App.css";
import { ContextWeb3 } from "../context";
import { ethers } from "ethers";

function Pool() {
  const [isLoading, setIsLoading] = useState(false);
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");
  const [amountA, setAmountA] = useState(0);
  const [amountB, setAmountB] = useState(0);

  const { contract } = useContext(ContextWeb3);

  const handleButtonClick = async () => {
    setIsLoading(true);
    try {
      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
      const contractWithSigner = contract.connect(signer);

      const amountAConver = ethers.utils.parseEther(amountA.toString());
      const amountBConver = ethers.utils.parseEther(amountB.toString());
      await contractWithSigner.addLiquidity(tokenA, tokenB, amountAConver, amountBConver);
      console.log("Liquidity added successfully!");

    } catch (error) {
      console.error("Error adding liquidity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIconClick = () => {
    window.location.href = "/Token";
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
            paddingLeft: "140px",
            paddingRight: "130px",
          }}
        >
          Add liquidity
        </h4>
      </div>
      <div className="Token">
        <div className="tokenInfor">
          <input
            className="inputAddress"
            placeholder="Token A address"
            value={tokenA}
            onChange={(e) => setTokenA(e.target.value)}
          ></input>
          <input
          
            className="inputAmount"
            placeholder="Amount A"
            type="number"
            value={amountA}
            onChange={(e) => setAmountA(e.target.value)}></input>
        </div>
        <div className="tokenInfor">
          <input
            className="inputAddress"
            placeholder="Token B address"
            value={tokenB}
            onChange={(e) => setTokenB(e.target.value)}></input>
          <input
            className="inputAmount"
            placeholder="Amount B"
            type="number"
            value={amountB}
            onChange={(e) => setAmountB(e.target.value)}></input>
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <Button type="primary" loading={isLoading} onClick={handleButtonClick}>
          {isLoading ? "Adding Liquidity" : "Add Liquidity"}
        </Button>
      </div>
    </div>
  );
}

export default Pool;
