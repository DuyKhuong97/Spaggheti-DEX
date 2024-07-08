import "./App.css";
import Header from "./components/Header";
import Swap from "./components/Swap";
import Tokens from "./components/Token";
import Pool from "./components/Pool";
import { Routes, Route } from "react-router-dom";
import { useConnect, useAccount } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import axios from "axios";
import { ContextWeb3 } from "./context";


function App() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });

  const [contractABI, setContractABI] = useState(null);
  const [contract, setContract] = useState(null);


  useEffect(() => {
    const fetchContractABI = async () => {
      try {
        console.log("Fetching contract ABI...");
        const response = await axios.get(
          "http://localhost:5000/artifacts/spagghetiDex.json"
        );
        console.log("Contract ABI fetched:", response.data.abi);
        setContractABI(response.data.abi);
      } catch (error) {
        console.error("Error fetching contract ABI:", error);
      }
    };

    fetchContractABI();
  }, []);

  useEffect(() => {
    const connectToContract = async () => {
      if (isConnected && contractABI) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contractInstance = new ethers.Contract(
            "0x8A470a21A648FdFc4e15987f7Ba90285A76C92Ae", // contract address
            contractABI, // ABI fetched from endpoint
            signer
          );
          console.log(
            "Contract connected at address:",
            contractInstance.address
          );
          setContract(contractInstance);
        } catch (error) {
          console.error("Error connecting to contract:", error);
        }
      }
    };

    connectToContract();
  }, [isConnected, contractABI]);

  const handleConnectWallet = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };
  console.log("Address:", address);
  console.log("Is connected:", isConnected);

  // // save address
  // useEffect(() => {
  //   const storeUserAddress = async () => {
  //     if (isConnected && address) {
  //       try {
  //         await client.create({
  //           _type: 'user',
  //           address: address,
  //         });
  //         console.log('User address stored in Sanity Studio:', address);
  //       } catch (error) {
  //         console.error('Error storing user address in Sanity Studio:', error);
  //       }
  //     }
  //   };

  //   storeUserAddress();
  // }, [address, isConnected]);

  return (
    <ContextWeb3.Provider value={{ contract, address }}>
      <div className="App">
        <Header
          connect={handleConnectWallet}
          isConnected={isConnected}
          address={address}
        />
        <div className="mainWindow">
          <Routes>
            <Route
              path="/"
              element={
                <Swap
                  isConnected={isConnected}
                  address={address}
                  contract={contract}
                />
              }
            />
            <Route
              path="/Token"
              element={
                <Tokens
                  isConnected={isConnected}
                  address={address}
                  contract={contract}
                />
              }
            />
            <Route
              path="/Pool"
              element={
                <Pool
                  isConnected={isConnected}
                  address={address}
                  contract={contract}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </ContextWeb3.Provider>
  );
}

export default App;
