import React from 'react';

import { createPersistedMMKVState } from '@htk/states';
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
import { Schemes } from './types';
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

export function createTheme({
    ignoreSystemMode,
    supportDarkMode,
    defaultScheme,
    schemes,
    colors,
    spacings,
    componentDefaults,
}: CreateThemeOptions) {
    const persistedAtom = createPersistedMMKVState();

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
                const next = { ...prev, theme: scheme };

                if (next.ignoreSystemMode) {
                    Colors.setScheme(scheme as SchemeType);
                } else {
                    Colors.setScheme('default');
                }

                return next;
            });
        };
    }

    function useThemeScheme() {
        const [state, setState] = React.useState<'light' | 'dark'>(defaultScheme);
        const { ignoreSystemMode, scheme } = useAtomValue(atom);

        React.useEffect(() => {
            const systemScheme = Appearance.getColorScheme() as 'light' | 'dark' | null;

            setState(ignoreSystemMode ? scheme : systemScheme ?? defaultScheme);
        }, [scheme, ignoreSystemMode, defaultScheme]);

        return state;
    }

    function ThemeProviderComponent({ children }: { children: React.ReactNode }) {
        const { scheme, ignoreSystemMode } = useAtomValue(atom);
        const [navThemeState, setNavThemeState] = React.useState(
            createReactNavigationTheme(
                availableSchemes[defaultScheme],
                scheme === 'dark'
            )
        );

        React.useEffect(() => {
            if (scheme !== undefined) {
                setNavThemeState(
                    createReactNavigationTheme(
                        availableSchemes[scheme],
                        scheme === 'dark'
                    )
                );
            }
        }, [scheme, ignoreSystemMode]);

        return <ThemeProvider value={navThemeState}>{children}</ThemeProvider>;
    }

    function ThemeSettings() {
        const { ignoreSystemMode, scheme } = useAtomValue(atom);
        const setState = useSetAtom(atom);
        const changeTheme = useChangeScheme();

        const dispatch = () => {
            setState((prev) => {
                const next = { ...prev, ignoreSystemMode: !ignoreSystemMode };

                if (next.ignoreSystemMode) {
                    Colors.setScheme(prev.scheme || defaultScheme);
                } else {
                    Colors.setScheme('default');
                }

                return next;
            });
        };

        return (
            <AppSettingsContainer title="Theme">
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
                <AppSettingsEntrySwitch
                    field="ignoreSystemMode"
                    title="Ignore system mode?"
                    value={ignoreSystemMode}
                    dispatch={dispatch}
                />
            </AppSettingsContainer>
        );
    }

    return {
        useChangeTheme: useChangeScheme,
        useThemeScheme,
        ThemeProvider: ThemeProviderComponent,
        ThemeSettings,
    };
}
