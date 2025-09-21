import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';

// TODO: Replace with your Firebase project config (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCQJIYtyiT1XTmiVU7PNzI0sT-V-nokWGQ",
  authDomain: "imchef-d91c6.firebaseapp.com",
  projectId: "imchef-d91c6",
  storageBucket: "imchef-d91c6.firebasestorage.app",
  messagingSenderId: "554785438284",
  appId: "1:554785438284:web:04ad38aa94c980230852e9",
  measurementId: "G-RDVBNP3RV2"
};


let authInstance: ReturnType<typeof getAuth> | null = null;
const ensureAuth = (): ReturnType<typeof getAuth> | null => {
  if (authInstance) return authInstance;
  try {
    const app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    return authInstance;
  } catch (e) {
    // Likely missing env vars; avoid crashing app
    console.warn('Firebase not initialized. Did you set VITE_FIREBASE_* env vars?');
    return null;
  }
};

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const a = ensureAuth();
    if (!a) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(a, (fbUser) => {
      setUser(fbUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signIn = async (email: string, password: string) => {
    const a = ensureAuth();
    if (!a) throw new Error('Firebase is not configured. Add VITE_FIREBASE_* to .env and restart.');
    await signInWithEmailAndPassword(a, email, password);
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    const a = ensureAuth();
    if (!a) throw new Error('Firebase is not configured. Add VITE_FIREBASE_* to .env and restart.');
    const cred = await createUserWithEmailAndPassword(a, email, password);
    if (displayName) {
      try {
        await updateProfile(cred.user, { displayName });
      } catch (e) {
        console.warn('Failed to set displayName on signup', e);
      }
    }
  };

  const signInWithGoogle = async () => {
    const a = ensureAuth();
    if (!a) throw new Error('Firebase is not configured. Add VITE_FIREBASE_* to .env and restart.');
    const provider = new GoogleAuthProvider();
    await signInWithPopup(a, provider);
  };

  const signOutUser = async () => {
    const a = ensureAuth();
    if (!a) return;
    await signOut(a);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
