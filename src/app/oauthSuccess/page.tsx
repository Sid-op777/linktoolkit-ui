'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const OAuthSuccessPage = () => {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      // Optionally set token in a global auth context or fetch user info
      router.push('/');
    } else {
      router.push('/'); // fallback
    }
  }, []);

  return <p>Logging you in...</p>;
};

export default OAuthSuccessPage;