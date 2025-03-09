"use client";

import React, { useState, useEffect } from 'react';
import { User, Target, Shield, Crosshair } from 'lucide-react';
import GameButton from '../components/GameButton';
import Link from 'next/link';

export default function Main() {
  const [hovering, setHovering] = useState(false);
  const [purchaseInProgress, setPurchaseInProgress] = useState(false);
  const [animateBackground, setAnimateBackground] = useState(false);
  
  // Simulate explosion particles when button is clicked
  const [showExplosion, setShowExplosion] = useState(false);
  
  useEffect(() => {
    // Start background animation after component mounts
    setAnimateBackground(true);
    
    // Setup any other animation initializations here
    return () => {
      // Cleanup animations if needed
    };
  }, []);
  
  const handlePurchase = async () => {
    setPurchaseInProgress(true);
    setShowExplosion(true);
    
    // Reset explosion animation after it completes
    setTimeout(() => setShowExplosion(false), 1000);
    
    try {
      // Simulate contract interaction
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Launch game - in production this would load your WASM file
      console.log("Loading Tank Duel from WASM file...");
      
      // Reset purchase state
      setPurchaseInProgress(false);
    } catch (error) {
      console.error("Purchase failed:", error);
      setPurchaseInProgress(false);
    }
  };

  return (
    <div className={`relative min-h-screen text-white overflow-hidden ${animateBackground ? 'bg-animate' : ''}`}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-black bg-opacity-80 z-0"></div>
      <div className="absolute inset-0 bg-grid-pattern z-0 opacity-20"></div>
      
      {/* Animated Tank Tracks at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-repeat-x tank-tracks-animation z-0"></div>
      
      {/* Content Container */}
      <div className="relative z-10 container mx-auto">
        {/* Nav Bar */}
        <div className="flex justify-between items-center py-4 px-6">
          <div className="text-2xl font-black tracking-wider text-green-400 glow-text">
            <span className="text-green-500">T</span>
            <span className="text-yellow-500">A</span>
            <span className="text-orange-500">N</span>
            <span className="text-red-500">K</span>
            <span className="ml-2 text-blue-400">DUEL</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/leaderboard" className="nav-link">
              <Target size={20} className="mr-2" />
              <span>Leaderboard</span>
            </Link>
            
            <Link href="/arsenal" className="nav-link">
              <Crosshair size={20} className="mr-2" />
              <span>Arsenal</span>
            </Link>
            
            <Link href="/profile" className="profile-button">
              <User size={24} />
            </Link>
          </div>
        </div>
        
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center pt-16 pb-16 px-4">
          <div className="relative mb-2">
            <h1 className="text-6xl font-black mb-4 text-center metal-text tracking-widest">
              TANK DUEL
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
          </div>
          
          <p className="text-xl mb-12 text-center max-w-2xl text-gray-300 gameplay-font">
            Challenge your friends in this intense 1v1 tank battle where strategy, positioning, and ammunition management determine the victor
          </p>
          
          {/* Game Preview with Frame */}
          <div className="relative w-full max-w-4xl mb-12 game-screen-frame">
            <div className="aspect-video bg-black flex items-center justify-center overflow-hidden">
              {/* In production, replace this with your actual game GIF */}
              <img 
                src="/api/placeholder/800/450" 
                alt="Tank Duel Gameplay" 
                className="w-full h-full object-cover opacity-90 game-footage"
              />
              
              {/* Scan lines overlay */}
              <div className="absolute inset-0 scanlines"></div>
              
              {/* HUD Elements */}
              <div className="absolute top-0 left-0 right-0 p-4 flex justify-between">
                <div className="hud-element">
                  <Shield size={16} className="mr-1 text-blue-400" />
                  <span className="text-blue-400">ARMOR: 100%</span>
                </div>
                <div className="hud-element">
                  <Crosshair size={16} className="mr-1 text-red-400" />
                  <span className="text-red-400">AMMO: 10</span>
                </div>
              </div>
            </div>
            
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-green-500"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-green-500"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-green-500"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-green-500"></div>
          </div>
          
          {/* Enhanced Game Button - You would replace this with your actual GameButton component */}
          <div className="relative">
            <GameButton />
            
            {showExplosion && (
              <div className="explosion-effect"></div>
            )}
          </div>
        </div>
        
        {/* Game Info Panels */}
        <div className="max-w-4xl mx-auto px-6 py-8 grid gap-8 md:grid-cols-2">
          <div className="feature-panel">
            <div className="panel-header">
              <h2 className="panel-title">
                <Target size={20} className="mr-2" />
                GAME FEATURES
              </h2>
            </div>
            <div className="panel-content">
              <ul className="space-y-3">
                <li className="feature-item">
                  <span className="feature-bullet"></span> 
                  <span>Intense 1v1 tank battles with strategic gameplay</span>
                </li>
                <li className="feature-item">
                  <span className="feature-bullet"></span> 
                  <span>Blockchain-recorded wins and losses</span>
                </li>
                <li className="feature-item">
                  <span className="feature-bullet"></span> 
                  <span>Bullet economy: manage your ammunition wisely</span>
                </li>
                <li className="feature-item">
                  <span className="feature-bullet"></span> 
                  <span>WebAssembly powered for smooth, responsive duels</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="feature-panel">
            <div className="panel-header">
              <h2 className="panel-title">
                <Crosshair size={20} className="mr-2" />
                HOW TO PLAY
              </h2>
            </div>
            <div className="panel-content">
              <ol className="space-y-3">
                <li className="feature-item">
                  <span className="step-number">1</span> 
                  <span>Purchase bullets using the button above</span>
                </li>
                <li className="feature-item">
                  <span className="step-number">2</span> 
                  <span>Find an opponent for your duel</span>
                </li>
                <li className="feature-item">
                  <span className="step-number">3</span> 
                  <span>First-time players receive free bullets</span>
                </li>
                <li className="feature-item">
                  <span className="step-number">4</span> 
                  <span>Your battle statistics are recorded on the blockchain</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tank silhouette decorations */}
      <div className="absolute bottom-20 left-0 tank-silhouette tank-left"></div>
      <div className="absolute bottom-24 right-0 tank-silhouette tank-right"></div>
    </div>
  );
}