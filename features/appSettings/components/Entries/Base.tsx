import { Text, View } from 'react-native-ui-lib';

export interface AppSettingsEntryBaseProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

export function AppSettingsEntryBase({
    title,
    description,
    children,
}: AppSettingsEntryBaseProps) {
    return (
        <View row marginH-s2 paddingV-s2 centerV>
            <View flexG>
                <Text text80M>{title}</Text>
                {description && <Text text90L>{description}</Text>}
            </View>
            <View>{children}</View>
        </View>
    );
}
