import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'antd';
import "../App.css";
import { ContextWeb3 } from "../context";
import { ethers } from "ethers";

function Token() {
  const { contract } = useContext(ContextWeb3);
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const fetchTokens = async () => {
      if (contract) {
        try {
          const tokenList = await contract.getAllTokens();
          const tokenData = await Promise.all(tokenList.map(async (token, index) => {
            const tokenContract = new ethers.Contract(token.tokenAddress, [
              "function symbol() view returns (string)",
              "function balanceOf(address) view returns (uint256)"
            ], contract.signer);
            
            const symbol = await tokenContract.symbol();
            const reserve = await tokenContract.balanceOf(contract.address);
            
            return {
              symbol: symbol,
              address: token.tokenAddress.slice(0, 6) + "..." + token.tokenAddress.slice(30),
              reserve: parseFloat(ethers.utils.formatUnits(reserve, 18)).toFixed(3)
            };
          }));
          setTokens(tokenData);
        } catch (error) {
          console.error("Error fetching tokens:", error);
        }
      }
    };

    fetchTokens();
  }, [contract]);

  const columns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Reserve',
      dataIndex: 'reserve',
      key: 'reserve',
    },
  ];

  return (
    <div className="tradeBox">
      <h1>Token list</h1>
      <Table columns={columns} dataSource={tokens} className='customTable' />
    </div>
  );
}

export default Token;
