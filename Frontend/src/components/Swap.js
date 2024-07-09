import React, { useState, useEffect, useContext } from "react";
import { Input, Modal, message } from "antd";
import { AccountBookOutlined, DownOutlined } from "@ant-design/icons";
import { ContextWeb3 } from "../context";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Swap({ isConnected, address }) {
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [calculatedTokenTwoAmount, setCalculatedTokenTwoAmount] =
    useState(null);
  const [tokenOne, setTokenOne] = useState({ address: "", ticker: "Token 1" });
  const [tokenTwo, setTokenTwo] = useState({ address: "", ticker: "Token 2" });
  const [isOpen, setIsOpen] = useState(false);
  const [changeToken, setChangeToken] = useState(1);
  const [poolTokens, setPoolTokens] = useState([]);
  const navigate = useNavigate();
  const { contract } = useContext(ContextWeb3);
  const {t, _} = useTranslation();

  useEffect(() => {
    const fetchPoolTokens = async () => {
      if (isConnected && contract) {
        try {
          const tokens = await contract.getAllTokens();
          console.log("Tokens in pool:", tokens);
          const formattedTokens = tokens.map((token) => ({
            address: token.tokenAddress,
            symbol: token.tokenSymbol,
          }));
          setPoolTokens(formattedTokens);
          if (formattedTokens.length >= 2) {
            setTokenOne(formattedTokens[0]);
            setTokenTwo(formattedTokens[1]);
          }
        } catch (error) {
          console.error("Error fetching pool tokens:", error);
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
        console.log(`Input Amount: ${amount}`);
        const inputAmount = ethers.utils.parseEther(amount.toString());
        console.log(`Parsed Input Amount (in Wei): ${inputAmount.toString()}`);

        const inputReserve = await contract.tokenReserves(tokenOne.address, tokenTwo.address);
        const outputReserve = await contract.tokenReserves(tokenTwo.address, tokenOne.address);

        const calculatedAmount = await contract.getAmountOfTokens(
          inputAmount,
          inputReserve,
          outputReserve
        );

        console.log(`Calculated Amount (in Wei) from contract: ${calculatedAmount.toString()}`);

        const formattedAmount = ethers.utils.formatEther(calculatedAmount);
        console.log(`Formatted Calculated Amount (in Ether): ${formattedAmount}`);

        const truncatedAmount = parseFloat(formattedAmount).toFixed(3);

        setCalculatedTokenTwoAmount(truncatedAmount);

      } catch (error) {
        console.error("Error calculating token amount:", error);
        message.error({
          content: (
            <span>
              {t("Tokens must be swapped by pair, check at")}{' '}
              <a href='/' onClick={(handleIconClick)}>Token list</a>
            </span>
          ),
          duration: 5,
          style: {
            marginTop: 150, 
            fontSize: 20,
          },
        });
      }
    } else {
      setCalculatedTokenTwoAmount(null);
    }
  }
  const handleIconClick = () => {
    navigate("/Token");
  };
  function switchToken() {
    const one = tokenOne;
    const amountOne = tokenOneAmount;
    const two = tokenTwo;
    const amountTwo = calculatedTokenTwoAmount;

    setTokenOne(two);
    setTokenTwo(one);
    setTokenOneAmount(amountTwo);
    setCalculatedTokenTwoAmount(amountOne);
  }

  function openModal(tokenselected) {
    setChangeToken(tokenselected);
    setIsOpen(true);
  }

  function modifyToken(token) {
    if (changeToken === 1) {
      if (token.address!== tokenTwo.address) {
        setTokenOne({ address: token.address, symbol: token.symbol });
      }
    } else {
      if (token.address!== tokenOne.address) {
        setTokenTwo({ address: token.address, symbol: token.symbol });
      }
    }
    setIsOpen(false);
  }

  async function handleSwap() {
    try {
      const tx = await contract.swap(
        tokenOne.address,
        tokenTwo.address,
        ethers.utils.parseEther(tokenOneAmount.toString()),
        { gasLimit: 1000000 }
      );
      console.log("Swap transaction:", tx);
      message.success(t("Swap done"));
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
        title={t("Select a token")}
      >
        <div className="modalContent">
          {poolTokens.map((token, index) => (
            <div
              className="tokenChoice"
              key={index}
              onClick={() => modifyToken(token)}
            >
              <div className="token">
                Token : {token.symbol} (
                {token.address.slice(0, 6) + "..." + token.address.slice(37)})
              </div>
            </div>
          ))}
        </div>
      </Modal>
      <div className="tradeBox">
        <div className="tradeBoxHeader">
          <h4>{t('SWAP')}</h4>
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
          <div className="tokenselectedOne" onClick={() => openModal(1)}>
            {tokenOne.symbol}
            <DownOutlined />
          </div>
          <div className="tokenselectedTwo" onClick={() => openModal(2)}>
            {tokenTwo.symbol}
            <DownOutlined />
          </div>
        </div>
        <div
          className="swapButton"
          disabled={!tokenOneAmount || !calculatedTokenTwoAmount}
          onClick={handleSwap}
        >
          {t('SWAP')}
        </div>
      </div>
    </>
  );
}

export default Swap;
