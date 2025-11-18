# App Settings Components

## Overview
UI components for the app settings feature. Provides reusable React Native components for building settings screens with type-safe entry management and consistent styling.

## Location
`features/appSettings/components/`

## Purpose
Offers components for:
- Rendering settings screens
- Displaying individual settings entries
- Managing user preferences
- Supporting different entry types
- Integrating with the theme system

## Component Hierarchy

```typescript
AppSettings (Main Component)
├── Container (Wrapper/Layout)
└── Entries/
├── Base (Foundation)
├── Switch (Boolean)
├── FontFamily (Selection)
└── FontSize (Numeric)
```

## Child Components

### Entries
Specialized entry components for different setting types.

**Location:** [`Entries/README.md`](Entries/README.md)

**Included Entry Types:**
- **Switch** - Boolean toggle settings
- **FontFamily** - Font selection picker
- **FontSize** - Font size adjustment
- **Base** - Foundation for custom entries

**Usage:**
```typescript
import { SwitchEntry, FontFamilyEntry, FontSizeEntry } from '@htk/features/appSettings/components/Entries';

<SwitchEntry
  label="Dark Mode"
  value={isDark}
  onChange={(val) => setIsDark(val)}
/>

<FontFamilyEntry
  label="Font Family"
  value={fontFamily}
  onChange={(val) => setFontFamily(val)}
/>

<FontSizeEntry
  label="Font Size"
  value={fontSize}
  onChange={(val) => setFontSize(val)}
/>
```

## Main Components

### AppSettings Component
The main settings display component that renders a list of configured settings entries.

```typescript
interface AppSettingsProps {
  entries: SettingsEntry[];
  onSettingChange: (key: string, value: any) => void;

}
```

**Usage:**
```typescript
import { AppSettings } from '@htk/features/appSettings/components';

function SettingsScreen() {
  const entries = [
    { type: 'switch', key: 'darkMode', label: 'Dark Mode' },
    { type: 'fontFamily', key: 'fontFamily', label: 'Font Family' },
    { type: 'fontSize', key: 'fontSize', label: 'Font Size' }
  ];

return (
  <AppSettings
    entries={entries}
    onSettingChange={(key, value) => {
    console.log(`${key}: ${value}`);
    }}
  />
  );

}
```

**Features:**
- Renders multiple entry types
- Manages entry state
- Handles value changes
- Theme-integrated styling
- Scrollable for many entries

### Container Component
Wrapper component that provides layout and styling context for settings.

```typescript
interface ContainerProps {
  children: ReactNode;

}
```

**Usage:**
```typescript
import { Container } from '@htk/features/appSettings/components';

function CustomSettings() {
  return (
    <Container>
      {/* Your custom settings entries */}
    </Container>
  );

}
```

**Features:**
- Consistent styling
- Proper spacing and padding
- Scrollable layout
- Theme-aware background

## Usage Examples

### Basic Settings Screen
```typescript
import { AppSettings } from '@htk/features/appSettings/components';

function SettingsScreen() {
  const [settings, setSettings] = useState({
      darkMode: false,
      fontFamily: 'System',
      fontSize: 16
    });

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

const handleSettingChange = (key: string, value: any) => {
  setSettings(prev => ({
        ...prev,
        [key]: value
      }));
};

return (
  <ScrollView>
    <Text style={styles.title}>Settings</Text>
    <AppSettings
      entries={entries}
      onSettingChange={handleSettingChange}
    />
  </ScrollView>
  );

}
```

### Grouped Settings Sections
```typescript
import { Container } from '@htk/features/appSettings/components';
import { SwitchEntry } from '@htk/features/appSettings/components/Entries';

function GroupedSettingsScreen() {
  return (
    <ScrollView>
      {/* Appearance Section */}
      <Container>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <SwitchEntry
          label="Dark Mode"
          value={isDark}
          onChange={handleChange}
        />
      <FontFamilyEntry
        label="Font Family"
        value={fontFamily}
        onChange={handleChange}
      />
    <FontSizeEntry
      label="Font Size"
      value={fontSize}
      onChange={handleChange}
    />
      </Container>

{/* Notification Section */}
<Container>
  <Text style={styles.sectionTitle}>Notifications</Text>
  <SwitchEntry
    label="Push Notifications"
    value={notificationsEnabled}
    onChange={handleChange}
  />
<SwitchEntry
  label="Email Notifications"
  value={emailNotifications}
  onChange={handleChange}
/>
</Container>
    </ScrollView>
  );

}
```

### Dynamic Entry Rendering
```typescript
import { AppSettings } from '@htk/features/appSettings/components';

function DynamicSettingsScreen({ userTier }) {
  const basicEntries = [
    { type: 'switch', key: 'darkMode', label: 'Dark Mode' }
  ];

const premiumEntries = [
  { type: 'fontFamily', key: 'fontFamily', label: 'Font Family' },
  { type: 'fontSize', key: 'fontSize', label: 'Font Size' }
];

const entries = userTier === 'premium'
? [...basicEntries, ...premiumEntries]
: basicEntries;

return <AppSettings entries={entries} onSettingChange={handleChange} />;

}
```

### Settings with Validation
```typescript
import { Container } from '@htk/features/appSettings/components';
import { FontSizeEntry } from '@htk/features/appSettings/components/Entries';

function ValidatedSettingsScreen() {
  const [fontSize, setFontSize] = useState(16);
  const [error, setError] = useState<string null>(null);

  const handleFontSizeChange = (size: number) => {
    if (size < 12 size > 32) {
      setError('Font size must be between 12 and 32');
      return;
    }
  setError(null);
  setFontSize(size);
};

return (
  <Container>
    <FontSizeEntry
      label="Font Size"
      value={fontSize}
      onChange={handleFontSizeChange}
    />
  {error && <Text style={styles.error}>{error}</Text>}
  </Container>
  );

}
```

## Integration with App Settings Feature

These components work with the main app settings system:

```typescript
import { createAppSettings } from '@htk/features/appSettings';
import { AppSettings } from '@htk/features/appSettings/components';

// Create settings system
const { useAppSettings, setAppSettings } = createAppSettings({
    darkMode: false,
    fontFamily: 'System',
    fontSize: 16
  });

// Use in component
function SettingsScreen() {
  const settings = useAppSettings();

  return (
    <AppSettings
      entries={[...]}
      onSettingChange={(key, value) => {
      setAppSettings({ ...settings, [key]: value });
      }}
    />
  );

}
```

## Styling & Theming

All components use `react-native-ui-lib` theming:
- **Colors**: Theme-aware color palette
- **Typography**: Font sizes and families
- **Spacing**: Consistent padding and margins
- **Adaptive**: Responds to light/dark mode

```typescript
import { View, Text } from 'react-native-ui-lib';

function StyledSetting() {
  return (
    <View padding-16 backgroundColor="$backgroundColor">
      <Text text70>Setting Label</Text>
    </View>
  );

}
```

## Accessibility Features

Components support:
- **Labels**: Descriptive labels for all entries
- **Touch Targets**: Minimum 44x44pt touch areas
- **Contrast**: High contrast colors
- **Keyboard Navigation**: Proper keyboard support
- **Screen Readers**: Accessibility labels

## Performance Considerations

- **Memoization**: Components memoized to prevent unnecessary re-renders
- **Lazy Rendering**: Entries only rendered when visible
- **Efficient Updates**: Only affected entries update when settings change
- **List Optimization**: FlatList for large settings lists

### Optimization Example
```typescript
import { useMemo } from 'react';

function OptimizedSettings({ entries, onChangehandlers }) {
  const memoizedEntries = useMemo(() => entries, [entries]);

  return <AppSettings entries={memoizedEntries} {...onChangehandlers} />;

}
```

## Best Practices

 **Do:**
- Group related settings visually
- Use descriptive labels
- Provide descriptions for complex options
- Use appropriate entry types
- Organize settings logically
- Add validation for complex inputs

 **Don't:**
- Mix too many entry types in one section
- Use confusing terminology
- Forget labels or descriptions
- Put critical settings without confirmation
- Overload screens with too many options
- Hard-code styling values

## Component Development

When creating custom settings entries:

1. **Extend Base Entry**
 ```typescript
import { BaseEntry } from '@htk/features/appSettings/components/Entries';

interface MyEntryProps extends BaseEntryProps {
  customProp?: string;

}
export function MyEntry({ customProp, ...props }: MyEntryProps) {
  return <BaseEntry {...props}>...</BaseEntry>;

}
```

2. **Export from Entries Index**
 ```typescript
export { MyEntry } from './MyEntry';
```

3. **Use in AppSettings**
 ```typescript
const entries = [
  { type: 'myType', key: 'myKey', label: 'My Setting' }
];
```

### Child Components
- **Entry Types**: [`Entries/README.md`](Entries/README.md) - Individual entry components

### Parent
- **App Settings Feature**: [`../README.md`](../README.md) - Settings feature overview

### Related Features
- **Theme**: [`../../theme/README.md`](../../theme/README.md) - Theme system
- **React Context**: [`../../../utils/react/README.md`](../../../utils/react/README.md) - Context utilities

## Testing Examples

### Component Testing
```typescript
import { render } from '@testing-library/react-native';
import { AppSettings } from '@htk/features/appSettings/components';

test('renders settings entries', () => {
    const entries = [
      { type: 'switch', key: 'test', label: 'Test' }
    ];

  const { getByText } = render(
    <AppSettings entries={entries} onSettingChange={jest.fn()} />
  );

expect(getByText('Test')).toBeTruthy();
});
```

## Troubleshooting

### Entries Not Showing
- Verify entries array is passed correctly
- Check entry types are registered
- Ensure AppSettings is wrapped with Provider if needed

### Styling Issues
- Verify react-native-ui-lib is properly configured
- Check theme is applied
- Ensure colors are defined in theme

### Change Not Triggered
- Verify onSettingChange callback is provided
- Check that onChange is being called in entry components
- Confirm state is being updated in parent

## Future Enhancements
- Color picker entry
- Slider entry
- Dropdown selection
- Range slider
- Custom form fields
