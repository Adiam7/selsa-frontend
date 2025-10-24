// src/features/auth/hooks/useUser.ts

import { useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  token: string;
  // Add more fields as needed
}

export const useUser = (): { user: User | null; isAuthenticated: boolean } => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Example: get token from localStorage
    const token = localStorage.getItem('accessToken'); // or sessionStorage, etc.

    if (token) {
      // You could decode token or fetch profile if needed
      setUser({
        id: '', // maybe decode from JWT
        email: '',
        token,
      });
    } else {
      setUser(null);
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user,
  };
};
