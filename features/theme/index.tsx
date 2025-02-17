import React from 'react';

import { createPersistedState } from '@htk/states';
import { ThemeProvider } from '@react-navigation/native';
import { useAtomValue, useSetAtom } from 'jotai/react';
import { Appearance } from 'react-native';
import {
    Colors,
    Spacings,
    ThemeManager,
    View,
    type SchemeType,
} from 'react-native-ui-lib';

import { AppSettingsContainer, AppSettingsEntrySwitch } from '../appSettings';
import { ThemeSettingsButton } from './components/ThemeSettingsButton';
import type { Schemes } from './types';
import { createReactNavigationTheme, createScheme } from './utils';

type ModifiableComponent = 'Text' | 'View' | 'Button';

export type Scheme = {
    name: string;
    isDark: boolean;
    colors: Record<string, string>;
};

export interface CreateThemeOptions {
    enabled: boolean;
    ignoreSystemMode: boolean;
    supportDarkMode: boolean;
    defaultScheme: 'light' | 'dark';
    schemes: Schemes;
    colors?: Record<string, string>;
    spacings?: Record<string, number>;
    componentDefaults?: Record<ModifiableComponent, Record<string, any>>;
}

function setColorScheme(scheme: 'light' | 'dark', ignoreSystemMode: boolean) {
    if (ignoreSystemMode) {
        Colors.setScheme(scheme as SchemeType);
    } else {
        const systemScheme = Appearance.getColorScheme() as 'light' | 'dark' | null;
        Colors.setScheme(systemScheme || 'default');
    }
}

export function createTheme({
    ignoreSystemMode,
    supportDarkMode,
    defaultScheme,
    schemes,
    colors,
    spacings,
    componentDefaults,
}: CreateThemeOptions) {
    const persistedAtom = createPersistedState();

    const atom = persistedAtom<{ ignoreSystemMode: boolean; scheme: 'light' | 'dark' }>(
        'theme',
        {
            ignoreSystemMode,
            scheme: defaultScheme,
        }
    );

    if (supportDarkMode) {
        Colors.supportDarkMode();
    }

    if (colors) {
        Colors.loadColors(colors);
    }

    if (spacings) {
        Spacings.loadSpacings(spacings);
    }

    if (componentDefaults) {
        Object.entries(componentDefaults).forEach(([component, defaults]) => {
            ThemeManager.setComponentTheme(component, defaults);
        });
    }

    const availableSchemes = {
        light: createScheme(schemes.light || {}, false),
        dark: createScheme(schemes.dark || {}, true),
    };

    Colors.loadSchemes(availableSchemes);

    function useChangeScheme() {
        const setTheme = useSetAtom(atom);
        return (scheme: 'light' | 'dark') => {
            setTheme((prev) => {
                const next = { ...prev, scheme };
                setColorScheme(scheme, next.ignoreSystemMode);
                return next;
            });
        };
    }

    function useThemeScheme() {
        const { ignoreSystemMode, scheme } = useAtomValue(atom);
        const [state, setState] = React.useState<'light' | 'dark'>(scheme);

        React.useEffect(() => {
            setColorScheme(scheme, ignoreSystemMode);
            setState(scheme);
        }, [scheme, ignoreSystemMode]);

        return state;
    }

    function useIgnoreSystemMode() {
        const { ignoreSystemMode } = useAtomValue(atom);
        return ignoreSystemMode
    }

    function ThemeProviderComponent({ children }: { children: React.ReactNode }) {
        const { scheme, ignoreSystemMode } = useAtomValue(atom);
        const [navThemeState, setNavThemeState] = React.useState(
            createReactNavigationTheme(
                availableSchemes[scheme],
                scheme === 'dark'
            )
        );

        React.useEffect(() => {
            setColorScheme(scheme, ignoreSystemMode);
            setNavThemeState(
                createReactNavigationTheme(
                    availableSchemes[scheme],
                    scheme === 'dark'
                )
            );
        }, [scheme, ignoreSystemMode]);

        return (
                <ThemeProvider value={navThemeState}>{children}</ThemeProvider>
        );
    }

    function ThemeSettings() {
        const { ignoreSystemMode, scheme } = useAtomValue(atom);
        const setState = useSetAtom(atom);
        const changeTheme = useChangeScheme();

        const dispatch = () => {
            setState((prev) => {
                const next = { ...prev, ignoreSystemMode: !ignoreSystemMode };
                setColorScheme(prev.scheme || defaultScheme, next.ignoreSystemMode);
                return next;
            });
        };

        return (
            <AppSettingsContainer title="Theme">
                <AppSettingsEntrySwitch
                    field="ignoreSystemMode"
                    title="Override system theme?"
                    value={ignoreSystemMode}
                    dispatch={dispatch}
                />
                {ignoreSystemMode && (
                    <View row gap-s2 padding-s2>
                        {Object.entries(availableSchemes).map(([name, themeScheme]) => (
                            <ThemeSettingsButton
                                key={name}
                                name={name as 'light' | 'dark'}
                                theme={themeScheme}
                                isActive={scheme === name}
                                onPress={changeTheme}
                            />
                        ))}
                    </View>
                )}
            </AppSettingsContainer>
        );
    }

    return {
        useChangeTheme: useChangeScheme,
        useThemeScheme,
        useIgnoreSystemMode,
        ThemeProvider: ThemeProviderComponent,
        ThemeSettings,
    };
}
