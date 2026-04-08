# String Utilities

## Overview
Common string manipulation utilities for text formatting and transformation. Provides simple, efficient functions for capitalizing text and converting between string casing conventions.

## Location
`utils/string/`

## Purpose
Simplifies common string operations for:
- Formatting user input for display
- Converting data format conventions
- Creating human-readable labels
- Normalizing text for UI presentation
- Supporting internationalization patterns

## Functions

### capitalize()
Capitalizes the first letter of a string and lowercases the rest.

```typescript
function capitalize(name: string): string
```

**Parameters:**
- `name`: The string to capitalize

**Returns:** String with first letter uppercase, rest lowercase

**Examples:**
```typescript
import { capitalize } from '@htk/utils/string';

capitalize('hello') // → 'Hello'
capitalize('WORLD') // → 'World'
capitalize('javaScript') // → 'Javascript'
capitalize('iPhone') // → 'Iphone'
```

### snakeCaseToCapitalize()
Converts snake_case strings to Title Case with spaces.

```typescript
function snakeCaseToCapitalize(name: string): string
```

**Parameters:**
- `name`: The snake_case string to convert

**Returns:** Title Case string with spaces between words

**Examples:**
```typescript
import { snakeCaseToCapitalize } from '@htk/utils/string';

snakeCaseToCapitalize('first_name') // → 'First Name'
snakeCaseToCapitalize('user_profile_page') // → 'User Profile Page'
snakeCaseToCapitalize('api_endpoint_url') // → 'Api Endpoint Url'
snakeCaseToCapitalize('single') // → 'Single'
snakeCaseToCapitalize('UPPER_CASE') // → 'Upper Case'
```

## Usage Examples

### Form Field Labels
```typescript
import { snakeCaseToCapitalize } from '@htk/utils/string';

interface UserData {
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number: string;

}
function UserForm() {
  return (
    <View>
      <Label>{snakeCaseToCapitalize('first_name')}</Label>
      <TextInput placeholder="John" />

    <Label>{snakeCaseToCapitalize('last_name')}</Label>
    <TextInput placeholder="Doe" />

  <Label>{snakeCaseToCapitalize('email_address')}</Label>
  <TextInput placeholder="john@example.com" />
    </View>
  );

}
```

### Dropdown Labels
```typescript
import { snakeCaseToCapitalize } from '@htk/utils/string';

enum OrderStatus {
  PENDING_PAYMENT = 'pending_payment',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered'

}
function OrderStatusPicker() {
  const statuses = Object.values(OrderStatus);

  return (
    <Picker>
      {statuses.map(status => (
            <Picker.Item
              key={status}
              label={snakeCaseToCapitalize(status)}
              value={status}
            />
        ))}
            </Picker>
  );

}
```

### Error Messages
```typescript
import { capitalize } from '@htk/utils/string';

function ValidationError({ field }: { field: string }) {
  const fieldName = capitalize(field);

  return (
    <Text style={styles.error}>
      {fieldName} is required
    </Text>
  );

}
// Usage
<ValidationError field="email" /> // → "Email is required"
<ValidationError field="password" /> // → "Password is required"
```

### Dynamic UI Labels
```typescript
import { snakeCaseToCapitalize } from '@htk/utils/string';

interface APIResponse {
  user_id: string;
  created_at: string;
  updated_at: string;
  is_verified: boolean;

}
function DataDisplay(data: APIResponse) {
  return (
    <View>
      {Object.entries(data).map(([key, value]) => (
            <Row key={key}>
              <Label>{snakeCaseToCapitalize(key)}</Label>
              <Value>{String(value)}</Value>
            </Row>
        ))}
    </View>
  );

}
```

### Capitalized Settings Labels
```typescript
import { capitalize } from '@htk/utils/string';

function SettingsOption({ name }: { name: string }) {
  return (
    <Row>
      <Label>{capitalize(name)}</Label>
      <Toggle />
    </Row>
  );

}
// Usage
<SettingsOption name="notifications" /> // → "Notifications"
<SettingsOption name="analytics" /> // → "Analytics"
<SettingsOption name="darkMode" /> // → "Darkmode"
```

## Advanced Patterns

### Chaining String Transformations
```typescript
import { capitalize, snakeCaseToCapitalize } from '@htk/utils/string';

function normalizeFieldLabel(field: string): string {
  // If it contains underscores, convert from snake_case
  if (field.includes('_')) {
    return snakeCaseToCapitalize(field);
  }

// Otherwise, just capitalize
return capitalize(field);

}
normalizeFieldLabel('first_name') // → 'First Name'
normalizeFieldLabel('email') // → 'Email'
normalizeFieldLabel('userId') // → 'Userid'
```

### Custom Label Builder
```typescript
import { snakeCaseToCapitalize } from '@htk/utils/string';

function createLabels<T extends Record<string, any>>(
    data: T
  ): Record<keyof T, string> {
  const labels = {} as Record<keyof T, string>;

  for (const key in data) {
    labels[key] = snakeCaseToCapitalize(key);
  }

return labels;

}
const userLabels = createLabels({
    first_name: '',
    last_name: '',
    email_address: ''
  });

// Result:
// {
  // first_name: 'First Name',
  // last_name: 'Last Name',
  // email_address: 'Email Address'
  // }
```

### Localized String Utilities
```typescript
import { snakeCaseToCapitalize } from '@htk/utils/string';

function i18nLabel(key: string): string {
  // First convert to readable format
  const readable = snakeCaseToCapitalize(key);

  // Then look up translation
  return i18n.t(key) readable;

}
```

### Form Validation Error Messages
```typescript
import { capitalize } from '@htk/utils/string';

type ValidationErrors = Record<string, string>;

function formatValidationErrors(
  errors: ValidationErrors
): string {
return Object.entries(errors)
.map(([field, error]) => `${capitalize(field)}: ${error}`)
.join('\n');

}
// Result:
// "Email: Invalid email format\nPassword: Too short"
```

## Type Safety

### Generic Label Generation
```typescript
import { snakeCaseToCapitalize } from '@htk/utils/string';

interface FormShape {
  user_name: string;
  email_address: string;
  phone_number: string;

}
type FormLabels = {
  [K in keyof FormShape]: string;
};

const labels: FormLabels = {
  user_name: snakeCaseToCapitalize('user_name'),
  email_address: snakeCaseToCapitalize('email_address'),
  phone_number: snakeCaseToCapitalize('phone_number')
};
```

## Performance Considerations

- **Time Complexity**: O(n) where n is string length
- **Space Complexity**: O(n) for new string creation
- **Cache Results**: For frequently used transformations

### Memoizing String Transformations
```typescript
import { useMemo } from 'react';
import { snakeCaseToCapitalize } from '@htk/utils/string';

function LabeledField({ fieldName }: { fieldName: string }) {
  const label = useMemo(() => {
      return snakeCaseToCapitalize(fieldName);
    }, [fieldName]);

return <Label>{label}</Label>;

}
```

## Common Patterns

### Enum to Label
```typescript
import { snakeCaseToCapitalize } from '@htk/utils/string';

enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user'

}
function RoleLabel({ role }: { role: UserRole }) {
  return <Text>{snakeCaseToCapitalize(role)}</Text>;

}
// Output:
// SUPER_ADMIN → "Super Admin"
// ADMIN → "Admin"
// MODERATOR → "Moderator"
// USER → "User"
```

### API Response Transformation
```typescript
import { snakeCaseToCapitalize } from '@htk/utils/string';

interface APIResponse {
  [key: string]: any;

}
function transformForDisplay(data: APIResponse): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(data)) {
    result[snakeCaseToCapitalize(key)] = String(value);
  }

return result;

}
```

### Configuration Key Display
```typescript
import { snakeCaseToCapitalize } from '@htk/utils/string';

const config = {
  max_retries: 3,
  timeout_ms: 5000,
  enable_logging: true,
  api_endpoint_url: 'https://api.example.com'
};

function ConfigDisplay() {
  return (
    <View>
      {Object.entries(config).map(([key, value]) => (
            <Row key={key}>
              <Label>{snakeCaseToCapitalize(key)}</Label>
              <Value>{String(value)}</Value>
            </Row>
        ))}
    </View>
  );

}
```

## Edge Cases

### Empty Strings
```typescript
capitalize('') // → ''
snakeCaseToCapitalize('') // → ''
```

### Single Character
```typescript
capitalize('a') // → 'A'
capitalize('Z') // → 'Z'
snakeCaseToCapitalize('a') // → 'A'
```

### Numbers in Strings
```typescript
capitalize('test123') // → 'Test123'
snakeCaseToCapitalize('user_id_123') // → 'User Id 123'
```

### Special Characters
```typescript
capitalize('hello@world') // → 'Hello@world'
snakeCaseToCapitalize('user_email@domain') // → 'User Email@domain'
```

## Best Practices

 **Do:**
- Use snakeCaseToCapitalize for snake_case fields
- Use capitalize for simple text normalization
- Cache results for frequently used strings
- Memoize transformations in React components
- Use for display labels, not data processing
- Combine with i18n for translations

 **Don't:**
- Don't use for data validation
- Don't modify user input directly
- Don't assume consistent input format
- Don't use for identifiers or keys
- Don't apply multiple times on same string

## Related Functions

### Related Utilities
- **Enum Utilities**: [`../enum/README.md`](../enum/README.md) - Enum to string conversion
- **Utils**: [`../README.md`](../README.md) - All utility functions

## Testing Examples

```typescript
describe('capitalize', () => {
    it('capitalizes first letter', () => {
        expect(capitalize('hello')).toBe('Hello');
      });

  it('lowercases rest of string', () => {
      expect(capitalize('HELLO')).toBe('Hello');
    });

it('handles single character', () => {
    expect(capitalize('a')).toBe('A');
  });

it('handles empty string', () => {
    expect(capitalize('')).toBe('');
  });
});

describe('snakeCaseToCapitalize', () => {
    it('converts snake_case to Title Case', () => {
        expect(snakeCaseToCapitalize('first_name')).toBe('First Name');
      });

  it('handles multiple underscores', () => {
      expect(snakeCaseToCapitalize('user_profile_page'))
      .toBe('User Profile Page');
    });

it('handles single word', () => {
    expect(snakeCaseToCapitalize('email')).toBe('Email');
  });

it('handles uppercase', () => {
    expect(snakeCaseToCapitalize('UPPER_CASE')).toBe('Upper Case');
  });

it('handles empty string', () => {
    expect(snakeCaseToCapitalize('')).toBe('');
  });

it('handles mixed case', () => {
    expect(snakeCaseToCapitalize('myVar_name')).toBe('Myvar Name');
  });
});
```

## Troubleshooting

### Unexpected Capitalization
- `snakeCaseToCapitalize` assumes snake_case input
- For camelCase, consider converting first
- For mixed formats, validate input

### Missing Spaces
- Ensure underscores are present
- Function splits on `_` character
- No automatic camelCase detection

### Case Sensitivity
- capitalize always lowercases except first letter
- snakeCaseToCapitalize applies capitalize to each word
- Both are case-insensitive input handlers

## Related Utilities
- **Enum utilities**: Works well with enum values
- **Observer pattern**: For dynamic string handling
- **React context**: For sharing string transformations

## Future Enhancements
Consider extending with:
- `camelCaseToCapitalize()` - Convert camelCase to Title Case
- `kebabCaseToCapitalize()` - Convert kebab-case to Title Case
- `truncate()` - Truncate with ellipsis
- `pluralize()` - Pluralization helper
- `slugify()` - URL-safe string conversion
