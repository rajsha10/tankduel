"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      }
    };

    checkConnection();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setAccount(await signer.getAddress());
      setIsConnected(true);
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  return { account, isConnected, connectWallet };
}