
import { HistoryRecord } from "../types";

const DB_NAME = 'RidgeAiDB';
const DB_VERSION = 2;
const STORE_SETTINGS = 'settings';
const STORE_HISTORY = 'history';
const KEY_ID = 'gemini_api_key';
const KEY_PAID_MODE = 'use_paid_api';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB not supported"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create Settings Store
      if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
        db.createObjectStore(STORE_SETTINGS);
      }

      // Create History Store
      if (!db.objectStoreNames.contains(STORE_HISTORY)) {
        const historyStore = db.createObjectStore(STORE_HISTORY, { keyPath: 'id', autoIncrement: true });
        historyStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// --- API KEY OPERATIONS ---

export const saveApiKey = async (key: string): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_SETTINGS, 'readwrite');
      const store = transaction.objectStore(STORE_SETTINGS);
      const request = store.put(key, KEY_ID);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error saving API key:", error);
    throw error;
  }
};

export const getApiKey = async (): Promise<string | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_SETTINGS, 'readonly');
      const store = transaction.objectStore(STORE_SETTINGS);
      const request = store.get(KEY_ID);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error getting API key:", error);
    return null;
  }
};

export const removeApiKey = async (): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_SETTINGS, 'readwrite');
      const store = transaction.objectStore(STORE_SETTINGS);
      const request = store.delete(KEY_ID);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error removing API key:", error);
    throw error;
  }
};

// --- PAID MODE OPERATIONS ---

export const savePaidMode = async (isPaid: boolean): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_SETTINGS, 'readwrite');
      const store = transaction.objectStore(STORE_SETTINGS);
      const request = store.put(isPaid, KEY_PAID_MODE);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error saving paid mode:", error);
  }
};

export const getPaidMode = async (): Promise<boolean> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_SETTINGS, 'readonly');
      const store = transaction.objectStore(STORE_SETTINGS);
      const request = store.get(KEY_PAID_MODE);
      
      request.onsuccess = () => resolve(!!request.result); // Default to false if undefined
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    return false;
  }
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
