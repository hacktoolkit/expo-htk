# Enum Utilities

## Overview
Utility functions for working with TypeScript enums, particularly for converting enum values to human-readable strings. These utilities simplify the common task of displaying enum values in the UI.

## Location
`utils/enum/`

## Purpose
Provides helper functions to:
- Convert enum values to readable strings
- Handle enum-to-string transformation consistently
- Support snake_case to human-readable format conversion
- Maintain type safety while working with enums

## Core Functions

### enumToStr()
Converts an enum value to a readable string representation.

```typescript
function enumToStr(value: any): string
```

**Parameters:**
- `value`: The enum value to convert

**Returns:**
- A human-readable string representation

## Usage Examples

### Basic String Enum Conversion
```typescript
import { enumToStr } from '@htk/utils/enum';

enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending'

}
// Display in UI
<Text>{enumToStr(Status.ACTIVE)}</Text>
// Output: "active"
```

### Numeric Enum Conversion
```typescript
enum Priority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2

}
const displayValue = enumToStr(Priority.HIGH);
// Output: "2" or mapped string depending on implementation
```

### Snake Case to Title Case
```typescript
enum DeviceType {
  MOBILE_PHONE = 'mobile_phone',
  TABLET_DEVICE = 'tablet_device',
  DESKTOP_COMPUTER = 'desktop_computer'

}
enumToStr(DeviceType.MOBILE_PHONE);
// Output: "Mobile Phone" or "mobile phone"
```

### Dropdown/Picker Labels
```typescript
import { enumToStr } from '@htk/utils/enum';

enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user'

}
function RolePicker() {
  const roles = Object.values(UserRole);

  return (
    <Picker>
      {roles.map(role => (
            <Picker.Item
              key={role}
              label={enumToStr(role)}
              value={role}
            />
        ))}
            </Picker>
  );

}
```

### Switch/Case Display
```typescript
function getStatusColor(status: Status) {
  switch (status) {
    case Status.ACTIVE:
    return 'green';
    case Status.INACTIVE:
    return 'gray';
    case Status.PENDING:
    return 'orange';
  }

}
function StatusBadge({ status }: { status: Status }) {
  return (
    <View style={{ backgroundColor: getStatusColor(status) }}>
      <Text>{enumToStr(status)}</Text>
    </View>
  );

}
```

## Advanced Patterns

### Custom Enum Mapping
```typescript
import { enumToStr } from '@htk/utils/enum';

enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'

}
// Custom display names
const LogLevelDisplay: Record<LogLevel, string> = {
    [LogLevel.DEBUG]: ' Debug',
    [LogLevel.INFO]: ' Info',
    [LogLevel.WARN]: ' Warning',
    [LogLevel.ERROR]: ' Error'
  };

function getLogLevelDisplay(level: LogLevel): string {
  return LogLevelDisplay[level] enumToStr(level);

}
```

### Form Field Labels from Enums
```typescript
enum FormField {
  FIRST_NAME = 'first_name',
  LAST_NAME = 'last_name',
  EMAIL_ADDRESS = 'email_address',
  PHONE_NUMBER = 'phone_number'

}
function FormFieldLabel({ field }: { field: FormField }) {
  return <Label>{enumToStr(field)}</Label>;
  // Displays: "First Name", "Last Name", etc.

}
```

### Validation Error Messages
```typescript
enum ValidationError {
  REQUIRED_FIELD = 'required_field',
  INVALID_EMAIL = 'invalid_email',
  PASSWORD_TOO_SHORT = 'password_too_short'

}
function getErrorMessage(error: ValidationError): string {
  const messages: Record<ValidationError, string> = {
      [ValidationError.REQUIRED_FIELD]: 'This field is required',
      [ValidationError.INVALID_EMAIL]: 'Please enter a valid email',
      [ValidationError.PASSWORD_TOO_SHORT]: 'Password must be at least 8 characters'
    };

  return messages[error];

}
```

### Dynamic List Generation
```typescript
enum Permission {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  ADMIN = 'admin'

}
function PermissionsList() {
  const permissions = Object.values(Permission);

  return (
    <FlatList
      data={permissions}
      renderItem={({ item }) => (
      <CheckBox
      label={enumToStr(item)}
      value={item}
      />
    )}
    />
  );

}
```

## Type Safety

### Generic Enum Type Handling
```typescript
function displayEnum<T extends Record<string, string>>(
    enumValue: T[keyof T]
  ): string {
  return enumToStr(enumValue);

}
// Usage with type safety
const result = displayEnum(Status.ACTIVE);
```

### Typing Enum Display Objects
```typescript
type EnumDisplay<T extends Record<string, string>> = {
    [K in T[keyof T]]: string;
  };

const statusDisplay: EnumDisplay<typeof Status> = {
  active: 'Active Status',
  inactive: 'Inactive Status',
  pending: 'Pending Status'
};
```

## Implementation Details

The `enumToStr` function typically:
1. Converts the enum value to string
2. Handles snake_case to Title Case conversion
3. Returns a human-readable format
4. Preserves special characters if needed

**Example transformation:**
```typescript
MOBILE_PHONE → Mobile Phone
mobile_phone → Mobile Phone
mobilePhone → Mobile Phone (camelCase)
mobile-phone → Mobile Phone (kebab-case)
```

## Common Use Cases

1. **UI Display** - Show enum values in dropdowns, lists, labels
2. **Error Messages** - Display user-friendly error descriptions
3. **Logging** - Create readable log messages
4. **Debugging** - Easy visualization of enum states
5. **Forms** - Generate form field labels
6. **Analytics** - Track enum events with readable names
7. **Validation** - Display validation error messages

## Performance Considerations

- enumToStr is typically a synchronous operation
- Results can be memoized for frequently used values
- No async operations involved
- Minimal memory footprint

### Optimization Example
```typescript
// Cache converted values
const enumCache = new Map<any, string>();

function cachedEnumToStr(value: any): string {
  if (enumCache.has(value)) {
    return enumCache.get(value)!;
  }

const str = enumToStr(value);
enumCache.set(value, str);
return str;

}
```

## Best Practices

 **Do:**
- Use enumToStr for UI labels
- Keep enums simple and readable
- Use string enums for better readability
- Create custom mapping objects for special cases
- Combine with TypeScript's type system

 **Don't:**
- Hardcode enum display values
- Create duplicate string conversions
- Use complex enum transformations
- Assume enum values are always present
- Skip type safety when converting enums

## Testing Examples

```typescript
describe('enumToStr', () => {
    it('converts enum to readable string', () => {
        const result = enumToStr(Status.ACTIVE);
        expect(result).toBe('active'); // or 'Active' depending on impl
      });

  it('handles snake_case conversion', () => {
      const result = enumToStr(DeviceType.MOBILE_PHONE);
      expect(result).toMatch(/mobile.*phone/i);
    });

it('handles all enum values', () => {
    Object.values(Status).forEach(value => {
        expect(() => enumToStr(value)).not.toThrow();
      });
});
});
```

## Troubleshooting

### Enum value not converting properly
- Verify the enum is exported
- Check if enum uses string or numeric values
- Verify the function supports your enum type

### Unexpected output format
- Check the enumToStr implementation
- Verify string transformation rules
- Consider using custom mapping objects for special cases

### Type safety issues
- Ensure proper generic type constraints
- Use `as const` for literal types
- Validate enum member accessibility
