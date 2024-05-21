import { createMMVKStateStorage } from '@htk/storages/mmkv/state';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import type { MMKVConfiguration } from 'react-native-mmkv';

/**
 * Creates a persisted MMKV state atom with optional configuration.
 *
 * @param configuration - Optional MMKV configuration.
 * @returns A function that creates a persisted atom with the given key and initial value.
 *
 * @example
 * const createPersistedState = createPersistedMMKVState();
 * const countAtom = createPersistedState('count', 0);
 * const [count, setCount] = useAtom(countAtom);
 */
export function createPersistedMMKVState(configuration?: MMKVConfiguration) {
    const storage = createMMVKStateStorage(configuration);

    return <T>(key: string, initialValue: T) =>
        atomWithStorage<T>(
            key,
            initialValue,
            createJSONStorage<T>(() => storage),
        );
}
