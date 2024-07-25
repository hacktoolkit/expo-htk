import { Text, TouchableOpacity, View } from 'react-native-ui-lib';

export interface AppSettingsEntryBaseProps {
    title: string;
    description?: string;
    onPress: () => void;
    children: React.ReactNode;
}

export function AppSettingsEntryBase({
    title,
    description,
    onPress,
    children,
}: AppSettingsEntryBaseProps) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View row marginH-s2 paddingV-s2 centerV>
                <View flexG>
                    <Text text80M $textDefault>
                        {title}
                    </Text>
                    {description && <Text text90L>{description}</Text>}
                </View>
                <View>{children}</View>
            </View>
        </TouchableOpacity>
    );
}
