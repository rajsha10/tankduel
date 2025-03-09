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
      console.error('Login error details:', {
        message: error?.message || 'No error message',
        name: error?.name || 'No error name',
        stack: error?.stack || 'No stack trace',
        error: JSON.stringify(error) || 'Error cannot be stringified'
      });
    }
  };

  return (
    <button 
      onClick={handleLogin}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Login with OpenCampus
    </button>
  );
}