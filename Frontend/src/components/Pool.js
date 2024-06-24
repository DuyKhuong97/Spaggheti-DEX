import React, { useState } from 'react';
import { Select, Space, Input, Flex, Popover, Radio } from 'antd';

import {
  LeftOutlined, SettingOutlined
} from "@ant-design/icons";


function Pool() {
  const [Slippage, setSlippage] = useState(2.5);


  function handleSlippageChange(e) {
    setSlippage(e.target.value);
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
    <div className="tradeBox">
      <Space wrap>
        <div style={{ display: "flex", width: "400px", position: "relative" }}>
          <LeftOutlined style={{}} />
          <h4 style={{ justifyContent: "center", textAlign: "center", paddingLeft: "140px", paddingRight: "130px" }}>Add liquidity</h4>
          <Popover
            content={settings}
            title="setting"
            trigger="click"
            placement="bottomRight"
            style={{ paddingLeft: "40px" }}
          >
            <SettingOutlined className="cog" />
          </Popover>
        </div>
        <div className="tradeBoxHeader">




        </div>
        <div className="input">

          <div style={{gap:"20px"}}>
            <input name="myInput" style={{
              backgroundColor: "#1f2639", color: "white",
              borderwidth: "0px",
              height: "60px" ,
              width:"400px",
              marginbottom: "5px",
              fontsize: "15px",
              borderradius: "12px",
              marginBottom:"10px" }} placeholder='inputhere'  />
            <input name="myInput" style={{
              backgroundColor: "#1f2639", color: "white",
              borderwidth: "0px",
              height: "60px" ,
              width:"400px",
              marginbottom: "5px",
              fontsize: "15px",
              borderradius: "12px",
              marginBottom:"10px"  }} placeholder='inputhere'  />
            <input name="myInput" style={{
              backgroundColor: "#1f2639", color: "white",
              borderwidth: "0px",
              height: "60px" ,
              width:"400px",
              marginbottom: "5px",
              fontsize: "15px",
              borderradius: "12px",
              marginBottom:"10px" }} placeholder='inputhere'  />

            <input name="myInput" style={{
              backgroundColor: "#1f2639", color: "white",
              borderwidth: "0px",
              height: "60px" ,
              width:"400px",
              marginbottom: "5px",
              fontsize: "15px",
              borderradius: "12px",
              marginBottom:"10px" }} placeholder='inputhere' />
          </div>
          <div style={{
            backgroundcolor: "#243056",
            opacity: "0.4",
            color: "#5982f39b",
            
          }}> 
            <button style={{backgroundColor: "#1f2639", color: "white",
              borderwidth: "0px",
              height: "60px" ,
              width:"400px",
              marginbottom: "5px",
              fontsize: "15px",
              borderradius: "12px",
              marginBottom:"10px",}}>Add successful</button>

          </div>

        </div>

      </Space>
    </div>

  );
};
export default Pool;