# Theme Components

## Overview
UI components for the theme system feature. Provides reusable React Native components for theme selection and management with visual feedback and seamless integration with the theme system.

## Location
`features/theme/components/`

## Purpose
Offers components for:
- Displaying theme selection options
- Providing visual theme previews
- Managing theme switching UI
- Integrating with the theme system
- Building theme settings interfaces

## Component Hierarchy

```typescript
Theme Components
├── ThemeSettingsButton (Individual theme option)
└── README.md (This file)
```

## Files Included

| File | Purpose |
|------|---------|
| `index.ts` | Component exports |
| `ThemeSettingsButton.tsx` | Theme selection button component |
| `README.md` | This file |

## Main Components

### ThemeSettingsButton Component
A circular button component for selecting and displaying theme options with active state indication.

**Location:** `ThemeSettingsButton.tsx`

**Props:**
```typescript
interface ThemeSettingsButtonProps {
  name: 'light' | 'dark';              // Theme name
  theme: typeof DesignTokens;          // react-native-ui-lib design tokens
  isActive: boolean;                   // Whether this theme is currently active
  onPress: (theme: 'light' | 'dark') => void; // Callback when pressed
}
```

**Features:**
- Circular button design (70x70pt)
- Active state with 4pt border
- Theme-aware colors using design tokens
- Touch feedback with onPress callback
- Centered layout with react-native-ui-lib
- Seamless theme integration

**Styling:**
- Width: 70pt
- Height: 70pt
- Border width: 1pt (default), 4pt (active)
- Border color: Neutral idle from theme
- Background: Default theme background
- Text color: Default theme text color

## Usage Examples

### Basic Theme Selection
```typescript
import { ThemeSettingsButton } from '@htk/features/theme/components';
import { useThemeScheme, useChangeTheme } from '@htk/features/theme';
import { View } from 'react-native-ui-lib';

function ThemeSelector() {
  const scheme = useThemeScheme();
  const changeTheme = useChangeTheme();

  return (
    <View row centerH gap-16>
      <ThemeSettingsButton
        name="light"
        isActive={scheme === 'light'}
        onPress={changeTheme}
        theme={useTheme()} // Design tokens from ui-lib
      />
    <ThemeSettingsButton
      name="dark"
      isActive={scheme === 'dark'}
      onPress={changeTheme}
      theme={useTheme()} // Design tokens from ui-lib
    />
    </View>
);
}
```

### In Settings Screen
```typescript
import { ThemeSettingsButton } from '@htk/features/theme/components';
import { useThemeScheme, useChangeTheme } from '@htk/features/theme';
import { ScrollView, View, Text } from 'react-native-ui-lib';

function SettingsScreen() {
  const scheme = useThemeScheme();
  const changeTheme = useChangeTheme();
  const tokens = useTheme(); // Get design tokens

  return (
    <ScrollView>
      <View padding-16>
        <Text text70 marginB-16>Display Settings</Text>

        <Text text80 marginB-12>Theme</Text>
        <View row centerH gap-16 marginB-32>
          <ThemeSettingsButton
            name="light"
            isActive={scheme === 'light'}
            onPress={changeTheme}
            theme={tokens}
          />
        <ThemeSettingsButton
          name="dark"
          isActive={scheme === 'dark'}
          onPress={changeTheme}
          theme={tokens}
        />
        </View>
        </View>
    </ScrollView>
);
}
```

### Horizontal Theme Selector
```typescript
import { ThemeSettingsButton } from '@htk/features/theme/components';
import { useThemeScheme, useChangeTheme } from '@htk/features/theme';
import { View } from 'react-native-ui-lib';

function HorizontalThemeSelector() {
  const scheme = useThemeScheme();
  const changeTheme = useChangeTheme();
  const tokens = useTheme();

  return (
    <View row centerH gap-24 padding-16>
      {(['light', 'dark'] as const).map((themeName) => (
            <ThemeSettingsButton
              key={themeName}
              name={themeName}
              isActive={scheme === themeName}
              onPress={changeTheme}
              theme={tokens}
            />
        ))}
    </View>
);
}
```

### Dynamic Theme Button with Label
```typescript
import { ThemeSettingsButton } from '@htk/features/theme/components';
import { useThemeScheme, useChangeTheme } from '@htk/features/theme';
import { View, Text } from 'react-native-ui-lib';

function LabeledThemeButton() {
  const scheme = useThemeScheme();
  const changeTheme = useChangeTheme();
  const tokens = useTheme();

  return (
    <View gap-8>
      <View gap-8>
        <Text text80>Light Mode</Text>
        <ThemeSettingsButton
          name="light"
          isActive={scheme === 'light'}
          onPress={changeTheme}
          theme={tokens}
        />
      </View>

  <View gap-8>
    <Text text80>Dark Mode</Text>
    <ThemeSettingsButton
      name="dark"
      isActive={scheme === 'dark'}
      onPress={changeTheme}
      theme={tokens}
    />
  </View>
  </View>
);
}
```

## Integration with Theme System

These components work seamlessly with the main theme system:

```typescript
import { createTheme } from '@htk/features/theme';
import { ThemeSettingsButton } from '@htk/features/theme/components';

const { ThemeProvider, useThemeScheme, useChangeTheme } = createTheme({
    enabled: true,
    supportDarkMode: true,
    defaultScheme: 'light',
    schemes: {
      light: { /* colors */ },
      dark: { /* colors */ }
    }
});

// Use in component
function AppHeader() {
  const scheme = useThemeScheme();
  const changeTheme = useChangeTheme();

  return (
    <View>
      <ThemeSettingsButton
        name={scheme === 'light' ? 'dark' : 'light'}
        isActive={false}
        onPress={changeTheme}
        theme={useTheme()}
      />
    </View>
);
}
```

## Styling & Theming

All components use `react-native-ui-lib` design tokens:
- **Colors**: Theme-aware color palette (background, text, neutral)
- **Spacing**: Built-in gaps and padding using react-native-ui-lib
- **Typography**: Text styling from design tokens
- **Adaptive**: Automatically responds to light/dark mode changes

```typescript
import { View, Text, Colors } from 'react-native-ui-lib';

function ThemedButton() {
  return (
    <View
      padding-16
      backgroundColor={Colors.$backgroundColor}
  >
  <Text color={Colors.$textDefault}>Theme Aware</Text>
    </View>
);
}
```

## Accessibility Features

Components support:
- **Labels**: Descriptive text labels for theme options
- **Touch Targets**: 70x70pt minimum touch area (exceeds 44x44pt minimum)
- **Contrast**: High contrast colors using design tokens
- **Visual Feedback**: Active state clearly indicated with border
- **Keyboard Navigation**: Proper keyboard support through TouchableOpacity

## Performance Considerations

- **Memoization**: Components memoized to prevent unnecessary re-renders
- **Efficient Updates**: Only affected components re-render on theme change
- **Minimal Dependencies**: Lightweight component with minimal prop dependencies
- **Design Token Caching**: Design tokens cached from react-native-ui-lib

### Optimization Example
```typescript
import { useMemo } from 'react';
import { ThemeSettingsButton } from '@htk/features/theme/components';

function OptimizedThemeSelector() {
  const scheme = useThemeScheme();
  const changeTheme = useChangeTheme();
  const tokens = useTheme();

  const buttons = useMemo(() => (
      ['light', 'dark'].map((name) => ({
            name,
            isActive: scheme === name
          }))
  ), [scheme]);

return (
  <View row centerH gap-16>
    {buttons.map((btn) => (
          <ThemeSettingsButton
            key={btn.name}
            name={btn.name as 'light' | 'dark'}
            isActive={btn.isActive}
            onPress={changeTheme}
            theme={tokens}
          />
      ))}
  </View>
);
}
```

## Best Practices

**Do:**
- Use with the theme system provider
- Provide clear visual feedback for active state
- Include labels for theme options
- Organize buttons in intuitive layouts
- Test both light and dark themes
- Respect user theme preferences
- Group theme selection logically

**Don't:**
- Mix theme buttons with other unrelated controls
- Hard-code colors instead of using design tokens
- Skip the active state indicator
- Use confusing theme names
- Place theme selection in obscure locations
- Forget to handle theme persistence
- Ignore accessibility standards

## Component Development

When creating additional theme components:

1. **Use Design Tokens**
   ```typescript
import { DesignTokens } from 'react-native-ui-lib';

interface CustomThemeComponentProps {
  theme: typeof DesignTokens;
  isActive: boolean;
}
```

2. **Support Theme Integration**
   ```typescript
import { useThemeScheme, useChangeTheme } from '@htk/features/theme';

function CustomThemeComponent() {
  const scheme = useThemeScheme();
  const changeTheme = useChangeTheme();
  // Implementation...
}
```

3. **Export from Index**
   ```typescript
// components/index.ts
export { CustomThemeComponent } from './CustomThemeComponent';
```

## Related Documentation

### Parent
- **Theme Feature**: [`../README.md`](../README.md) - Theme system overview

### Related Features
- **App Settings Components**: [`../../appSettings/components/README.md`](../../appSettings/components/README.md) - Settings UI components
- **Theme System**: [`../README.md`](../README.md) - Core theme functionality
- **Theme Utilities**: [`../../utils/theme/README.md`](../../utils/theme/README.md) - Styling helpers

### Dependencies
- **react-native-ui-lib**: Design tokens and components

## Testing Examples

### Component Testing
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeSettingsButton } from '@htk/features/theme/components';

test('renders theme button', () => {
    const mockTheme = { $backgroundColor: '#FFF', $textDefault: '#000' };
    const onPress = jest.fn();

    const { getByText } = render(
      <ThemeSettingsButton
        name="light"
        isActive={true}
        onPress={onPress}
        theme={mockTheme}
      />
  );

expect(getByText('light')).toBeTruthy();
});

test('calls onPress with theme name', () => {
    const mockTheme = { $backgroundColor: '#FFF', $textDefault: '#000' };
    const onPress = jest.fn();

    const { getByText } = render(
      <ThemeSettingsButton
        name="dark"
        isActive={false}
        onPress={onPress}
        theme={mockTheme}
      />
  );

fireEvent.press(getByText('dark'));
expect(onPress).toHaveBeenCalledWith('dark');
});

test('shows active state styling', () => {
    const mockTheme = { $backgroundColor: '#FFF', $textDefault: '#000' };
    const onPress = jest.fn();

    const { getByTestId } = render(
      <ThemeSettingsButton
        name="light"
        isActive={true}
        onPress={onPress}
        theme={mockTheme}
        testID="theme-button"
      />
  );

const button = getByTestId('theme-button');
// Assert active state styling
});
```

## Troubleshooting

### Button Not Responding
- Verify onPress callback is provided
- Check theme tokens are correctly passed
- Ensure component is not disabled

### Styling Issues
- Verify react-native-ui-lib is properly configured
- Check design tokens are available
- Ensure theme provider wraps component tree
- Validate token names match design system

### Active State Not Showing
- Verify isActive prop is updated correctly
- Check that useThemeScheme hook is working
- Ensure comparison logic is correct (string comparison)

### Theme Not Persisting
- Verify theme system persistence is enabled
- Check storage permissions
- Ensure useChangeTheme is properly integrated

## Version Compatibility
- React Native: 0.60+
- Expo: SDK 40+
- react-native-ui-lib: Latest stable
- TypeScript: 4.0+

## Future Enhancements
- Theme preview cards
- Color palette pickers
- System theme detection UI
- Theme customization interface
- Theme preview animations
- Accessibility theme mode (high contrast)
