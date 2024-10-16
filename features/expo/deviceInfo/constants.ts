export interface DeviceInfo {
  brand: string | null;
  manufacturer: string | null;
  deviceName: string | null;
  modelId: string | null;
  modelName: string | null;
  osName: string | null;
  osVersion: string | null;
  osBuildId: string | null;
  osInternalBuildId: string | null;
  deviceType: string | null;
  deviceYearClass: number | null;
  isDevice: boolean | null;
  supportedCpuArchitectures: string[] | null;
  totalMemory: number | null;
  uptime: string | null;
  isJailBroken: boolean | null;
}

export const DEVICE_INFO_FIELDS: {
  title: string;
  identifier: keyof DeviceInfo;
}[] = [
  { title: "Brand", identifier: "brand" },
  { title: "Manufacturer", identifier: "manufacturer" },
  { title: "Device Name", identifier: "deviceName" },
  { title: "Model ID", identifier: "modelId" },
  { title: "Model Name", identifier: "modelName" },
  { title: "OS Name", identifier: "osName" },
  { title: "OS Version", identifier: "osVersion" },
  { title: "OS Build ID", identifier: "osBuildId" },
  { title: "OS Internal Build ID", identifier: "osInternalBuildId" },
  { title: "Device Type", identifier: "deviceType" },
  { title: "Device Year Class", identifier: "deviceYearClass" },
  { title: "Physical Device", identifier: "isDevice" },
  {
    title: "Supported CPU Architectures",
    identifier: "supportedCpuArchitectures",
  },
  { title: "Total Memory (Bytes)", identifier: "totalMemory" },
  { title: "Uptime", identifier: "uptime" },
  { title: "Jail Broken", identifier: "isJailBroken" },
];
