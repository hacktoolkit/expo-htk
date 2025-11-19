# State Management

## Overview
Centralized state management system using Jotai with automatic persistence. Provides a foundation for managing application state with minimal boilerplate.

## Location
`states/`

## Purpose
Provides:
- Jotai-based state management
- Automatic persistence with MMKV/localStorage
- Type-safe state definitions
- Storage adapter integration
- Simplified atom creation

## Core Concepts

### Atoms
Fundamental units of state in Jotai.

```typescript
import { atom } from 'jotai';

// Basic atom
const countAtom = atom(0);

// Persisted atom
const userAtom = atom({ name: 'John', age: 30 });
```

### Persisted State
Automatic persistence with storage adapters.

```typescript
import { createPersistedState } from '@htk/states';

const persistedAtom = createPersistedState();
const userPreferencesAtom = persistedAtom('userPrefs', defaults);
```

## API

### createPersistedState()
Factory function for creating persisted atoms.

```typescript
function createPersistedState(): (
  key: string,
  initial: T
) => Atom<T>
```

**Parameters:**
- `key` - Storage key
- `initial` - Initial state value

**Returns:**
- Persisted Jotai atom

## Quick Start

### 1. Create Persisted State
```typescript
import { createPersistedState } from '@htk/states';

const persistedAtom = createPersistedState();

// Create persisted atom
const userAtom = persistedAtom('currentUser', {
    id: '',
    name: '',
    email: ''
  });
```

### 2. Use in Components
```typescript
import { useAtomValue, useSetAtom } from 'jotai/react';

function UserProfile() {
  const user = useAtomValue(userAtom);
  const setUser = useSetAtom(userAtom);

  return (
    <View>
      <Text>{user.name}</Text>
      <Button
        onPress={() => setUser({...user, name: 'Updated'})}
        title="Update"
      />
    </View>
);
}
```

### 3. Automatic Persistence
```typescript
// User data automatically persisted to storage
// Restored on app restart
```

## Usage Patterns

### Simple State
```typescript
import { useAtomValue, useSetAtom } from 'jotai/react';

const countAtom = atom(0);

function Counter() {
  const count = useAtomValue(countAtom);
  const setCount = useSetAtom(countAtom);

  return (
    <View>
      <Text>{count}</Text>
      <Button
        onPress={() => setCount(count + 1)}
        title="Increment"
      />
    </View>
);
}
```

### Derived Atoms
```typescript
import { atom } from 'jotai';

const firstNameAtom = atom('John');
const lastNameAtom = atom('Doe');

const fullNameAtom = atom((get) => {
    const firstName = get(firstNameAtom);
    const lastName = get(lastNameAtom);
    return `${firstName} ${lastName}`;
  });
```

### Persisted Complex State
```typescript
import { createPersistedState } from '@htk/states';

interface AppState {
  user: User null;
  settings: Settings;
  cache: Record<string, any>;
}

const persistedAtom = createPersistedState();
const appStateAtom = persistedAtom<AppState>('appState', {
      user: null,
      settings: {},
      cache: {}
    });

function useAppState() {
  return useAtomValue(appStateAtom);
}

function useUpdateAppState() {
  return useSetAtom(appStateAtom);
}
```

### Atom with Async
```typescript
import { atom } from 'jotai';

const userAtom = atom(async (get) => {
    const userId = get(userIdAtom);
    return fetch(`/api/users/${userId}`).then(r => r.json());
  });

function UserData() {
  const user = useAtomValue(userAtom);

  return (
    <Suspense fallback={<Text>Loading...</Text>}>
    <Text>{user.name}</Text>
    </Suspense>
);
}
```

## Integration with Features

### App Settings
```typescript
import { createAppSettings } from '@htk/features/appSettings';

const { useAppSettings, atom } = createAppSettings({
    theme: 'light',
    fontSize: 16
  });

// Uses persisted atoms internally
```

### Theme System
```typescript
import { createTheme } from '@htk/features/theme';

const { useThemeScheme } = createTheme({...});

// Theme state persisted automatically
```

## Storage Integration

### Platform-Specific Storage
```typescript
// Mobile (iOS/Android)
import { storage as mmkvStorage } from '@htk/storages/mmkv';

// Web
import { storage as localStorageAdapter } from '@htk/storages/localStorage';

// Used automatically by createPersistedState
```

### Custom Storage
```typescript
import { atomWithStorage } from 'jotai/utils';
import { storage } from '@htk/storages/mmkv';

const userAtom = atomWithStorage('user', null, storage);
```

## Performance Optimization

### Selective Subscriptions
```typescript
import { useAtomValue } from 'jotai/react';

// Only re-render when this atom changes
const status = useAtomValue(statusAtom);
```

### Memoization
```typescript
import { useMemo } from 'react';

function Component() {
  const user = useAtomValue(userAtom);

  const displayName = useMemo(
    () => `${user.first} ${user.last}`,
    [user.first, user.last]
  );

return <Text>{displayName}</Text>;
}
```

### Atom Splitting
```typescript
// Bad: Single large atom causing many re-renders
const appAtom = atom({ user, settings, ui, cache });

// Good: Split into focused atoms
const userAtom = atom({...});
const settingsAtom = atom({...});
const uiAtom = atom({...});
const cacheAtom = atom({...});
```

## Best Practices

 **Do:**
- Keep atoms focused and single-purpose
- Use derived atoms for computed values
- Leverage automatic persistence
- Split atoms by concern
- Use Suspense for async atoms
- Memoize expensive computations

 **Don't:**
- Create overly large atoms
- Mutate state directly
- Ignore persistence concerns
- Over-normalize state structure
- Use atoms for temporary UI state
- Forget about performance

## Testing State

### Testing Atoms
```typescript
import { useAtomValue, useSetAtom } from 'jotai/react';

describe('userAtom', () => {
    it('has correct initial value', () => {
        const { result } = renderHook(() => useAtomValue(userAtom));
        expect(result.current).toEqual(initialValue);
      });

  it('updates value', () => {
      const { result } = renderHook(() => ({
            value: useAtomValue(userAtom),
            set: useSetAtom(userAtom)
          }));

    act(() => {
        result.current.set(newValue);
      });

  expect(result.current.value).toEqual(newValue);
});
});
```

## Common Patterns

### Model for Complex State
```typescript
import { useAtomValue, useSetAtom } from 'jotai/react';

class UserModel {
  private setUser = useSetAtom(userAtom);
  private user = useAtomValue(userAtom);

  getName() {
    return `${this.user.first} ${this.user.last}`;
  }

updateProfile(profile) {
  this.setUser(prev => ({...prev, ...profile}));
}
}
```

### State Persistence Wrapper
```typescript
import { createPersistedState } from '@htk/states';

function usePersistedState<T>(
    key: string,
    initial: T
  ) {
  const persistedAtom = createPersistedState();
  const atom = persistedAtom(key, initial);

  return {
    value: useAtomValue(atom),
    set: useSetAtom(atom)
  };
}
```

## Debugging

### DevTools Integration
```typescript
import { useAtomValue } from 'jotai/react';

// Log atom changes (development only)
function useDebugAtom<T>(atom: Atom<T>) {
      const value = useAtomValue(atom);

      useEffect(() => {
          console.log('Atom updated:', value);
        }, [value]);

    return value;
  }
```

## Migration from Other State Systems

### From useState
```typescript
// Before: useState
const [user, setUser] = useState(null);

// After: Jotai atom
import { useAtomValue, useSetAtom } from 'jotai/react';

const userAtom = atom(null);
const user = useAtomValue(userAtom);
const setUser = useSetAtom(userAtom);
```

### From Redux
```typescript
// Redux middleware replaced with Jotai
// Actions/reducers replaced with atom factories
// Selectors replaced with derived atoms
```

## Related Documentation

### Storage
- **Storage Adapters**: [`../storages/README.md`](../storages/README.md) - Persistence layer

### Features
- **App Settings**: [`../features/appSettings/README.md`](../features/appSettings/README.md) - Uses persisted state
- **Theme System**: [`../features/theme/README.md`](../features/theme/README.md) - Uses persisted state

### External Resources
- [Jotai Documentation](https://jotai.org)
- [Jotai Utils](https://jotai.org/docs/utilities)

## Troubleshooting

### State Not Persisting
- Verify storage adapter is configured
- Check key naming is consistent
- Ensure data is serializable
- Verify storage permissions

### Re-render Performance
- Check atom splitting
- Use derived atoms for selectors
- Memoize expensive computations
- Consider useMemo for values

### Async State Issues
- Wrap with Suspense
- Handle error boundaries
- Use error atoms for failures
- Consider loading states

## Version Compatibility
- React: 17+
- Jotai: 2.0+
- React Native: 0.60+
