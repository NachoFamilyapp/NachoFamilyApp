"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { UserService } from "@/lib/userService";
import { UserProfile } from "@/types/user";

type UserContextValue = {
  uid: string | null;
  profile: UserProfile | null;
  loading: boolean;
  setName: (name: string) => Promise<void>;
};

const UserContext = createContext<UserContextValue>({
  uid: null,
  profile: null,
  loading: true,
  setName: async () => {},
});

export function useUser() {
  return useContext(UserContext);
}

type Props = {
  children: ReactNode;
};

const NAME_CACHE_KEY = "vakantieapp_naam";

export default function UserProvider({ children }: Props) {
  const [uid, setUid] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        return;
      }

      setUid(user.uid);

      try {
        const existing = await UserService.getProfile(user.uid);

        if (existing) {
          setProfile(existing);
          localStorage.setItem(NAME_CACHE_KEY, existing.name);
        }
      } catch (error) {
        console.error("Kon profiel niet laden:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function setName(name: string) {
    if (!uid) return;

    const created = await UserService.createProfile(uid, name);
    setProfile(created);
    localStorage.setItem(NAME_CACHE_KEY, name);
  }

  return (
    <UserContext.Provider value={{ uid, profile, loading, setName }}>
      {children}
    </UserContext.Provider>
  );
}
