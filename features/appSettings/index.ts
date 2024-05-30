import { createPersistedState } from '@htk/states';
import { useAtomValue, useSetAtom } from 'jotai/react';

export * from './components';

/**
 * Creates application settings using persisted MMKV state.
 *
 * @param initial - The initial settings object.
 * @returns An object with the atom, a hook to use the settings, and a function to update a setting.
 * @returns {Object} atom - The Jotai atom representing the settings state.
 * @returns {Function} useAppSettings - A hook to access the settings.
 * @returns {Function} updateAppSetting - A function to update a specific setting.
 *
 * @example
 * const initialSettings = { theme: 'light', notificationsEnabled: true };
 * const { useAppSettings, updateAppSetting } = createAppSettings(initialSettings);
 *
 * const MyComponent = () => {
 *   const settings = useAppSettings();
 *   // Access settings like settings.theme
 *
 *   const toggleTheme = () => {
 *     updateAppSetting('theme', settings.theme === 'light' ? 'dark' : 'light');
 *   };
 * };
 */
export function createAppSettings<TSettings extends Record<string, any>>(
    initial: TSettings
) {
    const persistedAtom = createPersistedState();

    const atom = persistedAtom('appSettings', initial);

    const updateAppSetting = () => {
        const setSettings = useSetAtom(atom);
        return (field: keyof TSettings, value: any): void => {
            setSettings((prev) => {
                return { ...prev, [field]: value };
            });
        };
    };

    const useAppSettings = () => {
        const settings = useAtomValue(atom);
        return { ...settings, dispatch: updateAppSetting() };
    };

    return { atom, useAppSettings, updateAppSetting };
}
