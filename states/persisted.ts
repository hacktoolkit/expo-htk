import { createLocalStorageStateStorage } from '@htk/storages/localStorage/state';
import { createMMVKStateStorage } from '@htk/storages/mmkv/state';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { Platform } from 'react-native';
import type { MMKVConfiguration } from 'react-native-mmkv';

/**
 * Creates a persisted state atom using the specified storage configuration.
 *
 * This function returns a function that creates a Jotai atom with storage.
 * The storage is determined based on the platform: for web, it uses local storage;
 * for other platforms, it uses MMKV storage.
 *
 * @param [configuration] - Optional configuration for MMKV storage.
 * @returns A function that creates a Jotai atom with storage.
 *
 * @example
 * const usePersistedState = createPersistedState();
 * const myAtom = usePersistedState('myKey', 'defaultValue');
 */
export function createPersistedState(configuration?: MMKVConfiguration) {
    const storage =
        Platform.OS === 'web'
            ? createLocalStorageStateStorage()
            : createMMVKStateStorage(configuration);

    return <T>(key: string, initialValue: T) =>
        atomWithStorage<T>(
            key,
            initialValue,
            createJSONStorage<T>(() => storage)
        );
}
