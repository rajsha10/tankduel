"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractABI from './abis/contractABI.json';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import LoginButton from './components/LoginButton';
import { useOCAuth } from '@opencampus/ocid-connect-js';
import OrangeSidebar from './components/OrangeSidebar';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function Home() {
  const [currentView, setCurrentView] = useState('initial'); // 'initial', 'wallet', 'profile', 'confirm'
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [name, setName] = useState('');
  const [profileExists, setProfileExists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playerName, setPlayerName] = useState('');

  const { authState, ocAuth } = useOCAuth(); 

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          console.log(await signer.getAddress());

          // Initialize contract instance
          const gameContract = new ethers.Contract(contractAddress, contractABI, signer);
          setContract(gameContract);

          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            checkProfile(accounts[0], gameContract);
          }
        } catch (error) {
          console.error('Error connecting to wallet:', error);
        }
      } else {
        console.error('MetaMask not installed');
      }

      const unsubscribe = ocAuth.subscribe(setAuthState);
      return () => unsubscribe();
    }

    init();

    // Listen for account change
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          checkProfile(accounts[0], contract);
        } else {
          setAccount(null);
          setProfileExists(false);
          setCurrentView('initial');
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, [ocAuth]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsLoading(true);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        
        if (!contract) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const gameContract = new ethers.Contract(contractAddress, contractABI, signer);
          setContract(gameContract);
          await checkProfile(accounts[0], gameContract);
        } else {
          await checkProfile(accounts[0], contract);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        setIsLoading(false);
      }
    } else {
      alert('Please install MetaMask');
    }
  };

  const checkProfile = async (address, contractInstance) => {
    if (contractInstance) {
      try {
        const player = await contractInstance.players(address);
        if (player && player.exists) {
          const name = await contractInstance.getName(address);
          setPlayerName(name);
          setProfileExists(true);
          setCurrentView('confirm');
        } else {
          setProfileExists(false);
          setCurrentView('profile');
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        // In case of error, proceed to profile creation
        setProfileExists(false);
        setCurrentView('profile');
      }
    } else {
      // For demo/testing purposes - simulate profile check
      console.log("Contract not available, using demo mode");
      // Change this to true/false to test different flows
      const demoProfileExists = false;
      
      if (demoProfileExists) {
        setPlayerName("DemoPlayer");
        setProfileExists(true);
        setCurrentView('confirm');
      } else {
        setProfileExists(false);
        setCurrentView('profile');
      }
    }
  };

  const createProfile = async () => {
    if (!name) {
      alert('Please enter a name');
      return;
    }

    setIsLoading(true);
    if (contract) {
      try {
        const tx = await contract.createProfile(name);
        await tx.wait();
        setPlayerName(name);
        setProfileExists(true);
        setIsLoading(false);
        setCurrentView('confirm');
      } catch (error) {
        console.error('Error creating profile:', error);
        setIsLoading(false);
      }
    } else {
      // For demo purposes when contract is not available
      setTimeout(() => {
        setPlayerName(name);
        setProfileExists(true);
        setIsLoading(false);
        setCurrentView('confirm');
      }, 1500);
    }
  };

  const startGame = () => {
    window.location.href = '/main';
  };

  // Glowing animation for buttons
  const glowAnimation = {
    animate: {
      boxShadow: [
        '0 0 5px rgba(255, 140, 0, 0.6), 0 0 10px rgba(255, 69, 0, 0.4)',
        '0 0 15px rgba(255, 140, 0, 0.8), 0 0 20px rgba(255, 69, 0, 0.6)',
        '0 0 5px rgba(255, 140, 0, 0.6), 0 0 10px rgba(255, 69, 0, 0.4)'
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse'
      }
    }
  };

  // Floating animation for main button
  const floatingAnimation = {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="h-screen w-full relative overflow-hidden" style={{ 
      backgroundImage: "url('/images/background.jpeg')", 
      backgroundSize: 'cover', 
      backgroundPosition: 'center' 
    }}>
      {/* Animated particles in background */}
      <div className="absolute inset-0 z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-orange-500 opacity-20"
            style={{
              width: Math.random() * 20 + 10,
              height: Math.random() * 20 + 10,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          />
        ))}
      </div>

      {/* Orange sidebar with subtle animation */}
      <OrangeSidebar />
      

      {/* Login button with animation */}
      <motion.div 
        className="absolute top-8 right-8 z-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.button 
          className="bg-white text-black px-4 py-1 rounded-full text-sm font-medium border-2 border-orange-500"
          whileHover={{ scale: 1.05, backgroundColor: '#FFEDD5', borderColor: '#F97316' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentView('wallet')}
        >
          LOG-IN
        </motion.button>
      </motion.div>

      {/* Main content */}
      <div className="h-full flex justify-center items-center z-10 relative">
        {currentView === 'initial' && (
          <motion.button
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-12 py-4 rounded-full text-xl font-bold hover:from-orange-600 hover:to-red-700 transition shadow-lg"
            onClick={() => setCurrentView('wallet')}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            LFG!
          </motion.button>
        )}

        {/* Wallet Connection Dialog */}
        <AnimatePresence>
          {currentView === 'wallet' && (
            <motion.div 
              className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-gray-900 p-8 rounded-xl w-96 max-w-md border-2 border-orange-500 shadow-2xl"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <motion.button 
                    onClick={() => setCurrentView('initial')}
                    className="text-orange-500 text-2xl"
                    whileHover={{ scale: 1.2, color: '#FDBA74' }}
                    whileTap={{ scale: 0.9 }}
                  >
                    &lt;
                  </motion.button>
                </div>
                
                <motion.button
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg mb-4 relative overflow-hidden"
                  onClick={connectWallet}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  {...glowAnimation}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <motion.div 
                        className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      CONNECTING...
                    </div>
                  ) : (
                    "CONNECT WALLET"
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <h1>Welcome to My App</h1>
          {authState?.isAuthenticated ? (
            <p>You are logged in! {JSON.stringify(authState)}</p>
          ) : (
            <LoginButton />
          )}
        </div>

        {/* Profile Creation Dialog */}
        <AnimatePresence>
          {currentView === 'profile' && (
            <motion.div 
              className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-gray-900 p-8 rounded-xl w-96 max-w-md border-2 border-orange-500 shadow-2xl"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <motion.button 
                    onClick={() => setCurrentView('wallet')}
                    className="text-orange-500 text-2xl"
                    whileHover={{ scale: 1.2, color: '#FDBA74' }}
                    whileTap={{ scale: 0.9 }}
                  >
                    &lt;
                  </motion.button>
                </div>
                
                <motion.button
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg mb-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  {...glowAnimation}
                >
                  {account ? 
                    `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 
                    "WALLET INFO"
                  }
                </motion.button>
                
                <motion.div 
                  className="mb-4 relative"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.input
                    type="text"
                    className="w-full p-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white placeholder-white text-center font-bold"
                    placeholder="Player User Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    whileFocus={{ scale: 1.02, boxShadow: "0 0 20px rgba(255, 140, 0, 0.6)" }}
                  />
                </motion.div>
                
                <motion.button
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg relative overflow-hidden"
                  onClick={createProfile}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  {...glowAnimation}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <motion.div 
                        className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      SUBMITTING...
                    </div>
                  ) : (
                    "SUBMIT"
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirmation Dialog */}
        {/* <AnimatePresence>
          {currentView === 'confirm' && (
            <motion.div 
              className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-gray-900 p-8 rounded-xl w-96 max-w-md flex flex-col items-center border-2 border-orange-500 shadow-2xl"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
              >
                <motion.div 
                  className="w-24 h-24 rounded-full border-2 border-orange-500 flex items-center justify-center mb-8 relative"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, 0, -10, 0] }}
                  transition={{ 
                    scale: { type: "spring", stiffness: 200, damping: 10 },
                    rotate: { delay: 0.5, duration: 0.5 }
                  }}
                >
                  <motion.div
                    className="absolute w-full h-full rounded-full"
                    animate={{ 
                      boxShadow: [
                        "0 0 0 0px rgba(249, 115, 22, 0.4)",
                        "0 0 0 20px rgba(249, 115, 22, 0)"
                      ]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <motion.path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </svg>
                </motion.div>
                
                {profileExists ? (
                  <>
                    <motion.h2 
                      className="text-2xl font-bold text-white mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      Welcome back, {playerName}!
                      <Link href='/main' className='w-full flex items-center justify-center'>
                      <motion.button
                        className="bg-black text-white font-bold text-lg px-8 py-3 rounded-xl border-2 border-orange-500 shadow-lg relative overflow-hidden mt-10"
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 0 15px rgba(249, 115, 22, 0.6)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                          boxShadow: [
                            "0 0 5px rgba(249, 115, 22, 0.4)",
                            "0 0 12px rgba(249, 115, 22, 0.7)",
                            "0 0 5px rgba(249, 115, 22, 0.4)"
                          ]
                        }}
                        transition={{
                          boxShadow: {
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }
                        }}
                      >
                        PLAY
                        <motion.div 
                          className="absolute inset-0 bg-orange-500"
                          initial={{ x: "-100%", opacity: 0.2 }}
                          animate={{ x: "100%" }}
                          transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1 }}
                          style={{ mixBlendMode: "overlay" }}
                        />
                      </motion.button>
                      </Link>
                    </motion.h2>
                  </>
                ) : (
                  <>
                    <motion.h2 
                      className="text-2xl font-bold text-white mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      Profile Created!
                    </motion.h2>
                    <motion.button
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-xl relative overflow-hidden"
                      onClick={startGame}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      {...glowAnimation}
                    >
                      PLAY NOW
                      <motion.div 
                        className="absolute inset-0 bg-white"
                        initial={{ x: "-100%", opacity: 0.3 }}
                        animate={{ x: "100%" }}
                        transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1 }}
                        style={{ mixBlendMode: "overlay" }}
                      />
                    </motion.button>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence> */}
      </div>
    </div>
  );
}