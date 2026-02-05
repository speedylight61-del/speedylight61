import  { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { tokenManager } from "../src/lib/token-manager";
import { jwtDecode } from 'jwt-decode';

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  isSignedIn: boolean;
  setIsSignedIn: (val: boolean) => void;
  isTokenValid: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);


interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() =>
  {
    const stored = localStorage.getItem('token');
    if (stored)
    {
      tokenManager.set(stored);
      setTokenState(stored);
    }
  }, []);

  const setToken = (token: string | null) => {
    if (token) tokenManager.set(token);
    else tokenManager.clear();

    setTokenState(token);
  }
  const isTokenValid = () => {
    const t = tokenManager.get();
    if (!t) return false;
    try 
    {
      const decoded = jwtDecode(t);
      const currentTime = Date.now() / 1000;
      if (typeof decoded !== 'object' || !decoded.exp) return false;
      return decoded.exp > currentTime;
    }
    catch (e)
    {
      return false;
    }
  } 

  return (
    <AuthContext.Provider value={{  setIsSignedIn, token, setToken, isSignedIn:!!token, isTokenValid }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}