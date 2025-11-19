# Theme Utilities

## Overview
Styling utilities for React Native components, providing consistent border and divider styling integrated with the `react-native-ui-lib` theme system. These utilities ensure visual consistency across the application.

## Location
`utils/theme/`

## Purpose
Provides reusable style objects for:
- Border styling with theme-aware colors
- Divider lines in different orientations
- Consistent UI element separation
- Theme-based visual hierarchy
- Type-safe styling utilities

## Files Included

 File Purpose 
---------------
 `index.ts` Divider styling utilities 

## Core Exports

### Dividers Object
A collection of pre-configured border style objects using theme colors. Getters ensure styles are always calculated with current theme colors.

```typescript
export const Dividers = {
  top1, // Top border 1px
  right1, // Right border 1px
  bottom1, // Bottom border 1px
  left1 // Left border 1px
}
```

## Divider Styles

### top1
Horizontal divider at the top of an element.

```typescript
Dividers.top1 // {
  // borderTopWidth: 1,
  // borderColor: Colors.$outlineDefault
  // }
```

### right1
Vertical divider on the right side of an element.

```typescript
Dividers.right1 // {
  // borderRightWidth: 1,
  // borderColor: Colors.$outlineDefault
  // }
```

### bottom1
Horizontal divider at the bottom of an element.

```typescript
Dividers.bottom1 // {
  // borderBottomWidth: 1,
  // borderColor: Colors.$outlineDefault
  // }
```

### left1
Vertical divider on the left side of an element.

```typescript
Dividers.left1 // {
  // borderLeftWidth: 1,
  // borderColor: Colors.$outlineDefault
  // }
```

## Usage Examples

### Simple Border
```typescript
import { Dividers } from '@htk/utils/theme';
import { View, Text } from 'react-native';

function Card() {
  return (
    <View style={Dividers.bottom1}>
      <Text>Card Content</Text>
    </View>
);
}
// Renders with 1px bottom border in theme color
```

### Multiple Borders
```typescript
import { Dividers } from '@htk/utils/theme';
import { View, StyleSheet } from 'react-native';

function BorderedBox() {
  const combinedBorders = StyleSheet.compose(
    Dividers.top1,
    Dividers.bottom1
  );

return (
  <View style={combinedBorders}>
    <Text>Content</Text>
  </View>
);
}
```

### Layout Separation
```typescript
import { Dividers } from '@htk/utils/theme';
import { View, FlatList } from 'react-native';

function UserList() {
  return (
    <FlatList
      data={users}
      renderItem={({ item }) => (
      <View style={Dividers.bottom1}>
      <UserCard user={item} />
      </View>
  )}
keyExtractor={item => item.id}
    />
);
}
```

### Vertical Layout Dividers
```typescript
import { Dividers } from '@htk/utils/theme';
import { View } from 'react-native';

function HorizontalLayout() {
  return (
    <View style={{ flexDirection: 'row' }}>
      <View style={{ flex: 1 }}>
        <Text>Left Column</Text>
      </View>

    <View style={Dividers.left1} />

  <View style={{ flex: 1 }}>
    <Text>Right Column</Text>
  </View>
  </View>
);
}
```

### Card Component
```typescript
import { Dividers } from '@htk/utils/theme';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    card: {
      padding: 16,
      backgroundColor: 'white'
    },
  header: {
    ...Dividers.bottom1,
    paddingBottom: 12,
    marginBottom: 12
  },
body: {
  paddingVertical: 8
}
});

function Card({ title, content }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          {title}
        </Text>
      </View>
  <View style={styles.body}>
    <Text>{content}</Text>
  </View>
  </View>
);
}
```

### Form Section Dividers
```typescript
import { Dividers } from '@htk/utils/theme';
import { View, TextInput, Text } from 'react-native';

function FormSection({ title, children }) {
  return (
    <View style={Dividers.bottom1}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
        {title}
      </Text>
    {children}
    </View>
);
}

function RegistrationForm() {
  return (
    <View>
      <FormSection title="Personal Information">
        <TextInput placeholder="First Name" />
      <TextInput placeholder="Last Name" />
      </FormSection>

<FormSection title="Contact">
  <TextInput placeholder="Email" />
<TextInput placeholder="Phone" />
</FormSection>
    </View>
);
}
```

### Modal/Dialog with Dividers
```typescript
import { Dividers } from '@htk/utils/theme';
import { View, Text, Button } from 'react-native';

function Dialog({ title, content, onConfirm, onCancel }) {
  return (
    <View style={{ backgroundColor: 'white', borderRadius: 8 }}>
      <View style={{ padding: 16, ...Dividers.bottom1 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          {title}
        </Text>
      </View>

  <View style={{ padding: 16, ...Dividers.bottom1 }}>
    <Text>{content}</Text>
  </View>

<View style={{
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12
  }}>
<Button title="Cancel" onPress={onCancel} />
<Button title="Confirm" onPress={onConfirm} />
</View>
</View>
);
}
```

### Tab Navigation
```typescript
import { Dividers } from '@htk/utils/theme';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';

function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <View style={Dividers.bottom1}>
      <FlatList
        data={tabs}
        horizontal
        renderItem={({ item }) => (
        <TouchableOpacity
        onPress={() => onTabChange(item.id)}
        style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: activeTab === item.id ? 2 : 0,
        borderBottomColor: activeTab === item.id ? 'blue' : 'transparent'
            }}
      >
      <Text>{item.label}</Text>
        </TouchableOpacity>
)}
keyExtractor={item => item.id}
      />
    </View>
);
}
```

### Settings List
```typescript
import { Dividers } from '@htk/utils/theme';
import { View, Text, TouchableOpacity } from 'react-native';

function SettingsItem({ label, value, onPress }) {
  return (
    <TouchableOpacity
      style={{
      paddingVertical: 12,
      paddingHorizontal: 16,
      ...Dividers.bottom1
      }}
  onPress={onPress}
>
<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  <Text>{label}</Text>
  <Text style={{ color: 'gray' }}>{value}</Text>
</View>
    </TouchableOpacity>
);
}

function SettingsList() {
  return (
    <View>
      <SettingsItem label="Language" value="English" />
    <SettingsItem label="Theme" value="Dark" />
  <SettingsItem label="Notifications" value="On" />
    </View>
);
}
```

## Advanced Patterns

### Custom Divider Combinations
```typescript
import { Dividers } from '@htk/utils/theme';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // Combine multiple dividers
    bordered: {
      ...Dividers.top1,
      ...Dividers.bottom1
    },

  // Horizontal box
  boxHorizontal: {
    ...Dividers.left1,
    ...Dividers.right1
  },

// All sides
boxFull: {
  ...Dividers.top1,
  ...Dividers.right1,
  ...Dividers.bottom1,
  ...Dividers.left1
}
});
```

### Conditional Dividers
```typescript
import { Dividers } from '@htk/utils/theme';

function ListItem({ item, showBottom = true, showTop = false }) {
  return (
    <View
      style={{
      ...(showTop && Dividers.top1),
      ...(showBottom && Dividers.bottom1)
      }}
>
<Text>{item.title}</Text>
    </View>
);
}
```

### Theme-Aware Styling
```typescript
import { Dividers } from '@htk/utils/theme';
import { Colors } from 'react-native-ui-lib';

// Dividers automatically use the current theme colors
// Light theme: uses light outline color
// Dark theme: automatically switches to dark outline color

function ThemedComponent() {
  // No need to manually change colors - theme system handles it
  return (
    <View style={Dividers.bottom1}>
      <Text>This divider adapts to theme</Text>
    </View>
);
}
```

## Integration with react-native-ui-lib

The Dividers utilities integrate seamlessly with `react-native-ui-lib`:

- **Colors.$outlineDefault**: Theme-aware outline color
- **Auto-theming**: Dividers automatically adapt to light/dark mode
- **Consistency**: Uses the same color system as other UI-lib components

## API Reference

### Style Objects

All divider styles return objects with the following properties:

```typescript
{
  borderTopWidth?: number; // 1
  borderBottomWidth?: number; // 1
  borderLeftWidth?: number; // 1
  borderRightWidth?: number; // 1
  borderColor: string; // Colors.$outlineDefault
}
```

### Type Safety

All divider properties are properly typed:

```typescript
import { Dividers } from '@htk/utils/theme';
import { StyleProp, ViewStyle } from 'react-native';

const dividerStyle: StyleProp<ViewStyle> = Dividers.bottom1;
  // Type-safe
```

## Performance Considerations

- **Getter Functions**: Dividers are lazy-evaluated getters
- **Theme Integration**: Colors computed from current theme
- **No Re-renders**: Dividers don't cause unnecessary re-renders
- **Memory Efficient**: Minimal overhead

### Usage Optimization
```typescript
// Good: Create once, reuse
const styles = StyleSheet.create({
    item: Dividers.bottom1
  });

// Avoid: Creating in render
function Item() {
  return <View style={Dividers.bottom1} />; // Creates style object each render
}
```

## Best Practices

 **Do:**
- Use Dividers for consistent borders
- Combine with StyleSheet.create
- Leverage theme-aware colors
- Use appropriate divider direction
- Memoize complex style compositions
- Consider spacing around dividers

 **Don't:**
- Override border colors manually
- Use Dividers for layout (use flexbox)
- Create style objects in render
- Assume specific color values
- Mix with hardcoded colors
- Use for thick borders (not designed for that)

## Related Documentation
- **Theme Feature**: [`../../features/theme/README.md`](../../features/theme/README.md) - Theme system
- **Utils**: [`../README.md`](../README.md) - All utility functions
- **react-native-ui-lib**: Theme and styling integration

## Styling Patterns

### Grid Layout with Dividers
```typescript
import { Dividers } from '@htk/utils/theme';
import { View } from 'react-native';

function GridItem({ item }) {
  return (
    <View
      style={{
      flex: 1,
      padding: 8,
      ...Dividers.right1,
      ...Dividers.bottom1
      }}
>
<Text>{item.title}</Text>
    </View>
);
}
```

### Breadcrumb Navigation
```typescript
import { Dividers } from '@htk/utils/theme';
import { View, Text } from 'react-native';

function Breadcrumb({ items }) {
  return (
    <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        ...Dividers.bottom1,
        paddingVertical: 8
      }}>
  {items.map((item, index) => (
        <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>{item.label}</Text>
          {index < items.length - 1 && <Text style={{ marginHorizontal: 8 }}>›</Text>}
        </View>
    ))}
        </View>
);
}
```

### Step Indicator
```typescript
import { Dividers } from '@htk/utils/theme';
import { View, Text } from 'react-native';

function StepIndicator({ steps, currentStep }) {
  return (
    <View style={{
        ...Dividers.bottom1,
        paddingVertical: 16,
        paddingHorizontal: 12
      }}>
  {steps.map((step, index) => (
        <View
          key={step.id}
          style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: index < steps.length - 1 ? 8 : 0
          }}
    >
    <View
      style={{
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: currentStep >= index ? 'blue' : 'lightgray',
      justifyContent: 'center',
      alignItems: 'center'
      }}
>
<Text style={{ color: 'white' }}>{index + 1}</Text>
    </View>
<Text style={{ marginLeft: 12 }}>{step.title}</Text>
    </View>
))}
    </View>
);
}
```

## Testing

### Snapshot Testing
```typescript
import { Dividers } from '@htk/utils/theme';

describe('Dividers', () => {
    it('has correct top divider style', () => {
        expect(Dividers.top1).toEqual({
            borderTopWidth: 1,
            borderColor: expect.any(String)
          });
    });

it('all dividers use outline color', () => {
    [Dividers.top1, Dividers.right1, Dividers.bottom1, Dividers.left1]
    .forEach(divider => {
        expect(divider.borderColor).toBeDefined();
      });
});
});
```

## Migration Guide

### From Hardcoded Borders
```typescript
// Before: Hardcoded colors
<View style={{ borderBottomWidth: 1, borderBottomColor: '#ddd' }} />

// After: Theme-aware
import { Dividers } from '@htk/utils/theme';
<View style={Dividers.bottom1} />
```

## Future Enhancements
Consider extending Dividers with:
- Thicker borders (2px, 3px variants)
- Different color variants
- Dashed/dotted border styles
- Corner-specific borders
