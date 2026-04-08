# Expo Features

## Overview
Integration modules for Expo-specific functionality. Provides utilities and components for accessing device information and other platform-specific features.

## Location
`features/expo/`

## Purpose
Offers pre-built modules for:
- Device information retrieval and display
- Platform-specific data access
- Expo API integration
- Debugging and diagnostics
- Feature availability detection

## Modules

### Device Info
Complete device information system with UI and programmatic access.

**Location:** [`deviceInfo/README.md`](deviceInfo/README.md)

**Features:**
- Display full device specifications
- Access device info via hooks
- Platform-specific details
- Hardware capability detection
- Device type identification

**Quick Usage:**
```typescript
import { ExpoDeviceInfo, useDeviceInfo } from '@htk/features/expo/deviceInfo';

// Display full UI
<ExpoDeviceInfo />

// Programmatic access
const device = useDeviceInfo();
console.log(device.modelName, device.osVersion);
```

## Architecture

```typescript
expo/
├── deviceInfo/ # Device information module
│ ├── index.tsx # Main exports
│ ├── constants.ts # Field definitions
│ ├── enums.ts # Type enumerations
│ ├── hooks.ts # Hooks
│ └── README.md # Documentation
└── README.md # This file
```

## Use Cases

1. **Debug Screens** - Display device info for troubleshooting
2. **Analytics** - Track device capabilities and versions
3. **Feature Flags** - Enable/disable features based on device
4. **Performance Tuning** - Adjust rendering based on device specs
5. **Error Reports** - Include device context in crash reports
6. **Compatibility** - Detect platform-specific behavior

## Integration with Other Features

### With Error Tracking (Rollbar)
```typescript
import { useDeviceInfo } from '@htk/features/expo/deviceInfo';
import { rollbar } from '@htk/utils/rollbar';

function useErrorTracking() {
  const device = useDeviceInfo();

  return (error: Error) => {
    rollbar.error(error, {
        device: {
          platform: device.platform,
          osVersion: device.osVersion,
          modelName: device.modelName
        }
    });
};

}
```

### With App Settings
```typescript
import { useDeviceInfo } from '@htk/features/expo/deviceInfo';
import { useAppSettings } from '@htk/features/appSettings';

function useAdaptiveUI() {
  const device = useDeviceInfo();
  const settings = useAppSettings();

  return {
    isTablet: device.isTablet,
    fontSize: settings.fontSize,
    columns: device.isTablet ? 2 : 1
  };

}
```

## API Overview

### Components

#### ExpoDeviceInfo
Main component for displaying device information.

```typescript
<ExpoDeviceInfo />
```

### Hooks

#### useDeviceInfo()
Access device information programmatically.

```typescript
const device = useDeviceInfo();
// Returns: {
  // manufacturer: string;
  // modelName: string;
  // platform: 'ios' 'android' 'web';
  // osVersion: string;
  // // ... more properties
  // }
```

## Performance Considerations

- Device info retrieved once on component mount
- No real-time updates needed
- Safe to cache results
- Minimal performance impact

## Best Practices

 **Do:**
- Use for feature detection
- Include in error reports
- Adapt UI based on device type
- Cache device info when possible

 **Don't:**
- Poll device info repeatedly
- Overuse in frequent updates
- Store device info server-side without consent
- Make assumptions about capabilities

### Child Modules
- **Device Info**: [`deviceInfo/README.md`](deviceInfo/README.md) - Device information

### Related Features
- **Theme**: [`../theme/README.md`](../theme/README.md) - Theme system
- **App Settings**: [`../appSettings/README.md`](../appSettings/README.md) - Settings management

### Utilities
- **Rollbar**: [`../../utils/rollbar/`](../../utils/rollbar/) - Error tracking integration
- **Geolocation**: [`../../utils/geolocations/`](../../utils/geolocations/) - Location utilities

## Future Modules

Potential additions:
- **Permissions** - Permission handling
- **Analytics** - Built-in analytics integration
- **Notifications** - Notification management
- **FileSystem** - File system access
- **MediaLibrary** - Photo/video access

## Testing

```typescript
import { render } from '@testing-library/react-native';
import { ExpoDeviceInfo } from '@htk/features/expo/deviceInfo';

test('renders device info', () => {
    const { getByText } = render(<ExpoDeviceInfo />);
  expect(getByText(/device/i)).toBeTruthy();
});
```

## Troubleshooting

### Device Info Not Available
- Verify Expo modules are installed
- Check device permissions
- Ensure app has necessary capabilities

### Performance Issues
- Cache device info at app level
- Don't call useDeviceInfo in render loops
- Consider memoization for derived values

## Version Compatibility
- React Native: 0.60+
- Expo: SDK 40+
