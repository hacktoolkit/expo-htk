# Theme System Feature

## Overview
A comprehensive theme management system for Expo/React Native applications. Provides light/dark mode support, system theme detection, color customization, and persistent theme preferences.

## Location
`features/theme/`

## Purpose
Enables complete theme management with:
- Light and dark mode support
- System theme detection and override
- Color and spacing customization
- Component default styling
- Persistent theme preferences (MMKV/localStorage)
- React Navigation integration
- Built-in theme settings UI

## Architecture

```text
theme/
├── index.tsx # Main API (createTheme)
├── types.ts # TypeScript definitions
├── utils.ts # Theme utility functions
├── components/
│ ├── ThemeSettingsButton.tsx # Theme selection button
│ └── README.md # Components documentation
└── README.md # This file
```typescript

## Core API

### createTheme()
Factory function that creates a complete theme system.

```typescript
function createTheme(options: CreateThemeOptions): {
  ThemeProvider: React.FC<{ children: ReactNode }>;
  useChangeTheme: () => (scheme: 'light' 'dark') => void;
  useThemeScheme: () => 'light' 'dark';
  useIgnoreSystemMode: () => boolean;
  ThemeSettings: React.FC;

}
```typescript

**Parameters:**
```typescript
interface CreateThemeOptions {
  enabled: boolean; // Enable theme system
  ignoreSystemMode: boolean; // Override system theme
  supportDarkMode: boolean; // Enable dark mode support
  defaultScheme: 'light' 'dark'; // Default theme
  schemes: { // Color schemes
    light: SchemeColors;
    dark: SchemeColors;
  };
colors?: Record<string, string>; // Additional colors
spacings?: Record<string, number>; // Custom spacings
componentDefaults?: { // Component styling
  Text?: Record<string, any>;
  View?: Record<string, any>;
  Button?: Record<string, any>;
};

}
```typescript

**Returns:**
- `ThemeProvider`: Provider component to wrap app
- `useChangeTheme`: Hook to change theme
- `useThemeScheme`: Hook to get current theme
- `useIgnoreSystemMode`: Hook to check system override
- `ThemeSettings`: Built-in settings UI component

## Quick Start

### 1. Define Theme Configuration
```typescript
import { createTheme } from '@htk/features/theme';

const { ThemeProvider, useThemeScheme, useChangeTheme, ThemeSettings } = createTheme({
    enabled: true,
    ignoreSystemMode: false,
    supportDarkMode: true,
    defaultScheme: 'light',
    schemes: {
      light: {
        primaryColor: '#007AFF',
        backgroundColor: '#FFFFFF',
        textColor: '#000000'
      },
    dark: {
      primaryColor: '#0A84FF',
      backgroundColor: '#000000',
      textColor: '#FFFFFF'
    }
},
colors: {
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500'

}});

export { ThemeProvider, useThemeScheme, useChangeTheme, ThemeSettings };
```typescript

### 2. Wrap App with Provider
```typescript
import { ThemeProvider } from '@/theme';

export function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );

}
```typescript

### 3. Use Theme in Components
```typescript
import { useThemeScheme, useChangeTheme } from '@/theme';

function ThemeToggle() {
  const scheme = useThemeScheme();
  const changeTheme = useChangeTheme();

  return (
    <Button
      title={`Current: ${scheme}`}
      onPress={() => changeTheme(scheme === 'light' ? 'dark' : 'light')}
    />
  );

}
```typescript

## Usage Examples

### Basic Theme Setup
```typescript
import { createTheme } from '@htk/features/theme';

const lightColors = {
  primary: '#007AFF',
  secondary: '#5AC8FA',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: '#000000',
  textSecondary: '#666666'
};

const darkColors = {
  primary: '#0A84FF',
  secondary: '#64B5F6',
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0'
};

const themeSystem = createTheme({
    enabled: true,
    ignoreSystemMode: false,
    supportDarkMode: true,
    defaultScheme: 'light',
    schemes: {
      light: lightColors,
      dark: darkColors
    }
});

export const { ThemeProvider, useThemeScheme, useChangeTheme } = themeSystem;
```typescript

### Responsive Components
```typescript
import { useThemeScheme } from '@/theme';
import { View, Text } from 'react-native';
import { Colors } from 'react-native-ui-lib';

function ResponsiveCard() {
  const scheme = useThemeScheme();

  return (
    <View style={{
        backgroundColor: scheme === 'dark' ? Colors.$backgroundDark : Colors.$backgroundLight,
        padding: 16,
        borderRadius: 8
      }}>
  <Text style={{
      color: scheme === 'dark' ? '#FFF' : '#000'
    }}>
This card adapts to theme
  </Text>
    </View>
  );

}
```typescript

### Theme Settings Integration
```typescript
import { ThemeSettings } from '@/theme';
import { ScrollView } from 'react-native';

function SettingsScreen() {
  return (
    <ScrollView>
      <Text style={styles.title}>Display Settings</Text>
      <ThemeSettings />
    {/* Other settings... */}
    </ScrollView>
  );

}
```typescript

### Custom Theme Toggle Button
```typescript
import { useThemeScheme, useChangeTheme } from '@/theme';
import { TouchableOpacity, Text } from 'react-native';

function ThemeToggleButton() {
  const scheme = useThemeScheme();
  const changeTheme = useChangeTheme();

  return (
    <TouchableOpacity
      onPress={() => changeTheme(scheme === 'light' ? 'dark' : 'light')}
      style={{
      padding: 12,
      backgroundColor: scheme === 'light' ? '#007AFF' : '#0A84FF',
      borderRadius: 8
      }}
>
<Text style={{ color: 'white' }}>
  {scheme === 'light' ? ' Dark Mode' : ' Light Mode'}
</Text>
    </TouchableOpacity>
  );

}
```typescript

### System Theme Respecting
```typescript
import { useIgnoreSystemMode, useChangeTheme } from '@/theme';

function AutoThemeComponent() {
  const ignoreSystemMode = useIgnoreSystemMode();

  // When ignoreSystemMode is false:
  // - Theme automatically follows device settings
  // - Changes to system settings update theme

  // When ignoreSystemMode is true:
  // - Manual theme selection overrides system
  // - Use changeTheme() to switch manually

  return (
    <Text>
      {ignoreSystemMode ? 'Manual Theme' : 'System Theme'}
    </Text>
  );

}
```typescript

### Custom Colors
```typescript
import { createTheme } from '@htk/features/theme';

const themeSystem = createTheme({
    enabled: true,
    ignoreSystemMode: false,
    supportDarkMode: true,
    defaultScheme: 'light',
    schemes: {
      light: { /* colors */ },
      dark: { /* colors */ }
    },
  // Add brand-specific colors
  colors: {
    brandPrimary: '#FF6B6B',
    brandSecondary: '#4ECDC4',
    success: '#51CF66',
    error: '#FF6B6B',
    warning: '#FFD93D'
  }
});
```typescript

### Component Defaults
```typescript
import { createTheme } from '@htk/features/theme';

const themeSystem = createTheme({
    enabled: true,
    ignoreSystemMode: false,
    supportDarkMode: true,
    defaultScheme: 'light',
    schemes: { /* ... */ },
    // Set default styles for components
    componentDefaults: {
      Text: {
        $text70: { fontSize: 18, fontWeight: '600' },
        $text80: { fontSize: 16, fontWeight: '500' }
      },
    Button: {
      backgroundColor: '#007AFF',
      borderRadius: 8
    },
  View: {
    padding: 16
  }

}});
```typescript

## Child Components

### ThemeSettingsButton
Button component for selecting themes in settings UI.

**Location:** [`components/README.md`](components/README.md)

**Features:**
- Visual theme preview
- Active state indication
- Integration with theme system

## Type Safety

```typescript
interface Scheme {
  name: string;
  isDark: boolean;
  colors: Record<string, string>;

}
```typescript

## Persistence

Theme preferences are automatically persisted:
- **Mobile**: MMKV storage
- **Web**: localStorage
- **Restored**: On app restart
- **Type Safe**: Full TypeScript support

### What Gets Persisted
```typescript
{
  ignoreSystemMode: boolean; // Whether to override system theme
  scheme: 'light' 'dark'; // Currently selected theme

}
```typescript

## Integration with React Navigation

The theme system automatically integrates with React Navigation:
- Navigation bars adapt to theme
- Status bar colors update
- Tab bar colors adjust
- All nav components themed

```typescript
function AppNavigator() {
  const { ThemeProvider } = useTheme();

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {/* Navigation screens */}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );

}
```typescript

## System Theme Detection

The theme system respects device settings:

```
Device Settings
↓
ignoreSystemMode: false
↓
Uses System Theme
↓
App Theme Updates
```typescript

When `ignoreSystemMode: true`:
```
Manual Selection
↓
useChangeTheme()
↓
Overrides System
↓
Persisted
```typescript

## Advanced Patterns

### Theme Context
```typescript
import { useThemeScheme, useChangeTheme } from '@/theme';

function useTheme() {
  const scheme = useThemeScheme();
  const changeTheme = useChangeTheme();

  return {
    isDark: scheme === 'dark',
    isLight: scheme === 'light',
    scheme,
    toggle: () => changeTheme(scheme === 'light' ? 'dark' : 'light')
  };

}
```typescript

### Conditional Rendering by Theme
```typescript
import { useThemeScheme } from '@/theme';

function AdaptiveComponent() {
  const scheme = useThemeScheme();

  return (
    <>
    {scheme === 'light' && <LightModeContent />}
  {scheme === 'dark' && <DarkModeContent />}
</>
  );

}
```typescript

### Theme Variants
```typescript
import { createTheme } from '@htk/features/theme';

const classicTheme = createTheme({
    /* classic theme config */
  });

const modernTheme = createTheme({
    /* modern theme config */
  });

export { classicTheme, modernTheme };
```typescript

## Performance Considerations

- **Minimal Overhead**: Theme changes only affect subscribed components
- **Memoization**: Built-in optimization for theme hooks
- **Persistence**: Async storage operations don't block UI
- **Efficient Updates**: Only affected components re-render

## Best Practices

 **Do:**
- Define complete color schemes
- Use theme consistently throughout app
- Provide system theme respecting option
- Include theme settings in app settings
- Use meaningful color names
- Test both light and dark modes
- Persist user preferences

 **Don't:**
- Hard-code colors in components
- Mix multiple theme systems
- Ignore system theme preferences
- Use low contrast color combinations
- Change theme too frequently
- Skip accessibility considerations
- Forget to include all states (active, disabled, etc.)

## Accessibility

All theme configurations should:
- **Contrast**: Meet WCAG AA contrast ratios
- **Readability**: Text remains readable in both modes
- **Indicators**: Don't rely only on color for indication
- **States**: Provide visual feedback for interactive elements

## Testing

### Testing Theme Changes
```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useThemeScheme, useChangeTheme } from '@/theme';

test('changes theme', () => {
    const { result } = renderHook(() => ({
          scheme: useThemeScheme(),
          change: useChangeTheme()
        }));

  expect(result.current.scheme).toBe('light');

  act(() => {
      result.current.change('dark');
    });

expect(result.current.scheme).toBe('dark');
});
```

### Child Components
- **Theme Components**: [`components/README.md`](components/README.md) - Theme UI components

### Related Features
- **App Settings**: [`../appSettings/README.md`](../appSettings/README.md) - Settings system
- **Persisted State**: [`../../states/README.md`](../../states/README.md) - State management
- **Storage**: [`../../storages/README.md`](../../storages/README.md) - Storage adapters

### Utilities
- **Theme Utilities**: [`../../utils/theme/README.md`](../../utils/theme/README.md) - Styling helpers

## Common Issues

### Theme Not Applying
- Ensure ThemeProvider wraps component tree
- Verify useThemeScheme is called in component
- Check theme configuration is complete

### System Theme Not Detected
- Verify `ignoreSystemMode: false`
- Check device system theme settings
- Ensure dark mode is supported in config

### Persistence Issues
- Check storage permissions
- Verify storage is initialized
- Clear app cache if issues persist

## Version Compatibility
- React Native: 0.60+
- Expo: SDK 40+
- react-native-ui-lib: Latest stable
- @react-navigation/native: 5.0+
