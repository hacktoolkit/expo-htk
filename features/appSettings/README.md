# App Settings Feature

## Overview
A comprehensive settings management system for Expo/React Native applications. Handles persisted user preferences with automatic storage, type-safe state management, and reusable UI components.

## Location
`features/appSettings/`

## Purpose
Provides a complete settings solution with:
- Persistent state management using Jotai + MMKV
- Type-safe settings definition and access
- Reusable UI components for settings screens
- Automatic serialization and storage
- Platform-aware storage (mobile & web)

## Architecture

```typescript
appSettings/
├── index.ts # Main API (createAppSettings)
├── types.ts # TypeScript type definitions
├── components/ # UI components
│ ├── index.ts # Component exports
│ ├── AppSettings.tsx # Main settings display
│ ├── Container.tsx # Container wrapper
│ └── Entries/ # Entry type components
└── README.md # This file
```

## Core API

### createAppSettings()
Factory function that creates a complete settings system.

```typescript
function createAppSettings<TSettings extends Record<string, any>>(
    initial: TSettings
  ): {
  atom: Atom<TSettings>;
    useAppSettings: () => TSettings & { dispatch: UpdateFunction };
    updateAppSetting: () => (field: keyof TSettings, value: any) => void;
  }
```

**Parameters:**
- `initial`: Default settings object

**Returns:**
- `atom`: Jotai atom for direct state access
- `useAppSettings`: Hook to access settings in components
- `updateAppSetting`: Function to update individual settings

## Quick Start

### 1. Create Settings System
```typescript
import { createAppSettings } from '@htk/features/appSettings';

// Define initial settings
const initialSettings = {
  darkMode: false,
  fontSize: 16,
  fontFamily: 'System',
  notificationsEnabled: true,
  language: 'en'
};

// Create settings system
const { useAppSettings, updateAppSetting } = createAppSettings(initialSettings);

// Export for use throughout app
export { useAppSettings, updateAppSetting };
```

### 2. Use in Components
```typescript
import { useAppSettings, updateAppSetting } from '@/settings';

function SettingsScreen() {
  const settings = useAppSettings();
  const updateSetting = updateAppSetting();

  return (
    <View>
      <Switch
        value={settings.darkMode}
        onValueChange={(val) => updateSetting('darkMode', val)}
      />
    </View>
  );

}
```

### 3. Persist Automatically
Settings are automatically saved to device storage (MMKV or localStorage) and restored on app restart.

## Usage Examples

### Basic Settings Management
```typescript
import { createAppSettings } from '@htk/features/appSettings';

type AppSettings = {
  theme: 'light' 'dark';
  fontSize: number;
  language: string;
};

const { useAppSettings, updateAppSetting } = createAppSettings<AppSettings>({
      theme: 'light',
      fontSize: 16,
      language: 'en'
    });

function App() {
  const settings = useAppSettings();

  return (
    <View style={{
        backgroundColor: settings.theme === 'dark' ? '#000' : '#fff'
      }}>
  {/* App content */}
    </View>
  );

}
```

### Settings Screen with Components
```typescript
import { AppSettings } from '@htk/features/appSettings/components';
import { useAppSettings, updateAppSetting } from '@/settings';

function SettingsScreen() {
  const settings = useAppSettings();
  const updateSetting = updateAppSetting();

  const entries = [
    {
      type: 'switch',
      key: 'darkMode',
      label: 'Dark Mode',
      defaultValue: settings.darkMode
    },
  {
    type: 'fontFamily',
    key: 'fontFamily',
    label: 'Font Family',
    defaultValue: settings.fontFamily
  },
{
  type: 'fontSize',
  key: 'fontSize',
  label: 'Font Size',
  defaultValue: settings.fontSize

}];

return (
  <AppSettings
    entries={entries}
    onSettingChange={(key, value) => {
    updateSetting(key as any, value);
    }}
  />
  );

}
```

### Type-Safe Settings
```typescript
import { createAppSettings } from '@htk/features/appSettings';

interface UserPreferences {
  colorScheme: 'light' 'dark' 'auto';
  fontSize: 'small' 'medium' 'large';
  reducedMotion: boolean;
  highContrast: boolean;

}
const { useAppSettings, updateAppSetting } = createAppSettings<UserPreferences>({
      colorScheme: 'auto',
      fontSize: 'medium',
      reducedMotion: false,
      highContrast: false
    });

function AccessibilitySettings() {
  const prefs = useAppSettings();
  const update = updateAppSetting();

  return (
    <View>
      {/* All property accesses are type-checked */}
      <Toggle
        value={prefs.reducedMotion} // Type-safe
        onChange={(val) => update('reducedMotion', val)}
      />
    </View>
  );

}
```

### Settings with Validation
```typescript
import { createAppSettings } from '@htk/features/appSettings';

const { useAppSettings, updateAppSetting } = createAppSettings({
    fontSize: 16
  });

function FontSizeControl() {
  const settings = useAppSettings();
  const updateSetting = updateAppSetting();

  const handleFontSizeChange = (size: number) => {
    // Validate before updating
    if (size >= 12 && size <= 32) {
      updateSetting('fontSize', size);
    }
};

return (
  <Slider
    value={settings.fontSize}
    onValueChange={handleFontSizeChange}
    minimumValue={12}
    maximumValue={32}
  />
  );

}
```

### Reactive Settings Updates
```typescript
import { useAppSettings, updateAppSetting } from '@/settings';
import { useEffect } from 'react';

function ThemedComponent() {
  const settings = useAppSettings();
  const updateSetting = updateAppSetting();

  // Respond to setting changes
  useEffect(() => {
      console.log('Theme changed to:', settings.darkMode);
    }, [settings.darkMode]);

return (
  <View style={{
      backgroundColor: settings.darkMode ? '#000' : '#fff'
    }}>
{/* Component updates automatically when settings change */}
  </View>
  );

}
```

### Settings with Derived Values
```typescript
import { useAppSettings } from '@/settings';
import { useMemo } from 'react';

function ResponsiveText() {
  const settings = useAppSettings();

  // Derive font size based on user preference
  const fontSize = useMemo(() => {
      const sizeMap = {
        'small': 12,
        'medium': 16,
        'large': 20
      };
    return sizeMap[settings.fontSize as keyof typeof sizeMap];
  }, [settings.fontSize]);

return <Text style={{ fontSize }}>Responsive Text</Text>;

}
```

## Child Components

### Components
UI components for rendering settings screens.

**Location:** [`components/README.md`](components/README.md)

**Included Components:**
- **AppSettings** - Main settings display component
- **Container** - Container wrapper for settings
- **Entries** - Individual entry type components
 - Switch - Boolean toggle
 - FontFamily - Font selection
 - FontSize - Font size adjustment
 - Base - Custom entry foundation

**Usage:**
```typescript
import { AppSettings } from '@htk/features/appSettings/components';

<AppSettings
  entries={settingsDefinitions}
  onSettingChange={handleChange}
/>
```

## Type Definitions

### SettingsEntry
Configuration for individual settings entries in UI.

```typescript
interface SettingsEntry {
  type: string; // Entry component type
  key: string; // Settings property key
  label: string; // Display label
  description?: string; // Help text
  defaultValue?: any; // Default value
  disabled?: boolean; // Disable entry
  validation?: (value: any) => boolean;

}
```

### Update Function
```typescript
type UpdateAppSetting = (
  field: string,
  value: any
) => void
```

## Integration with Other Features

### With Theme System
```typescript
import { createAppSettings } from '@htk/features/appSettings';
import { useTheme } from '@htk/features/theme';

const { useAppSettings } = createAppSettings({ isDarkMode: false });

function App() {
  const settings = useAppSettings();
  const { setTheme } = useTheme();

  useEffect(() => {
      setTheme(settings.isDarkMode ? 'dark' : 'light');
    }, [settings.isDarkMode]);

return <MainApp />;

}
```

### With Persisted State (Jotai)
```typescript
import { useAppSettings } from '@/settings';
import { useAtomValue } from 'jotai/react';

// Settings automatically persist via Jotai + MMKV/localStorage
function App() {
  const settings = useAppSettings();
  // Settings survive app restart automatically

}
```

## Storage & Persistence

### Automatic Persistence
- **Mobile**: Uses MMKV for fast, encrypted storage
- **Web**: Uses localStorage for persistent storage
- **Automatic**: No manual save calls needed
- **Type Safe**: Full TypeScript support

### Data Serialization
```typescript
// Settings are automatically serialized/deserialized
const settings = {
  darkMode: true, // JSON-serializable
  fontSize: 16, // Numbers stored directly
  language: 'en', // Strings supported
  nested: { key: 'val' } // Objects supported
};
```

## Performance Considerations

- **Memoization**: Use useAppSettings efficiently
- **Selective Updates**: Only affected components re-render
- **Lazy Loading**: Settings loaded on demand
- **Storage Access**: Async-safe operations

### Optimization
```typescript
import { useMemo } from 'react';

function OptimizedComponent() {
  const settings = useAppSettings();

  // Memoize derived values
  const isDark = useMemo(
    () => settings.theme === 'dark',
    [settings.theme]
  );

return <Component isDark={isDark} />;

}
```

## Best Practices

 **Do:**
- Define settings at app initialization
- Use TypeScript for type safety
- Keep settings serializable
- Validate user input
- Document setting meanings
- Use meaningful default values
- Organize settings logically

 **Don't:**
- Store functions in settings
- Use circular references
- Store sensitive data unencrypted
- Update settings too frequently
- Put complex logic in settings
- Assume setting presence without checks

## Error Handling

### Safe Settings Access
```typescript
function Component() {
  const settings = useAppSettings();

  // Always have defaults from initialization
  const fontSize = settings.fontSize ?? 16; // Fallback if undefined

  return <Text style={{ fontSize }}>Text</Text>;

}
```

### Handling Errors
```typescript
function Component() {
  const settings = useAppSettings();
  const updateSetting = updateAppSetting();

  const handleUpdate = (key: string, value: any) => {
    try {
      // Validate before updating
      if (validateSetting(key, value)) {
        updateSetting(key as any, value);
      }
  } catch (error) {
  console.error('Failed to update setting:', error);

}};

return <View>{/* ... */}</View>;

}
```

## Advanced Patterns

### Settings Context
```typescript
import { createAppSettings } from '@htk/features/appSettings';
import { createContext, useContext, ReactNode } from 'react';

const settingsSystem = createAppSettings({ /* ... */ });

const SettingsContext = createContext(settingsSystem);

export function SettingsProvider({ children }: { children: ReactNode }) {
  return (
    <SettingsContext.Provider value={settingsSystem}>
      {children}
    </SettingsContext.Provider>
  );

}
export function useSettings() {
  return useContext(SettingsContext);

}
```

### Settings Presets
```typescript
const lightThemePreset = {
  darkMode: false,
  accentColor: '#007AFF',
  fontSize: 16
};

const darkThemePreset = {
  darkMode: true,
  accentColor: '#00C7FF',
  fontSize: 16
};

function ApplyPreset(preset: typeof lightThemePreset) {
  const update = updateAppSetting();
  Object.entries(preset).forEach(([key, value]) => {
      update(key as any, value);
    });

}
```

### Child Components
- **Components**: [`components/README.md`](components/README.md) - UI components for settings
- **Entry Types**: [`components/Entries/README.md`](components/Entries/README.md) - Individual entry components

### Related Features
- **Theme System**: [`../theme/README.md`](../theme/README.md) - Theme management
- **Persisted State**: [`../../states/README.md`](../../states/README.md) - State management with Jotai
- **Storage**: [`../../storages/README.md`](../../storages/README.md) - Storage adapters

### Utilities
- **React Context**: [`../../utils/react/README.md`](../../utils/react/README.md) - Context pattern utilities

## Testing

### Testing Settings
```typescript
import { createAppSettings } from '@htk/features/appSettings';

describe('appSettings', () => {
    it('creates settings with defaults', () => {
        const { useAppSettings } = createAppSettings({
            darkMode: false,
            fontSize: 16
          });

      // Test initial state
      expect(settings).toEqual({
          darkMode: false,
          fontSize: 16
        });
  });

it('updates settings', () => {
    const { useAppSettings, updateAppSetting } = createAppSettings({
        counter: 0
      });

  const update = updateAppSetting();
  update('counter', 1);

  const settings = useAppSettings();
  expect(settings.counter).toBe(1);
});
});
```

## Troubleshooting

### Settings Not Persisting
- Verify storage adapter is configured
- Check storage permissions
- Ensure settings are JSON-serializable
- Look for storage quota errors

### Settings Not Updating in Components
- Verify useAppSettings hook is called
- Check that updateAppSetting is called correctly
- Ensure component re-renders on settings change
- Check for typos in setting keys

### Type Errors
- Verify TSettings generic parameter matches settings shape
- Check that all keys are defined in initial settings
- Ensure no circular type references

## Version Compatibility
- React Native: 0.60+
- Expo: SDK 40+
- Jotai: Latest stable
- React Native MMKV: 2.0+
