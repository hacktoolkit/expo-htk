import { Ionicons } from '@expo/vector-icons';
import { Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib';

import { AppSettingsEntryBase, type AppSettingsEntryBaseProps } from './Base';

export interface AppSettingsEntryFontSizeProps<TSettings extends Record<string, any>>
    extends Omit<AppSettingsEntryBaseProps, 'children'> {
    field: keyof TSettings;
    value: number;
    dispatch: (field: keyof TSettings, value: any) => void;
    min?: number;
    max?: number;
}

export function AppSettingsEntryFontSize<TSettings extends Record<string, any>>({
    field,
    dispatch,
    value,
    min = 8,
    max = 40,
    ...props
}: AppSettingsEntryFontSizeProps<TSettings>) {
    const handleDecrement = () => (value > min ? dispatch(field, value - 1) : null);
    const handleIncrement = () => (value < max ? dispatch(field, value + 1) : null);

    return (
        <AppSettingsEntryBase {...props}>
            <View row centerV gap-s1>
                <TouchableOpacity onPress={handleDecrement}>
                    <Ionicons
                        name="remove-circle-outline"
                        size={24}
                        color={Colors.$textPrimary}
                    />
                </TouchableOpacity>
                <Text text80M $textDefault>
                    {value}pt
                </Text>
                <TouchableOpacity onPress={handleIncrement}>
                    <Ionicons
                        name="add-circle-outline"
                        size={24}
                        color={Colors.$textPrimary}
                    />
                </TouchableOpacity>
            </View>
        </AppSettingsEntryBase>
    );
}
