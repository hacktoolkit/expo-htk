import type { Theme as NavigationTheme } from '@react-navigation/native';
import { Colors, DesignTokens, DesignTokensDM } from 'react-native-ui-lib';

export function createScheme(scheme: Record<string, string>, isDark: boolean) {
    return {
        ...(isDark ? DesignTokensDM : DesignTokens),
        $backgroundScreen: isDark ? Colors.grey5 : Colors.grey70,
        ...scheme,
    };
}

export function createReactNavigationTheme(
    scheme: Record<string, string>,
    isDark = false
): NavigationTheme {
    return {
        dark: isDark,
        colors: {
            primary: scheme.$textPrimary,
            background: scheme.$backgroundScreen || scheme.$backgroundNeutral,
            card: scheme.$backgroundDefault,
            text: scheme.$textDefault,
            border: scheme.$backgroundDisabled,
            notification: scheme.$textDangerLight,
        },
    };
}
