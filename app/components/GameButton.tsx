"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { User, Target, Shield, Crosshair } from "lucide-react";
import Link from "next/link";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
import ABI from '../abis/contractABI.json'; 

export default function GameButton() {
  const [purchaseInProgress, setPurchaseInProgress] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const router = useRouter();

  const handlePurchase = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask.");
      return;
    }

    setPurchaseInProgress(true);
    setShowExplosion(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      // Get bullet price from contract
      const price = await contract.bulletPrice();

      // Send transaction
      const tx = await contract.purchaseBullets({ value: price });
      await tx.wait();

      console.log("Bullets purchased!");

      // Redirect to game page after purchase
      router.push("/tank");
    } catch (error) {
      console.error("Purchase failed:", error);
    } finally {
      setShowExplosion(false);
      setPurchaseInProgress(false);
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* UI Elements */}
      <div className="relative z-10 container mx-auto">
        <div className="flex justify-center pt-16 pb-16">
          <button
            onClick={handlePurchase}
            disabled={purchaseInProgress}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 transition-all text-white font-bold rounded-lg"
          >
            {purchaseInProgress ? "Processing..." : "Buy Bullets"}
          </button>

          {showExplosion && <div className="explosion-effect"></div>}
        </div>
      </div>
    </div>
  );
}
