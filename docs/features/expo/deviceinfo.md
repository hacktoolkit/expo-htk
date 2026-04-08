# Device Info Feature

## Overview
A comprehensive component for displaying device and platform information. This feature provides both a ready-to-use UI component (`ExpoDeviceInfo`) and low-level hooks for accessing device metadata directly in custom implementations.

## Location
`features/expo/deviceInfo/`

## Purpose
Allows developers to:
- Display detailed device specifications to users
- Access device information programmatically via hooks
- Show platform-specific details (iOS/Android/Web)
- Provide debugging and diagnostic information
- Implement device-aware UI adaptations

## Files & Components

 File Purpose 
---------------
 `index.tsx` Main `ExpoDeviceInfo` component export 
 `constants.ts` Device info field definitions and metadata 
 `enums.ts` Enumeration types for device properties 
 `hooks.ts` `useDeviceInfo` hook for programmatic access 

## Core Components

### ExpoDeviceInfo Component
Pre-built UI component displaying device information in a structured list format.

```typescript
import { ExpoDeviceInfo } from '@htk/features/expo/deviceInfo';

export function DebugScreen() {
  return (
    <ExpoDeviceInfo />
);
}
```

**Features:**
- Organized device information display
- Platform-specific sections
- Scrollable list for many properties
- Theme-integrated styling
- Copy-to-clipboard functionality (optional)

## Hooks

### useDeviceInfo Hook
Access device information programmatically for custom implementations.

```typescript
import { useDeviceInfo } from '@htk/features/expo/deviceInfo';

function MyComponent() {
  const deviceInfo = useDeviceInfo();

  return (
    <View>
      <Text>Device: {deviceInfo.manufacturer} {deviceInfo.modelName}</Text>
      <Text>OS: {deviceInfo.osVersion}</Text>
      <Text>Platform: {deviceInfo.platform}</Text>
    </View>
);
}
```

### Hook Return Value

```typescript
interface DeviceInfo {
  // Device Hardware
  manufacturer: string; // e.g., "Apple", "Samsung"
  modelName: string; // e.g., "iPhone 15", "SM-G95F"
  modelId: string; // Device model identifier
  designName: string; // Design name if available

  // OS Information
  osName: string; // e.g., "iOS", "Android"
  osVersion: string; // e.g., "18.1"
  osBuildId: string; // Build ID or patch level

  // Platform & Orientation
  platform: DevicePlatform; // 'ios' 'android' 'web'
  platformVersion: string; // Platform API level

  // Device Type
  deviceType: DeviceType; // 'phone' 'tablet' 'unknown'

  // Hardware Capabilities
  hasBluetooth: boolean;
  hasNFC: boolean;
  hasGPS: boolean;
  hasWifi: boolean;
  hasApplePaySupport: boolean;

  // Screen & Display
  displaySize: number; // Diagonal in inches (approximate)

  // Additional Info
  brand: string; // Device brand
  serialNumber: string; // Device serial (may be restricted)
  isTablet: boolean; // Convenience flag
}
```

## Constants

### Device Info Fields
Predefined configuration for which device properties to display:

```typescript
import { DEVICE_INFO_FIELDS } from '@htk/features/expo/deviceInfo';

// Returns array of field definitions including:
// - label: Display name
// - key: Property accessor
// - icon: Optional icon name
// - category: 'hardware' 'os' 'display' etc.
```

## Enums

### DevicePlatform
```typescript
enum DevicePlatform {
  IOS = 'ios',
  ANDROID = 'android',
  WEB = 'web'
}
```

### DeviceType
```typescript
enum DeviceType {
  PHONE = 'phone',
  TABLET = 'tablet',
  UNKNOWN = 'unknown'
}
```

## Usage Examples

### Display Full Device Info
```typescript
import { ExpoDeviceInfo } from '@htk/features/expo/deviceInfo';

export function SettingsScreen() {
  return (
    <ScrollView>
      <Text style={styles.title}>Device Information</Text>
      <ExpoDeviceInfo />
    </ScrollView>
);
}
```

### Custom Device Info Display
```typescript
import { useDeviceInfo } from '@htk/features/expo/deviceInfo';
import { View, Text } from 'react-native';

export function DeviceCard() {
  const device = useDeviceInfo();

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Device</Text>
      <Text style={styles.value}>
        {device.manufacturer} {device.modelName}
      </Text>

    <Text style={styles.label}>Operating System</Text>
    <Text style={styles.value}>
      {device.osName} {device.osVersion}
    </Text>

  {device.isTablet && (
      <Text style={styles.badge}>Tablet Device</Text>
    )}
    </View>
);
}
```

### Conditional Feature Display
```typescript
import { useDeviceInfo } from '@htk/features/expo/deviceInfo';

export function FeatureAvailability() {
  const device = useDeviceInfo();

  return (
    <View>
      {device.hasNFC && (
          <FeatureCard
            title="NFC Payment"
            description="Available on this device"
          />
      )}

  {device.hasGPS && (
      <FeatureCard
        title="Location Services"
        description="GPS enabled"
      />
  )}
    </View>
);
}
```

### Device-Specific Styling
```typescript
import { useDeviceInfo } from '@htk/features/expo/deviceInfo';

export function ResponsiveLayout() {
  const device = useDeviceInfo();
  const isMobile = device.deviceType === 'phone';

  return isMobile ? <MobileLayout /> : <TabletLayout />;
}
```

## Platform-Specific Behavior

### iOS
- Full hardware and OS information available
- Includes Apple Pay support detection
- Model identifier includes generation info

### Android
- API level and build information included
- Brand and manufacturer separately available
- Hardware capabilities vary by device

### Web
- Limited information available (browser/OS)
- Device type inferred from screen size
- Hardware capabilities not applicable

## Use Cases

1. **Debug Screens** - Show device info for troubleshooting
2. **Analytics** - Track which devices are using your app
3. **Feature Flags** - Enable/disable features based on device capabilities
4. **Performance Optimization** - Adjust rendering based on device type
5. **Accessibility** - Adapt UI for tablet vs phone
6. **Crash Reporting** - Include device info with error reports

## Related Documentation
- **Expo Features**: [`../README.md`](../README.md) - Other Expo integrations
- **Features**: [`../../README.md`](../../README.md) - All feature modules

## Integration with Other Features

### With Error Tracking
```typescript
import { useDeviceInfo } from '@htk/features/expo/deviceInfo';
import { useRollbar } from '@htk/utils/rollbar';

export function App() {
  const device = useDeviceInfo();
  const rollbar = useRollbar();

  // Include device info with error reports
  rollbar.configure({
      payload: {
        device: {
          platform: device.platform,
          osVersion: device.osVersion,
          modelName: device.modelName
        }
    }
});
}
```

### With App Settings
```typescript
import { useDeviceInfo } from '@htk/features/expo/deviceInfo';
import { useAppSettings } from '@htk/features/appSettings';

// Provide device-aware default settings
function initializeSettings(device) {
  return {
    fontSize: device.isTablet ? 18 : 16,
    columnCount: device.isTablet ? 2 : 1
  };
}
```

## Performance Considerations
- Hook uses Expo Device API which is synchronous
- Device info is retrieved once on component mount
- Consider memoizing device info in frequently accessed components
- Device info changes rarely, safe to cache results

## TypeScript Support
Full TypeScript types provided for all exports and return values. Type checking ensures safe device property access.

## Browser Support
Works in Expo-based mobile apps and web (limited info). Not suitable for server-side rendering.
