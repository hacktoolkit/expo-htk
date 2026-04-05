import { MMKV, type MMKVConfiguration } from 'react-native-mmkv';

/**
 * Creates an instance of MMKV state storage with optional configuration.
 * Lazy-initializes MMKV to avoid crashes during module loading.
 * Falls back to in-memory storage if MMKV is unavailable (e.g. remote debugger).
 *
 * @param  configuration - Optional MMKV configuration.
 * @returns An object with methods to interact with MMKV storage.
 * @returns {Function} getItem - Retrieves a string value for a given key. Returns null if the key does not exist.
 * @returns {Function} setItem - Stores a string value with the given key.
 * @returns {Function} removeItem - Removes the value associated with the given key.
 * @returns {Function} clearAll - Clears all data stored in MMKV.
 *
 * @example
 * const storage = createMMVKStateStorage();
 * storage.setItem('key', 'value');
 * const value = storage.getItem('key'); // 'value'
 * storage.removeItem('key');
 * const clearedValue = storage.getItem('key'); // null
 * storage.clearAll();
 */
export function createMMVKStateStorage(configuration?: MMKVConfiguration) {
    let storage: MMKV | null = null;
    let initFailed = false;
    const fallback = new Map<string, string>();

    function getStorage(): MMKV | null {
        if (initFailed) return null;
        if (!storage) {
            try {
                storage = new MMKV(configuration);
            } catch (e) {
                console.warn('[MMKV] Failed to initialize, using in-memory fallback:', e);
                initFailed = true;
                return null;
            }
        }
        return storage;
    }

    return {
        getItem: (key: string): string | null => {
            const s = getStorage();
            if (s) return s.getString(key) ?? null;
            return fallback.get(key) ?? null;
        },
        setItem: (key: string, value: string): void => {
            const s = getStorage();
            if (s) s.set(key, value);
            else fallback.set(key, value);
        },
        removeItem: (key: string): void => {
            const s = getStorage();
            if (s) s.delete(key);
            else fallback.delete(key);
        },
        clearAll: (): void => {
            const s = getStorage();
            if (s) s.clearAll();
            else fallback.clear();
        },
    };
}
