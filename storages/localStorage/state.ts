/**
 * Creates an instance of localStorage state storage with optional configuration.
 *
 * @returns An object with methods to interact with localStorage.
 * @returns {Function} getItem - Retrieves a string value for a given key. Returns null if the key does not exist.
 * @returns {Function} setItem - Stores a string value with the given key.
 * @returns {Function} removeItem - Removes the value associated with the given key.
 * @returns {Function} clearAll - Clears all data stored in localStorage.
 *
 * @example
 * const storage = createMMVKStateStorage();
 * storage.setItem('key', 'value');
 * const value = storage.getItem('key'); // 'value'
 * storage.removeItem('key');
 * const clearedValue = storage.getItem('key'); // null
 * storage.clearAll();
 */
export function createLocalStorageStateStorage() {
    return {
        getItem: (key: string): string | null => {
            const item = localStorage.getItem(key);

            if (item !== null) {
                return JSON.parse(item);
            }
            return null;
        },
        setItem: (key: string, value: string): void => {
            localStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: (key: string): void => {
            localStorage.removeItem(key);
        },
        clearAll: (): void => {
            localStorage.clear();
        },
    };
}
