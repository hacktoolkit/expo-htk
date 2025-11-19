# Utilities

## Overview
Reusable utility functions and helpers organized by category. Provides core functionality for common operations across the application.

## Location
`utils/`

## Purpose
Offers:
- String manipulation and formatting
- Geolocation and geographic calculations
- Number formatting and humanization
- Enum helpers
- Observer pattern implementation
- React context builder patterns
- Theme styling helpers
- Error tracking integration

## Utility Modules

### String Utilities
Text formatting and transformation functions.

**Location:** [`string/README.md`](string/README.md)

**Exports:**
- `capitalize()` - Capitalize first letter
- `snakeCaseToCapitalize()` - Convert snake_case to Title Case

**Usage:**
```typescript
import { capitalize, snakeCaseToCapitalize } from '@htk/utils/string';

capitalize('hello') // → 'Hello'
snakeCaseToCapitalize('first_name') // → 'First Name'
```

### Geolocation Utilities
Geographic calculations and location services.

**Location:** `geolocations.ts`

**Functions:**
- Distance calculation (Haversine formula)
- Centroid calculation
- Reverse geocoding integration
- MapBox API integration

**Usage:**
```typescript
import { calculateHaversineDistance, calculateCentroid } from '@htk/utils';

const distance = calculateHaversineDistance(lat1, lon1, lat2, lon2);
const center = calculateCentroid(coordinates);
```

### Number Humanization
Format numbers in human-readable format.

**Location:** `humanize.ts`

**Functions:**
- Large number compaction (e.g., 1.2M)
- Comma-separated formatting
- Number grouping

**Usage:**
```typescript
import { humanizeNumber } from '@htk/utils/humanize';

humanizeNumber(1200000) // → '1.2M'
humanizeNumber(5000) // → '5,000'
```

### Enum Utilities
Convert enums to readable strings.

**Location:** [`enum/README.md`](enum/README.md)

**Functions:**
- `enumToStr()` - Convert enum value to readable string
- Supports snake_case conversion
- Type-safe enum handling

**Usage:**
```typescript
import { enumToStr } from '@htk/utils/enum';

enum Status { PENDING = 'pending', ACTIVE = 'active' }
enumToStr(Status.PENDING) // → 'pending'
```

### Observer Pattern
Event-driven communication system.

**Location:** [`observer/README.md`](observer/README.md)

**Classes:**
- `Observer<T>` - Basic event observer
- `EntityObserver<T>` - Entity-scoped observer

**Usage:**
```typescript
import { Observer } from '@htk/utils/observer';

const observer = new Observer<Data, Event>();
  const unsubscribe = observer.subscribe('event', (data) => {
      console.log(data);
    });
observer.notify('event', { /* data */ });
```

### React Context Builder
Factory for creating typed context systems.

**Location:** [`react/README.md`](react/README.md)

**Function:**
- `contextBuilder()` - Create complete context system

**Usage:**
```typescript
import { contextBuilder } from '@htk/utils/react';

const [Provider, useContext, useDispatch, useUpdate] = contextBuilder({
    count: 0
  });
```

### Theme Utilities
Styling helpers for consistent UI.

**Location:** [`theme/README.md`](theme/README.md)

**Exports:**
- `Dividers` - Border styling utilities
- Top, bottom, left, right borders
- Theme-aware colors

**Usage:**
```typescript
import { Dividers } from '@htk/utils/theme';

<View style={Dividers.bottom1}>
  <Text>Divider below</Text>
</View>
```

### Rollbar Integration
Error tracking and reporting setup.

**Location:** `rollbar.ts`

**Provides:**
- Configured Rollbar client
- React Native error tracking
- Environment-aware setup

**Usage:**
```typescript
import { rollbar } from '@htk/utils/rollbar';

rollbar.error(new Error('Something went wrong'));
```

## Architecture

```typescript
utils/
├── string/ # String manipulation
│ └── README.md # Documentation
├── enum/ # Enum helpers
│ └── README.md # Documentation
├── observer/ # Observer pattern
│ └── README.md # Documentation
├── react/ # React utilities
│ └── README.md # Documentation
├── theme/ # Styling utilities
│ └── README.md # Documentation
├── geolocations.ts # Geographic calculations
├── humanize.ts # Number formatting
├── rollbar.ts # Error tracking
└── README.md # This file
```

## Quick Reference

 Utility Purpose Import 
--------------------------
 `capitalize` Capitalize text `@htk/utils/string` 
 `snakeCaseToCapitalize` Format snake_case `@htk/utils/string` 
 `enumToStr` Convert enum to string `@htk/utils/enum` 
 `Observer` Event system `@htk/utils/observer` 
 `EntityObserver` Scoped observer `@htk/utils/observer` 
 `contextBuilder` Create context `@htk/utils/react` 
 `Dividers` Border styles `@htk/utils/theme` 
 `humanizeNumber` Format numbers `@htk/utils/humanize` 
 `calculateDistance` Geographic distance `@htk/utils` 

## Common Patterns

### String Formatting
```typescript
import { capitalize, snakeCaseToCapitalize } from '@htk/utils/string';

// UI labels
const fieldLabel = snakeCaseToCapitalize('user_email');

// Capitalization
const title = capitalize('welcome');
```

### Number Display
```typescript
import { humanizeNumber } from '@htk/utils/humanize';

// Format large numbers
<Text>{humanizeNumber(1500000)}</Text> // "1.5M"
```

### Enum Display
```typescript
import { enumToStr } from '@htk/utils/enum';

enum Status { ACTIVE = 'active', INACTIVE = 'inactive' }

<Picker>
  {Object.values(Status).map(s => (
        <Picker.Item label={enumToStr(s)} value={s} />
    ))}
        </Picker>
```

### Observer Usage
```typescript
import { Observer } from '@htk/utils/observer';

type UserEvent = 'created' 'updated' 'deleted';
const observer = new Observer<User, UserEvent>();

  const unsub = observer.subscribe('updated', (user) => {
      console.log('User updated:', user);
    });

observer.notify('updated', userData);
unsub(); // Unsubscribe
```

### Context Creation
```typescript
import { contextBuilder } from '@htk/utils/react';

const [AppProvider, useApp, useDispatch, useUpdate] = contextBuilder({
    theme: 'light',
    language: 'en'
  });

function App() {
  return <AppProvider><MainContent /></AppProvider>;
}

function Content() {
  const app = useApp();
  const update = useUpdate();

  return <Text>{app.theme}</Text>;
}
```

## Integration Examples

### With Components
```typescript
import { snakeCaseToCapitalize } from '@htk/utils/string';

function FieldLabel({ field }: { field: string }) {
  return <Text>{snakeCaseToCapitalize(field)}</Text>;
}
```

### With Dialogs
```typescript
import { Observer } from '@htk/utils/observer';

type DialogEvent = 'opened' 'closed';
const dialogObserver = new Observer<DialogData, DialogEvent>();
```

### With Settings
```typescript
import { contextBuilder } from '@htk/utils/react';

const [SettingsProvider, useSettings] = contextBuilder({
    fontSize: 16,
    isDark: false
  });
```

### With Features
```typescript
import { enumToStr } from '@htk/utils/enum';

// Display enum-based settings
enum FontSize { SMALL = 'small', MEDIUM = 'medium', LARGE = 'large' }

<Picker>
  {Object.values(FontSize).map(size => (
        <Picker.Item label={enumToStr(size)} value={size} />
    ))}
        </Picker>
```

## Best Practices

 **Do:**
- Use string utilities for UI text
- Use enum helpers for display values
- Use observer for decoupled communication
- Use context builder for state management
- Use geolocation for map features
- Cache formatted values when appropriate

 **Don't:**
- Hard-code strings in components
- Mix enum formats
- Overuse observers for simple state
- Create context for single values
- Forget to unsubscribe from observers
- Ignore number formatting

## Performance Tips

- Memoize formatter results for frequently-used values
- Cache enum conversions when possible
- Use selective observers instead of wildcard subscriptions
- Minimize context re-renders with proper memoization

## Testing Utilities

### Test String Utilities
```typescript
import { capitalize, snakeCaseToCapitalize } from '@htk/utils/string';

test('capitalizes correctly', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(snakeCaseToCapitalize('hello_world')).toBe('Hello World');
  });
```

### Test Observer
```typescript
import { Observer } from '@htk/utils/observer';

test('notifies subscribers', () => {
    const observer = new Observer<{}, 'test'>();
    const callback = jest.fn();

    observer.subscribe('test', callback);
    observer.notify('test', {});

    expect(callback).toHaveBeenCalled();
  });
```

## Related Documentation

### Individual Utilities
- **String**: [`string/README.md`](string/README.md)
- **Enum**: [`enum/README.md`](enum/README.md)
- **Observer**: [`observer/README.md`](observer/README.md)
- **React**: [`react/README.md`](react/README.md)
- **Theme**: [`theme/README.md`](theme/README.md)

### Features Using Utilities
- **App Settings**: [`../features/appSettings/README.md`](../features/appSettings/README.md)
- **Theme System**: [`../features/theme/README.md`](../features/theme/README.md)
- **Storage**: [`../storages/README.md`](../storages/README.md)

## Troubleshooting

### Enum Conversion Issues
- Verify enum is exported correctly
- Check enum values are strings
- Use enumToStr with valid enum members

### Observer Subscriptions Not Working
- Verify event names match
- Check unsubscribe isn't called prematurely
- Ensure observer instance is shared

### Context Hook Errors
- Verify Provider wraps component tree
- Check hook is called inside Provider
- Ensure hook is inside Provider component

## Contributing

When adding new utilities:
1. Place in appropriate category folder
2. Export from category index
3. Create comprehensive README
4. Include usage examples
5. Add TypeScript types
6. Write tests

## Version Compatibility
- React Native: 0.60+
- Expo: SDK 40+
- TypeScript: 4.0+
