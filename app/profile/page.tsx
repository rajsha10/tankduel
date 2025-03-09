"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../abis/contractABI.json";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function Profile() {
  const [profile, setProfile] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  
  useEffect(() => {
    if (signer) {
      fetchProfile();
    }
  }, [signer]);

  async function connectWallet() {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = await provider.getSigner();
        setSigner(signer);
        setWalletAddress(await signer.getAddress());
      } catch (error) {
        console.error("Error connecting wallet", error);
      }
    } else {
      alert("Please install MetaMask");
    }
  }

  async function fetchProfile() {
    try {
      if (!signer) return;
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const profileData = await contract.getProfile(walletAddress);
      setProfile({
        name: profileData[0],
        bullets: profileData[1].toNumber(),
        wins: profileData[2].toNumber(),
        losses: profileData[3].toNumber(),
        score: profileData[4].toNumber(),
      });
    } catch (error) {
      console.error("Profile not found or error fetching profile", error);
    }
  }

  async function createProfile() {
    if (!name) return;
    setLoading(true);
    try {
      if (!signer) return;
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.createProfile(name);
      await tx.wait();
      fetchProfile();
    } catch (error) {
      console.error("Error creating profile", error);
    }
    setLoading(false);
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      {!signer ? (
        <button
          onClick={connectWallet}
          className="bg-green-500 text-white p-2 rounded"
        >
          Connect Wallet
        </button>
      ) : profile ? (
        <div className="bg-gray-800 p-4 rounded-lg text-white">
          <h2 className="text-xl font-bold">Profile</h2>
          <p>Name: {profile.name}</p>
          <p>Bullets: {profile.bullets}</p>
          <p>Wins: {profile.wins}</p>
          <p>Losses: {profile.losses}</p>
          <p>Score: {profile.score}</p>
        </div>
      ) : (
        <div className="bg-gray-800 p-4 rounded-lg text-white">
          <h2 className="text-xl font-bold">Create Profile</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            className="w-full p-2 text-black"
          />
          <button
            onClick={createProfile}
            className="mt-2 bg-blue-500 text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Profile"}
          </button>
        </div>
      )}
    </div>
  );
}
