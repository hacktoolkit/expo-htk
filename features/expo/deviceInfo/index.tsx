import React from 'react';

import { Card, Text, View } from 'react-native-ui-lib';

import { useDeviceInfo } from '../../../features/expo/deviceInfo/hooks';

import { Dividers } from '../../../utils/theme';

import { DEVICE_INFO_FIELDS } from './constants';

export function ExpoDeviceInfo() {
    const deviceInfo = useDeviceInfo();

    return (
        <Card padding-s4 gap-s4 marginV-s4 marginH-s4>
            {DEVICE_INFO_FIELDS.map(({ title, identifier }, index) => (
                <View
                    key={identifier}
                    gap-s2
                    paddingT-s2
                    style={index !== 0 && Dividers.top1}
                >
                    <Text text70>{title}</Text>
                    <View>
                        <Text>
                            {deviceInfo[identifier] !== null
                                ? deviceInfo[identifier]?.toString()
                                : 'N/A'}
                        </Text>
                    </View>
                </View>
            ))}
        </Card>
    );
}
