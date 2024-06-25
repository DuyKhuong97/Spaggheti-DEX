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
  const { connectWallet } = useConnect({
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
            "0x4693f53e8B5085A1D29D14148Edd59D591e578e4", // contract address
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
      await connectWallet();
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };

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
