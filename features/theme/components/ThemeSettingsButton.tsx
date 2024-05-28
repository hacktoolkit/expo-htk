import { StyleSheet } from 'react-native';
import { Text, TouchableOpacity, type DesignTokens } from 'react-native-ui-lib';

export interface ThemeSettingsButtonProps {
    name: 'light' | 'dark';
    theme: typeof DesignTokens;
    isActive: boolean;
    onPress: (theme: 'light' | 'dark') => void;
}

export function ThemeSettingsButton({
    name,
    isActive,
    theme,
    onPress,
}: ThemeSettingsButtonProps) {
    const handlePress = () => {
        onPress(name);
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            center
            br100
            style={[
                styles.button,
                {
                    borderColor: theme.$backgroundNeutralIdle,
                    backgroundColor: theme.$backgroundDefault,
                },
                isActive && { borderWidth: 4 },
            ]}
        >
            <Text color={theme.$textDefault}>{name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 70,
        height: 70,
        borderWidth: 1,
    },
});
