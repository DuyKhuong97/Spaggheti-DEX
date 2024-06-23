import React, { useState, useEffect, useContext } from "react";
import { Input, Popover, Modal, message } from "antd";
import {
  AccountBookOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import { ContextWeb3 } from "../context";
import { ethers } from "ethers";

function Swap({ isConnected, address }) {
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [calculatedTokenTwoAmount, setCalculatedTokenTwoAmount] = useState(null);
  const [tokenOne, setTokenOne] = useState({ address: "", ticker: "" });
  const [tokenTwo, setTokenTwo] = useState({ address: "", ticker: "" });
  const [isOpen, setIsOpen] = useState(false);
  const [changeToken, setChangeToken] = useState(1);
  const [poolTokens, setPoolTokens] = useState([]);

  const { contract } = useContext(ContextWeb3);

  useEffect(() => {
    const fetchPoolTokens = async () => {
      if (isConnected && contract) {
        try {
          const tokens = await contract.getAllTokens();
          console.log("Tokens in pool:", tokens);
          setPoolTokens(tokens);
          if (tokens.length > 0) {
            setTokenOne({ address: tokens[0], ticker: "Token 1" });
            setTokenTwo({ address: tokens[0], ticker: "Token 2" });
          }
        } catch (error) {
          console.error("Error fetching pool tokens:", error);
          message.error("Failed to fetch tokens from pool");
        }
      }
    };

    fetchPoolTokens();
  }, [isConnected, contract]);

  async function changeAmount(e) {
    const amount = e.target.value;
    setTokenOneAmount(amount);
    if (amount) {
      try {
        const calculatedAmount = await contract.getAmountOfTokens(
          tokenOne.address,
          tokenTwo.address,
          ethers.utils.parseEther(amount.toString())
        );
        setCalculatedTokenTwoAmount(calculatedAmount.toString());
      } catch (error) {
        console.error("Error calculating token amount:", error);
      }
    } else {
      setCalculatedTokenTwoAmount(null);
    }
  }

  function switchToken() {
    const one = tokenOne;
    const two = tokenTwo;
    setTokenOne(two);
    setTokenTwo(one);
  }

  function openModal(asset) {
    setChangeToken(asset);
    setIsOpen(true);
  }

  function modifyToken(token) {
    if (changeToken === 1) {
      setTokenOne({ address: token, ticker: "Token 1" });
    } else {
      setTokenTwo({ address: token, ticker: "Token 2" });
    }
    setIsOpen(false);
  }

  async function handleSwap() {
    try {
      const tx = await contract.swap(
        tokenOne.address,
        tokenTwo.address,
        ethers.utils.parseEther(tokenOneAmount.toString())
      );
      console.log("Swap transaction:", tx);
      message.success("Swap successful!");
    } catch (error) {
      console.error("Error swapping tokens:", error);
      message.error("Failed to swap tokens");
    }
  }

  return (
    <>
      <Modal
        visible={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a token"
      >
        <div className="modalContent">
          {poolTokens.map((token, index) => (
            <div
              className="tokenChoice"
              key={index}
              onClick={() => modifyToken(token)}
            >
              <div className="tokenName">{`Token ${index + 1}`}</div>
              <div className="tokenTicker">{token}</div>
            </div>
          ))}
        </div>
      </Modal>
      <div className="tradeBox">
        <div className="tradeBoxHeader">
          <h4>swap</h4>
          <Popover
            content={<div>Slippage Tolerance</div>}
            title="Setting"
            trigger="click"
            placement="bottomRight"
          >
            <SettingOutlined className="cog" />
          </Popover>
        </div>
        <div className="inputs">
          <Input
            placeholder="0"
            value={tokenOneAmount}
            onChange={changeAmount}
          />
          <Input
            placeholder="0"
            value={calculatedTokenTwoAmount}
            disabled={true}
          />
          <div className="switchButton" onClick={switchToken}>
            <AccountBookOutlined className="switchArrow" />
          </div>
          <div className="assetOne" onClick={() => openModal(1)}>
            {tokenOne.ticker}
            <DownOutlined />
          </div>
          <div className="assetTwo" onClick={() => openModal(2)}>
            {tokenTwo.ticker}
            <DownOutlined />
          </div>
        </div>
        <div
          className="swapButton"
          disabled={!tokenOneAmount || !calculatedTokenTwoAmount}
          onClick={handleSwap}
        >
          swap
        </div>
      </div>
    </>
  );
}

export default Swap;
