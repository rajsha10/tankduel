import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OrangeSidebar = () => {
  return (
    <div>
      <motion.div 
        className="absolute top-0 left-0 h-full w-1/5 bg-gradient-to-b from-orange-600 to-orange-700 flex items-start p-8 z-10"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div 
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-300 drop-shadow-md">
            <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h8.25c1.035 0 1.875-.84 1.875-1.875V15z" />
            <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
            <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
          </svg>
          <h1 className="text-yellow-300 text-xl font-bold ml-2 drop-shadow-md">Tank Duel</h1>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default OrangeSidebar
