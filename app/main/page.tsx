"use client";

import React, { useState, useEffect } from 'react';
import { User, Target, Shield, Crosshair, Video } from 'lucide-react';
import GameButton from '../components/GameButton';
import Link from 'next/link';
import './main.css';

export default function Main() {
  const [hovering, setHovering] = useState(false);
  const [purchaseInProgress, setPurchaseInProgress] = useState(false);
  const [animateBackground, setAnimateBackground] = useState(false);
  const [particles, setParticles] = useState([]);
  
  // Simulate explosion particles when button is clicked
  const [showExplosion, setShowExplosion] = useState(false);
  
  useEffect(() => {
    // Start background animation after component mounts
    setAnimateBackground(true);
    
    // Generate random particles for the background
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 1 + 0.5,
          color: `rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 150 + 100)}, ${Math.floor(Math.random() * 50 + 200)}, ${Math.random() * 0.5 + 0.2})`,
        });
      }
      setParticles(newParticles);
    };
    
    generateParticles();
    
    // Animation loop for particles
    const particleInterval = setInterval(() => {
      setParticles(prevParticles => 
        prevParticles.map(particle => ({
          ...particle,
          y: particle.y - particle.speed > 0 ? particle.y - particle.speed : 100,
          x: particle.x + (Math.random() - 0.5) * 0.5,
        }))
      );
    }, 50);
    
    return () => {
      clearInterval(particleInterval);
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
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-blue-900 to-black z-0"></div>
      
      {/* Moving particles */}
      {particles.map(particle => (
        <div 
          key={particle.id}
          className="absolute rounded-full pointer-events-none z-0"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
        />
      ))}
      
      {/* Hexagonal grid pattern */}
      <div className="absolute inset-0 bg-hexagon-pattern z-0 opacity-20"></div>
      
      {/* Radar sweep animation */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-4xl opacity-10 z-0">
        <div className="radar-sweep"></div>
      </div>
      
      {/* Battle damage effects */}
      <div className="absolute inset-0 bg-battle-damage opacity-30 z-0"></div>
      
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
            <Link href="/main" className="nav-link">
              <Target size={20} className="mr-2" />
              <span>Leaderboard</span>
            </Link>
            
            <Link href="/main" className="nav-link">
              <Crosshair size={20} className="mr-2" />
              <span>Arsenal</span>
            </Link>
            
            <Link href="/profile" className="profile-button">
              <User size={24} />
            </Link>
          </div>
        </div>
        
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center pt-8 pb-4 px-4">
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
              <video
                src="/images/main_back.mp4" 
                className="w-full h-full object-cover opacity-80 game-footage"
                autoPlay
                loop
                muted
                playsInline
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
      
      {/* Add glowing grid lines */}
      <div className="absolute inset-0 grid-lines"></div>
    </div>
  );
}