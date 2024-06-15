import React, { useState, useEffect } from "react";
import { Input, Popover, Radio, Modal, message } from "antd";
import {
  AccountBookOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";

function Swap() {
  const [Slippage, setSlippage] = useState(2.5);
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokentwoAmount] = useState(null);
  const [tokenOne, setTokenOne] = useState({ name: "", ticker: "", img: "" });
  const [tokenTwo, setTokenTwo] = useState({ name: "", ticker: "", img: "" });
  const [isOpen, setIsOpen] = useState(false);
  const [changeToken, setChangeToken] = useState(1);

  function handleSlippageChange(e) {
    setSlippage(e.target.value);
  } 

  function changeAmount(e) {
    setTokenOneAmount(e.target.value);
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
      setTokenOne(token);
    } else {
      setTokenTwo(token);
    }
    setIsOpen(false);
  }

  const settings = (
    <>
      <div>Slippage Tolerance</div>
      <div>
        <Radio.Group value={Slippage} onChange={handleSlippageChange}>
          <Radio.Button value={0.5}>0.5%</Radio.Button>
          <Radio.Button value={2.5}>2.5%</Radio.Button>
          <Radio.Button value={5}>5.0%</Radio.Button>
        </Radio.Group>
      </div>
    </>
  );

  return (
    <>
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a token"
      >
        <div className="modalContent">
          {/* Replace with a dummy token list or a API call to fetch tokens */}
          {[{ name: "Token 1", ticker: "TKN1", img: "" }, { name: "Token 2", ticker: "TKN2", img: "" }].map((token, i) => {
            return (
              <div
                className="tokenChoice"
                key={i}
                onClick={() => modifyToken(token)}
              >
                <img src={token.img} alt={token.ticker} className="tokenLogo" />
                <div className="tokenChoiceName">
                  <div className="tokenName">{token.name}</div>
                  <div className="tokenTicker">{token.ticker}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
      <div className="tradeBox">
        <div className="tradeBoxHeader">
          <h4>swap</h4>
          <Popover
            content={settings}
            title="setting"
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
          <Input placeholder="0" value={tokenTwoAmount} disabled={true} />
          <div className="switchButton" onClick={switchToken}>
            <AccountBookOutlined className="switchArrow" />
          </div>
          <div className="assetOne" onClick={() => openModal(1)}>
            <img src={tokenOne.img} alt="assetOneLogo" className="assetLogo" />
            {tokenOne.ticker}
            <DownOutlined />
          </div>
          <div className="assetTwo" onClick={() => openModal(2)}>
            <img src={tokenTwo.img} alt="assetOneLogo" className="assetLogo" />
            {tokenTwo.ticker}
            <DownOutlined />
          </div>
        </div>
        <div className="swapButton" disabled={!tokenOneAmount}>
          swap
        </div>
      </div>
    </>
  );
}

export default Swap;