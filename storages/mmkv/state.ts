import { MMKV, type MMKVConfiguration } from 'react-native-mmkv';

/**
 * Creates an instance of MMKV state storage with optional configuration.
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
    const storage = new MMKV(configuration);

    return {
        getItem: (key: string): string | null => {
            return storage.getString(key) ?? null;
        },
        setItem: (key: string, value: string): void => {
            storage.set(key, value);
        },
        removeItem: (key: string): void => {
            storage.delete(key);
        },
        clearAll: (): void => {
            storage.clearAll();
        },
    };
}
