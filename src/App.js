import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";
import Lottie from "lottie-react";
import loadingIcon from "./utils/blockchainLoad.json";

const getEthereumObject = () => window.ethereum;

const contractAddress = "0xE03Aff89C65A8A420D26423382068004b612131a";
const contractABI = abi.abi;

async function findMetaMaskAccount() {
  try {
    /*
    * First make sure we have access to the Ethereum object.
    */
    const ethereum = getEthereumObject();
    if (!ethereum) {
      console.error("Metamask is not connected.");
      return null;
    }
    console.log("Metamask is found.");
    const accounts = await ethereum.request({ method: "eth_accounts" });
    
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found auth account: ", account);
      return account;
    }
    else {
      console.error("No auth accounts were found.");
      return null;
    }

  } catch (error) {
    console.error(error);
    return null;
  }
};



// TODO 
async function wave() {
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer); 

      let count = await wavePortalContract.getTotalWaves();
      console.log("Retrieved total wave count:", count.toNumber());
      
      const waveTxn = await wavePortalContract.wave("testing."); 
      console.log("Mining...", waveTxn.hash);

      await waveTxn.wait();

      console.log("Done mining...", waveTxn.hash);

      count = await wavePortalContract.getTotalWaves();
      console.log("Retrieved total wave count:", count.toNumber());
    }
    else {
      console.error("Ethereum object not found.");
    }
  } catch (error) {
    console.log(error);
  }
}

async function connectWallet() {
  try {
    const ethereum = getEthereumObject();
    if (!ethereum) {
      alert("Get Metamask!");
      return;
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected", accounts[0]);
  }
  catch (error) {
    console.error(error);
  }
};

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [loading, setLoadingIcon] = useState(false);
  
  //connectWallet();
  
  const load = () => {
    setLoadingIcon(current => !current);
  };

  useEffect(async () => {
    const account = await findMetaMaskAccount();
    if (account !== null) {
      setCurrentAccount(account);
    }
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Sugma.
        </div>

        <div className="bio">
        Testing Tree. 
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
        <button className="waveButton" onClick={load}>loading icon</button>
        {loading && (
          <Lottie animationData={loadingIcon} loop={true}/>
        )}
        
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>Connect Wallet</button>
        )}
        
      </div>
    </div>
  );
}

export default App; 
