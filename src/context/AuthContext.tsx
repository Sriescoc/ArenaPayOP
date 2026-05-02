import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { UserProfile } from '../lib/firestore-types';

interface AuthContextType {
  user: User | null;
  userData: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null, userData: null, loading: true,
  signOut: async () => {}, refreshUserData: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubFirestore: (() => void) | null = null;
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (unsubFirestore) { unsubFirestore(); unsubFirestore = null; }
      if (firebaseUser) {
        const ref = doc(db, 'users', firebaseUser.uid);
        unsubFirestore = onSnapshot(ref,
          (snap) => { setUserData(snap.exists() ? snap.data() as UserProfile : null); setLoading(false); },
          () => { setUserData(null); setLoading(false); }
        );
      } else { setUserData(null); setLoading(false); }
    });
    return () => { unsubAuth(); if (unsubFirestore) unsubFirestore(); };
  }, []);

  const handleSignOut = useCallback(async () => {
    await firebaseSignOut(auth); setUser(null); setUserData(null);
  }, []);

  const refreshUserData = useCallback(async () => {
    if (!auth.currentUser) return;
    const snap = await getDoc(doc(db, 'users', auth.currentUser.uid));
    if (snap.exists()) setUserData(snap.data() as UserProfile);
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading, signOut: handleSignOut, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
}
