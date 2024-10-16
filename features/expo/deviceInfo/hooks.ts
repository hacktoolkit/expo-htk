import { useEffect, useState } from 'react';

import { enumToStr } from '../../../utils/enum';
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
        const fetchDeviceInfo = async () => {
            try {
                let deviceType = null;
                let uptime = null;
                let isJailBroken = null;

                try {
                    deviceType = await Device.getDeviceTypeAsync();
                } catch (error) {
                    console.error('Failed to fetch device type:', error);
                }

                try {
                    uptime = await Device.getUptimeAsync();
                } catch (error) {
                    console.error('Failed to fetch uptime:', error);
                }

                try {
                    isJailBroken = await Device.isRootedExperimentalAsync();
                } catch (error) {
                    console.error('Failed to check if device is rooted:', error);
                }

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
                    deviceType: deviceType ? enumToStr(DeviceType, deviceType) : null,
                    deviceYearClass: Device.deviceYearClass,
                    isDevice: Device.isDevice,
                    supportedCpuArchitectures: Device.supportedCpuArchitectures,
                    totalMemory: Device.totalMemory,
                    uptime: uptime ? DateTime.fromMillis(uptime).toFormat('hh:mm:ss') : null,
                    isJailBroken,
                });
            } catch (error) {
                console.error('Failed to fetch device info:', error);
            }
        };

        fetchDeviceInfo();
    }, []);

    return deviceInfo;
};
