
import { HistoryRecord } from "../types";

const DB_NAME = 'RidgeAiDB';
const DB_VERSION = 5; // Incremented for request counting
const STORE_SETTINGS = 'settings';
const STORE_HISTORY = 'history';
const STORE_STATS = 'stats';

const KEY_ID = 'gemini_api_key';
const KEY_PAID_MODE = 'use_paid_api';
const KEY_PROVIDER = 'ai_provider';
const KEY_OPENROUTER_API_KEY = 'openrouter_api_key';

// Stats Keys
const KEY_DAILY_REQUESTS = 'daily_request_count'; // Changed from token usage
const KEY_LAST_RESET_DATE = 'last_reset_date';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB not supported"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
        db.createObjectStore(STORE_SETTINGS);
      }

      if (!db.objectStoreNames.contains(STORE_HISTORY)) {
        const historyStore = db.createObjectStore(STORE_HISTORY, { keyPath: 'id', autoIncrement: true });
        historyStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORE_STATS)) {
        db.createObjectStore(STORE_STATS);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// --- STATS & REQUESTS OPERATIONS ---

export const saveRequestUsage = async (increment: number = 1): Promise<void> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_STATS, 'readwrite');
    const store = tx.objectStore(STORE_STATS);

    const todayStr = new Date().toDateString();

    // Get last reset date
    const lastResetReq = store.get(KEY_LAST_RESET_DATE);
    
    lastResetReq.onsuccess = () => {
      const lastReset = lastResetReq.result;
      
      let currentUsage = 0;

      if (lastReset !== todayStr) {
        // New day, reset
        store.put(todayStr, KEY_LAST_RESET_DATE);
        currentUsage = increment;
      } else {
        // Same day, fetch current usage
        const usageReq = store.get(KEY_DAILY_REQUESTS);
        usageReq.onsuccess = () => {
          const stored = usageReq.result;
          currentUsage = (typeof stored === 'number' ? stored : 0) + increment;
          finishSave(currentUsage);
        };
        return; // Wait for inner async
      }
      
      finishSave(currentUsage);
    };

    function finishSave(usage: number) {
      store.put(usage, KEY_DAILY_REQUESTS);
      // Dispatch custom event to update UI immediately
      window.dispatchEvent(new CustomEvent('requestsUpdated', { detail: usage }));
    }

  } catch (error) {
    console.error("Error saving request usage:", error);
  }
};

export const getRequestUsage = async (): Promise<number> => {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_STATS, 'readonly');
      const store = tx.objectStore(STORE_STATS);
      const todayStr = new Date().toDateString();

      const dateReq = store.get(KEY_LAST_RESET_DATE);
      dateReq.onsuccess = () => {
        if (dateReq.result !== todayStr) {
          resolve(0); // It's a new day effectively
        } else {
          const usageReq = store.get(KEY_DAILY_REQUESTS);
          usageReq.onsuccess = () => {
            resolve(usageReq.result || 0);
          };
        }
      };
    });
  } catch (error) {
    return 0;
  }
};

// --- GEMINI API KEY OPERATIONS ---

export const saveApiKey = async (key: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_SETTINGS, 'readwrite');
    const store = transaction.objectStore(STORE_SETTINGS);
    const request = store.put(key, KEY_ID);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getApiKey = async (): Promise<string | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_SETTINGS, 'readonly');
    const store = transaction.objectStore(STORE_SETTINGS);
    const request = store.get(KEY_ID);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

export const removeApiKey = async (): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_SETTINGS, 'readwrite');
    const store = transaction.objectStore(STORE_SETTINGS);
    const request = store.delete(KEY_ID);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// --- OPENROUTER OPERATIONS ---

export const saveOpenRouterKey = async (key: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_SETTINGS, 'readwrite');
    const store = transaction.objectStore(STORE_SETTINGS);
    const request = store.put(key, KEY_OPENROUTER_API_KEY);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getOpenRouterKey = async (): Promise<string | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_SETTINGS, 'readonly');
    const store = transaction.objectStore(STORE_SETTINGS);
    const request = store.get(KEY_OPENROUTER_API_KEY);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

export const saveProvider = async (provider: 'gemini' | 'openrouter'): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_SETTINGS, 'readwrite');
    const store = transaction.objectStore(STORE_SETTINGS);
    const request = store.put(provider, KEY_PROVIDER);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getProvider = async (): Promise<'gemini' | 'openrouter'> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_SETTINGS, 'readonly');
    const store = transaction.objectStore(STORE_SETTINGS);
    const request = store.get(KEY_PROVIDER);
    request.onsuccess = () => resolve(request.result || 'gemini');
    request.onerror = () => reject(request.error);
  });
};

// --- PAID MODE OPERATIONS (GEMINI) ---

export const savePaidMode = async (isPaid: boolean): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_SETTINGS, 'readwrite');
    const store = transaction.objectStore(STORE_SETTINGS);
    const request = store.put(isPaid, KEY_PAID_MODE);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getPaidMode = async (): Promise<boolean> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_SETTINGS, 'readonly');
    const store = transaction.objectStore(STORE_SETTINGS);
    const request = store.get(KEY_PAID_MODE);
    request.onsuccess = () => resolve(!!request.result);
    request.onerror = () => reject(request.error);
  });
};

// --- HISTORY OPERATIONS ---

export const saveHistory = async (record: Omit<HistoryRecord, 'id'>): Promise<number> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_HISTORY, 'readwrite');
    const store = transaction.objectStore(STORE_HISTORY);
    const request = store.add(record);
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
};

export const getHistory = async (): Promise<HistoryRecord[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_HISTORY, 'readonly');
    const store = transaction.objectStore(STORE_HISTORY);
    const index = store.index('timestamp');
    const request = index.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteHistoryItem = async (id: number): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_HISTORY, 'readwrite');
    const store = transaction.objectStore(STORE_HISTORY);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
