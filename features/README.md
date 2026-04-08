# Features

## Overview
Higher-level feature modules combining components, state management, and business logic. Each feature provides complete functionality for specific app domains.

## Location
`features/`

## Purpose
Provides:
- Complete feature implementations
- Integrated state and UI
- Business logic encapsulation
- Reusable feature patterns
- Domain-specific functionality

## Available Features

### App Settings
Complete settings management system with UI and persistence.

**Location:** [`appSettings/README.md`](appSettings/README.md)

**Provides:**
- `createAppSettings()` - Factory for creating settings systems
- Type-safe settings management
- Automatic persistence (MMKV/localStorage)
- Built-in settings UI components

**Usage:**
```typescript
import { createAppSettings } from '@htk/features/appSettings';

const { useAppSettings, updateAppSetting } = createAppSettings({
    darkMode: false,
    fontSize: 16
  });
```

### Theme System
Comprehensive theme management with light/dark mode support.

**Location:** [`theme/README.md`](theme/README.md)

**Provides:**
- `createTheme()` - Complete theme system factory
- Light and dark mode support
- System theme detection
- Persistent preferences
- React Navigation integration

**Usage:**
```typescript
import { createTheme } from '@htk/features/theme';

const { ThemeProvider, useThemeScheme, useChangeTheme } = createTheme({
    enabled: true,
    ignoreSystemMode: false,
    supportDarkMode: true,
    defaultScheme: 'light',
    schemes: { light: {...}, dark: {...} }
  });
```

### Expo Features
Expo-specific functionality and integrations.

**Location:** [`expo/README.md`](expo/README.md)

**Includes:**
- **Device Info** - Device specifications and capabilities
- Platform-specific information
- Feature detection

**Usage:**
```typescript
import { useDeviceInfo, ExpoDeviceInfo } from '@htk/features/expo/deviceInfo';

const device = useDeviceInfo();
<ExpoDeviceInfo />
```

## Architecture

```text
features/
├── appSettings/ # Settings management
│ ├── index.ts # Main API
│ ├── types.ts # Type definitions
│ ├── components/ # UI components
│ └── README.md # Documentation
├── theme/ # Theme system
│ ├── index.tsx # Main API
│ ├── types.ts # Type definitions
│ ├── utils.ts # Utilities
│ ├── components/ # UI components
│ └── README.md # Documentation
├── expo/ # Expo integration
│ ├── deviceInfo/ # Device information
│ └── README.md # Documentation
└── README.md # This file
```typescript

## Feature Development Pattern

When creating new features:

### 1. Define Core API
```typescript
// features/myFeature/index.ts
export function createMyFeature(options: Options) {
  // Create and return hooks, components, state
  return {
    MyProvider,
    useMyFeature,
    updateMyFeature
  };

}
```typescript

### 2. Create Components
```typescript
// features/myFeature/components/
export function MyComponent(props: MyComponentProps) {
  // Component implementation

}
```typescript

### 3. Add Type Definitions
```typescript
// features/myFeature/types.ts
export interface MyFeatureState {
  // State shape

}
export interface MyFeatureOptions {
  // Configuration options

}
```typescript

### 4. Provide Documentation
```markdown
# My Feature

## Overview
Description of feature

## Usage
Code examples

## API
Complete API documentation
```typescript

## Integration Patterns

### With Persisted State
```typescript
import { createPersistedState } from '@htk/states';

export function createMyFeature(initial: State) {
  const persistedAtom = createPersistedState();
  const atom = persistedAtom('myFeature', initial);

  return {
    useFeature: () => useAtomValue(atom),
    updateFeature: () => useSetAtom(atom)
  };

}
```typescript

### With Theme System
```typescript
import { useThemeScheme } from '@htk/features/theme';

function ThemedFeature() {
  const scheme = useThemeScheme();

  return (
    <View style={{
        backgroundColor: scheme === 'dark' ? '#000' : '#fff'
      }}>
  {/* Feature content */}
    </View>
  );

}
```typescript

### With App Settings
```typescript
import { useAppSettings } from '@htk/features/appSettings';

function SettingsAwareFeature() {
  const settings = useAppSettings();

  return (
    <Text style={{ fontSize: settings.fontSize }}>
      Settings-aware text
    </Text>
  );

}
```typescript

## Best Practices

 **Do:**
- Create factory functions for feature creation
- Provide hooks for accessing state
- Integrate with persistence system
- Include complete UI components
- Provide comprehensive documentation
- Support theming and customization
- Handle edge cases and errors

 **Don't:**
- Mix multiple features in single module
- Hard-code configuration
- Skip documentation
- Create tight coupling between features
- Ignore TypeScript types
- Forget error handling
- Use unsafe state mutations

## Feature Composition

Features can be composed together:

```typescript
import { createAppSettings } from '@htk/features/appSettings';
import { createTheme } from '@htk/features/theme';

function App() {
  const { AppSettingsProvider } = createAppSettings({...});
  const { ThemeProvider } = createTheme({...});

  return (
    <AppSettingsProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </AppSettingsProvider>
  );

}
```typescript

## Feature Communication

Features can communicate through:

### Shared State
```typescript
import { useAppSettings } from '@htk/features/appSettings';

function SettingsConsumer() {
  const settings = useAppSettings();
  // Use settings

}
```typescript

### Observer Pattern
```typescript
import { Observer } from '@htk/utils/observer';

const featureObserver = new Observer<FeatureEvent>();
```typescript

### Context
```typescript
import { contextBuilder } from '@htk/utils/react';

const [Provider, useContext] = contextBuilder(initialState);
```typescript

## Testing Features

```typescript
import { createAppSettings } from '@htk/features/appSettings';

describe('appSettings', () => {
    it('creates settings with defaults', () => {
        const { useAppSettings } = createAppSettings({
            count: 0
          });

      // Test initial state
      const settings = useAppSettings();
      expect(settings.count).toBe(0);
    });

it('updates settings', () => {
    const { useAppSettings, updateAppSetting } = createAppSettings({
        count: 0
      });

  const update = updateAppSetting();
  update('count', 1);

  const settings = useAppSettings();
  expect(settings.count).toBe(1);
});
});
```

## Performance Considerations

- Use memoization for expensive operations
- Lazy-load features when possible
- Minimize re-renders through context splitting
- Cache computed values
- Use selective subscriptions

### Child Features
- **App Settings**: [`appSettings/README.md`](appSettings/README.md)
- **Theme System**: [`theme/README.md`](theme/README.md)
- **Expo Features**: [`expo/README.md`](expo/README.md)

### Core Systems
- **Components**: [`../components/README.md`](../components/README.md) - UI components
- **States**: [`../states/README.md`](../states/README.md) - State management
- **Storage**: [`../storages/README.md`](../storages/README.md) - Persistence
- **Utils**: [`../utils/README.md`](../utils/README.md) - Utilities

## Future Features

Potential additions:
- **Authentication** - User auth and sessions
- **Notifications** - Push and local notifications
- **Analytics** - Event tracking and analytics
- **Permissions** - App permissions management
- **Connectivity** - Network state management
- **Offline** - Offline-first functionality

## Contributing

When adding features:
1. Follow factory function pattern
2. Provide comprehensive documentation
3. Include example usage
4. Add TypeScript types
5. Integrate with existing systems
6. Support theming
7. Write tests

## Version Compatibility
- React Native: 0.60+
- Expo: SDK 40+
- TypeScript: 4.0+
