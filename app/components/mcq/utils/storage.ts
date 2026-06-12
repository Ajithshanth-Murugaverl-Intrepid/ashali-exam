// Cloud sync callback — registered by AuthProvider when a user is signed in.
let _cloudSync: ((key: string, value: unknown) => void) | null = null;

export function registerStorageSync(fn: (key: string, value: unknown) => void) {
  _cloudSync = fn;
}

export function unregisterStorageSync() {
  _cloudSync = null;
}

export function safeReadStorageJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function safeWriteStorageJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage write failures (quota/private mode).
  }

  // Fire-and-forget cloud sync when a user is signed in.
  try {
    _cloudSync?.(key, value);
  } catch {
    // Never block the UI on sync failures.
  }
}
