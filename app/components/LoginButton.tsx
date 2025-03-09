'use client'

import { useOCAuth } from '@opencampus/ocid-connect-js';

export default function LoginButton() {
  const { ocAuth } = useOCAuth();

  const handleLogin = async () => {
    if (!ocAuth) {
      console.error('Auth object is not initialized properly');
      return;
    }

    try {
      // Add additional logging to track the flow
      console.log('Initiating login redirect...');
      await ocAuth.signInWithRedirect({ state: 'opencampus' });
      console.log('Redirect initiated successfully'); 
    } catch (error) {
      // More detailed error logging
      console.error(error)
    }
  };

  return (
    <button 
      onClick={handleLogin}
      className="ml-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-12 py-4 rounded-full text-xl font-bold hover:from-orange-600 hover:to-red-700 transition shadow-lg"
    >
      Continue with OpenCampus
    </button>
  );
}