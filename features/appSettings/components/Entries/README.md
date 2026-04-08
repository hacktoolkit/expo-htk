# Settings Entry Types

## Overview
A collection of specialized entry components for the app settings system. Each entry type handles a specific kind of setting with its own UI, validation, and state management. This modular approach allows for easy extension with new setting types.

## Location
`features/appSettings/components/Entries/`

## Purpose
Provides reusable, typed entry components for different setting configurations:
- Render appropriate UI for each setting type
- Handle user input and validation
- Manage setting state through the app settings context
- Provide consistent styling and behavior across all entry types

## Entry Types Available

 Entry Type File Purpose Use Cases 
--------------------------------------
 **Base** `Base.tsx` Abstract base component for all entries Foundation for custom entries 
 **Switch** `Switch.tsx` Boolean toggle entries Enable/disable features, flags 
 **FontFamily** `FontFamily.tsx` Font selection picker Typography customization 
 **FontSize** `FontSize.tsx` Font size selector Accessibility, readability 

## Component Architecture

### Base Entry Component
The foundational component that all entries extend. Provides:
- Label and description rendering
- Layout structure (label, control, optional icon)
- Theme integration
- Accessibility support

```typescript
interface BaseEntryProps {
  label: string;
  description?: string;
  value: any;
  onChange: (value: any) => void;
  icon?: ReactNode;
  disabled?: boolean;

}
```

## Detailed Entry Components

### Switch Entry
Boolean toggle for simple yes/no settings.

```typescript
import { SwitchEntry } from '@htk/features/appSettings';

<SwitchEntry
  label="Dark Mode"
  description="Use dark color scheme"
  value={isDarkMode}
  onChange={(enabled) => setIsDarkMode(enabled)}
/>
```

**Features:**
- Toggle switch control
- True/false state management
- Theme-aware styling
- Accessibility labels

### FontFamily Entry
Picker component for selecting fonts from available system fonts.

```typescript
import { FontFamilyEntry } from '@htk/features/appSettings';

<FontFamilyEntry
  label="Font Family"
  value={selectedFont}
  onChange={(font) => setSelectedFont(font)}
/>
```

**Features:**
- List of available fonts
- Visual preview of each font
- Default system font option
- Persistent selection

### FontSize Entry
Numerical input or picker for adjusting font sizes.

```typescript
import { FontSizeEntry } from '@htk/features/appSettings';

<FontSizeEntry
  label="Base Font Size"
  description="Adjust text size"
  value={fontSize}
  onChange={(size) => setFontSize(size)}
/>
```

**Features:**
- Predefined size options or custom input
- Live preview capability
- Accessibility range validation
- Visual size indicator

## Creating Custom Entry Types

To add a new setting entry type, extend the Base entry:

```typescript
// MyCustomEntry.tsx
import { BaseEntry, BaseEntryProps } from './Base';

interface MyCustomEntryProps extends BaseEntryProps {
  options?: string[];

}
export function MyCustomEntry({
    label,
    value,
    onChange,
    options = [],
    ...props
  }: MyCustomEntryProps) {
return (
  <BaseEntry label={label} value={value} {...props}>
    <MyCustomControl
      value={value}
      onChange={onChange}
      options={options}
    />
  </BaseEntry>
  );

}
```

## Integration with AppSettings

Entries are used within the AppSettings component through entry definitions:

```typescript
const settingsEntries = [
  {
    type: 'switch',
    key: 'darkMode',
    label: 'Dark Mode',
    description: 'Enable dark color scheme'
  },
{
  type: 'fontFamily',
  key: 'fontFamily',
  label: 'Font Family'
},
{
  type: 'fontSize',
  key: 'fontSize',
  label: 'Font Size'

}];
```

## Styling & Theming

All entries integrate with the app's theme system via `react-native-ui-lib`:
- Colors adapt to light/dark mode
- Typography follows theme settings
- Spacing uses theme dimensions
- Custom styles can be applied through the theme configuration

## Type Definitions

```typescript
// Entry configuration type
interface SettingsEntry {
  type: 'switch' 'fontFamily' 'fontSize' string;
  key: string;
  label: string;
  description?: string;
  defaultValue?: any;
  disabled?: boolean;
  validation?: (value: any) => boolean;

}
// Entry change handler
type OnEntryChange = (key: string, value: any) => void;
```

## Best Practices

 **Do:**
- Create focused, single-responsibility entry types
- Provide descriptive labels and help text
- Validate user input appropriately
- Consider mobile and tablet screen sizes
- Use the theme system for consistent styling

 **Don't:**
- Overload entries with too many options
- Skip validation for user inputs
- Hard-code colors or spacing values
- Forget accessibility considerations

## Common Patterns

### Disabled Entries
```typescript
<SwitchEntry
  label="Premium Feature"
  disabled={!isPremium}
  value={premiumSetting}
  onChange={handleChange}
/>
```

### Entries with Validation
```typescript
const validationRules = {
  fontSize: (value) => value >= 12 && value <= 32
};
```

### Conditional Entry Display
```typescript
{shouldShowAdvanced && (
    <MyCustomEntry {...props} />
)}
```

## Performance Considerations
- Entries use memoization to prevent unnecessary re-renders
- Validation is debounced for custom inputs
- Large lists of entries benefit from virtualization
- Consider lazy-loading complex entry types

## Future Entry Types to Consider
- Color picker entry
- Slider entry with range
- Dropdown/select entry
- Date/time picker entry
- Multi-select entry
- Custom text input with validation
