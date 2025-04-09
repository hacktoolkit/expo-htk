import { Card, Text, View } from 'react-native-ui-lib';

export interface AppSettingsContainerProps {
    title?: string;
    children?: React.ReactNode;
}

export function AppSettingsContainer({ title, children }: AppSettingsContainerProps) {
    return (
        <View>
            {title && (
                <Text
                    marginH-s4
                    text90L
                    $textDefault
                    marginB-s1
                    style={{ textTransform: 'uppercase' }}
                >
                    {title}
                </Text>
            )}
            <Card marginH-s2 enableShadow={false} marginB-s6>
                {children}
                <View height={1} bg-$backgroundNeutral />
            </Card>
        </View>
    );
}
