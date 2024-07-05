import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'antd';
import { ContextWeb3 } from "../context";
import { ethers } from "ethers";
import { LeftOutlined } from "@ant-design/icons";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';



function Token() {
  const { contract } = useContext(ContextWeb3);
  const [tokens, setTokens] = useState([]);
  const navigate = useNavigate();
  const {t, _} = useTranslation();
  const ABI = [
    "function symbol() view returns (string)",
              "function balanceOf(address) view returns (uint256)"
  ];
  useEffect(() => {
    const fetchTokens = async () => {
      if (contract) {
        try {
          const tokenList = await contract.getAllTokens();
          console.log(tokenList);
          const tokenData = await Promise.all(tokenList.map(async (token, index) => {
            const tokenContract = new ethers.Contract(token.tokenAddress, ABI, contract.provider);
            console.log(tokenContract);
            const symbol = await tokenContract.symbol();
            const reserve = await tokenContract.balanceOf(contract.address);
            
            return {
              symbol: symbol,
              address: token.tokenAddress.slice(0, 6) + "..." + token.tokenAddress.slice(35),
              reserve: parseFloat(ethers.utils.formatUnits(reserve, 18)).toFixed(3)
            };
          }));
          setTokens(tokenData);
          console.log(tokenData);
        } catch (error) {
          console.error("Error fetching tokens:", error);
        }
      }
    };

    fetchTokens();
  }, [contract]);

  const columns = [
    {
      title: 'Token',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: t('Address'),
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: t('Reserve'),
      dataIndex: 'reserve',
      key: 'reserve',
    },
  ];
const handleIconClick = () => {
    navigate("/");
  };
  return (
    <div className="tradeBox">
      
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
            paddingLeft: "120px",
            paddingRight: "130px",
          }}
        >
          {t("Token List")}
        </h4>
      </div>
      <Table columns={columns} dataSource={tokens} className='customTable' />
    </div>
  );
}

export default Token;
