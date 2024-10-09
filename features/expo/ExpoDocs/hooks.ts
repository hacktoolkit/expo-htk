import { useEffect, useState } from 'react';

import { enumToStr } from 'htk/utils/enum';
import * as Device from 'expo-device';
import { DateTime } from 'luxon';

import { DeviceInfo } from './constants';
import { DeviceType } from './enums';

export const useDeviceInfo = () => {
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
        brand: null,
        manufacturer: null,
        deviceName: null,
        modelId: null,
        modelName: null,
        osName: null,
        osVersion: null,
        osBuildId: null,
        osInternalBuildId: null,
        deviceType: null,
        deviceYearClass: null,
        isDevice: null,
        supportedCpuArchitectures: null,
        totalMemory: null,
        uptime: null,
        isJailBroken: null,
    });

    useEffect(() => {
        const fetchDeviceInfo = () => {
            Promise.all([
                Device.getDeviceTypeAsync(),
                Device.getUptimeAsync(),
                Device.isRootedExperimentalAsync(),
            ])
                .then(([deviceType, uptime, isJailBroken]) => {
                    setDeviceInfo({
                        brand: Device.brand,
                        manufacturer: Device.manufacturer,
                        deviceName: Device.deviceName,
                        modelId: Device.modelId,
                        modelName: Device.modelName,
                        osName: Device.osName,
                        osVersion: Device.osVersion,
                        osBuildId: Device.osBuildId,
                        osInternalBuildId: Device.osInternalBuildId,
                        deviceType: enumToStr(DeviceType, deviceType),
                        deviceYearClass: Device.deviceYearClass,
                        isDevice: Device.isDevice,
                        supportedCpuArchitectures: Device.supportedCpuArchitectures,
                        totalMemory: Device.totalMemory,
                        uptime: DateTime.fromMillis(uptime).toFormat('hh:mm:ss'),
                        isJailBroken: isJailBroken,
                    });
                })
                .catch((error) => {
                    console.error('Failed to fetch device info:', error);
                });
        };

        fetchDeviceInfo();
    }, []);

    return deviceInfo;
};
