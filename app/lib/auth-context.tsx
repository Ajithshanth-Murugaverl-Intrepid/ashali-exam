"use client";

import { createClient } from "@/lib/supabase/client";
import { fetchSubjectProgress, saveSubjectProgress } from "@/app/lib/study-db";
import type { User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  registerStorageSync,
  unregisterStorageSync,
} from "@/app/components/mcq/utils/storage";
import { safeReadStorageJson } from "@/app/components/mcq/utils/storage";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

const SYNCABLE_KEYS = [
  "biology-random-game-v1",
  "chemistry-random-game-v1",
  "physics-random-game-v1",
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  const syncToCloud = useCallback(
    async (key: string, value: unknown) => {
      if (!user) return;
      await saveSubjectProgress(key, value);
    },
    [user]
  );

  const loadFromCloud = useCallback(
    async (userId: string) => {
      const data = await fetchSubjectProgress(userId);

      data.forEach(({ storage_key, payload }) => {
        if (typeof window === "undefined") return;
        if (!SYNCABLE_KEYS.includes(storage_key)) return;
        const existing = safeReadStorageJson(storage_key);
        if (!existing) {
          try {
            window.localStorage.setItem(storage_key, JSON.stringify(payload));
          } catch {}
        }
      });
    },
    []
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (user) {
      registerStorageSync(syncToCloud);
      loadFromCloud(user.id);
    } else {
      unregisterStorageSync();
    }
  }, [user, syncToCloud, loadFromCloud]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
