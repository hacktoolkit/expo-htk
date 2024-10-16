import { useEffect, useState } from "react";

import { enumToStr } from "../../../utils/enum";
import * as Device from "expo-device";
import { DateTime } from "luxon";

import { DeviceInfo } from "./constants";
import { DeviceType } from "./enums";

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
      Device.getDeviceTypeAsync()
        .then((deviceType) => {
          if (deviceType) {
            setDeviceInfo((prev) => ({
              ...prev,
              deviceType: enumToStr(DeviceType, deviceType),
            }));
          }
        })
        .catch((error) => {
          console.error("Failed to fetch device type:", error);
        });

      Device.getUptimeAsync()
        .then((uptime) => {
          if (uptime) {
            setDeviceInfo((prev) => ({
              ...prev,
              uptime: DateTime.fromMillis(uptime).toFormat("hh:mm:ss"),
            }));
          }
        })
        .catch((error) => {
          console.error("Failed to fetch uptime:", error);
        });

      Device.isRootedExperimentalAsync()
        .then((isJailBroken) => {
          if (isJailBroken !== null) {
            setDeviceInfo((prev) => ({ ...prev, isJailBroken }));
          }
        })
        .catch((error) => {
          console.error("Failed to check if device is rooted:", error);
        });

      setDeviceInfo((prev) => ({
        ...prev,
        brand: Device.brand,
        manufacturer: Device.manufacturer,
        deviceName: Device.deviceName,
        modelId: Device.modelId,
        modelName: Device.modelName,
        osName: Device.osName,
        osVersion: Device.osVersion,
        osBuildId: Device.osBuildId,
        osInternalBuildId: Device.osInternalBuildId,
        deviceYearClass: Device.deviceYearClass,
        isDevice: Device.isDevice,
        supportedCpuArchitectures: Device.supportedCpuArchitectures,
        totalMemory: Device.totalMemory,
      }));
    };

    fetchDeviceInfo();
  }, []);

  return deviceInfo;
};
