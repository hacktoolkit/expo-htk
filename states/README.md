# Persisted State

## Overview
Factory for creating platform-aware persisted state atoms. Provides a simple API to create state that automatically persists to the appropriate storage backend (MMKV on mobile, localStorage on web).

## Location
`states/`

## Purpose
Provides:
- Automatic state persistence across app sessions
- Platform detection for correct storage selection
- Type-safe state creation with Jotai atoms
- Simplified factory pattern for common use case
- Cross-platform state management

## Core Concept

The states folder bridges state management and storage layers by providing a factory function that:
1. Detects the current platform (iOS/Android vs web)
2. Selects the appropriate storage backend
3. Creates a Jotai atom with automatic persistence
4. Returns a reusable persisted state atom

## API

### createPersistedState()

Factory function for creating persisted atoms.

```typescript
function createPersistedState(configuration?: MMKVConfiguration) {
  return <T>(key: string, initialValue: T) => Atom<T>

}
```

**Parameters:**
- `configuration` - Optional MMKV configuration (mobile only)

**Returns:**
- Factory function that creates persisted atoms

**Platform Detection:**
- Web: Uses browser localStorage
- iOS/Android: Uses MMKV with optional configuration

## Quick Start

### 1. Create Persisted State Factory

```typescript
import { createPersistedState } from '@htk/states';

const persistedAtom = createPersistedState();
```

### 2. Create Persisted Atoms

```typescript
// Simple value
const userAtom = persistedAtom('currentUser', {
  id: '',
  name: '',
  email: ''
});

// Complex object
const settingsAtom = persistedAtom('appSettings', {
  theme: 'light',
  fontSize: 16,
  notifications: true
});
```

### 3. Use in Components

```typescript
import { useAtomValue, useSetAtom } from 'jotai/react';

function UserProfile() {
  const user = useAtomValue(userAtom);
  const setUser = useSetAtom(userAtom);

  return (
    <View>
      <Text>{user.name}</Text>
      <Button
        onPress={() => setUser({ ...user, name: 'Updated' })}
        title="Update Name"
      />
    </View>
  );

}
```

## Usage Patterns

### Application State

```typescript
const persistedAtom = createPersistedState();

const appStateAtom = persistedAtom('appState', {
  isLoggedIn: false,
  userId: null,
  theme: 'light',
  lastSyncTime: null
});

function App() {
  const [appState, setAppState] = useAtom(appStateAtom);

  const handleLogin = async (credentials) => {
    const result = await authenticateUser(credentials);
    setAppState(prev => ({
      ...prev,
      isLoggedIn: true,
      userId: result.id,
      lastSyncTime: Date.now()
    }));
  };

  return <AppContent />;

}
```

### User Preferences

```typescript
const userPreferencesAtom = persistedAtom('userPreferences', {
  language: 'en',
  accessibility: {
    fontSize: 16,
    highContrast: false,
    screenReaderEnabled: false
  },
  notifications: {
    push: true,
    email: true,
    sms: false
  }
});

function Settings() {
  const [preferences, setPreferences] = useAtom(userPreferencesAtom);

  const updateLanguage = (lang) => {
    setPreferences(prev => ({
      ...prev,
      language: lang
    }));
  };

  return <SettingsUI onLanguageChange={updateLanguage} />;

}
```

### Feature-Specific State

```typescript
const cacheAtom = persistedAtom('apiCache', {
  users: [],
  products: [],
  lastUpdated: null,
  cacheVersion: 1
});

const filterAtom = persistedAtom('uiFilters', {
  category: 'all',
  sortBy: 'newest',
  priceRange: [0, 1000]
});
```

## Integration with Features

The states folder is designed to work with feature modules that need persistent state:

### App Settings
```typescript
// features/appSettings/index.ts
const settingsAtom = createPersistedState();
const appSettingsAtom = settingsAtom('appSettings', defaultSettings);
```

### Theme System
```typescript
// features/theme/index.tsx
const themeAtom = createPersistedState();
const currentThemeAtom = themeAtom('theme', {
  scheme: 'light',
  ignoreSystemMode: false
});
```

## Storage Layer Integration

The states folder uses the storage layer from `@htk/storages` for platform-aware persistence. The appropriate storage (MMKV for mobile, localStorage for web) is automatically selected based on the platform at runtime.

**Learn more:**
- **Platform Detection**: See [`storages/README.md#platform-selection`](../storages/README.md#platform-selection)
- **MMKV Details**: See [`storages/mmkv/README.md`](../storages/mmkv/README.md)
- **localStorage Details**: See [`storages/localStorage/README.md`](../storages/localStorage/README.md)

## Performance Considerations

### Memory Usage
- Each persisted atom: ~1KB baseline
- Data size: Depends on stored object size
- Multiple atoms: Independent, no shared overhead

### Sync Frequency
- Automatic on every state change
- Optimized for typical app usage patterns
- Consider batching updates for high-frequency changes

### Initial Load
- First read: Storage lookup (~1-5ms on mobile, <1ms on web)
- Subsequent reads: Memory-cached via Jotai

## Best Practices

**Do:**
- Use for user preferences and application state
- Keep stored state serializable (JSON)
- Use descriptive key names
- Initialize with sensible defaults
- Validate state when restoring

**Don't:**
- Store authentication tokens unencrypted
- Persist very large objects (>1MB)
- Use for temporary UI state
- Store unserializable objects (Functions, Dates, etc.)
- Assume data exists without checking

## Error Handling

### Graceful Degradation

```typescript
const preferenceAtom = createPersistedState();
const userPrefsAtom = preferenceAtom('userPrefs', {
  theme: 'light',
  fontSize: 16
});

function Settings() {
  try {
    const prefs = useAtomValue(userPrefsAtom);
    return <SettingsUI prefs={prefs} />;
  } catch (error) {
    console.error('Failed to load preferences:', error);
    // Falls back to default values provided to createPersistedState
    return <SettingsUI prefs={defaultPrefs} />;
  }

}
```

### Validation

```typescript
function validateState(state) {
  if (!state || typeof state !== 'object') return false;
  if (!state.id || typeof state.id !== 'string') return false;
  if (!state.email || !isValidEmail(state.email)) return false;
  return true;

}
const userAtom = createPersistedState();
const savedUserAtom = userAtom('user', {
  id: '',
  email: '',
  name: 'Guest'
});

function UserComponent() {
  const [user, setUser] = useAtom(savedUserAtom);

  useEffect(() => {
    if (!validateState(user)) {
      setUser({ id: '', email: '', name: 'Guest' });
    }
  }, []);

  return <UserView user={user} />;

}
```

## Migration Between Platforms

### From localStorage to MMKV

When migrating from web-only to cross-platform:

```typescript
// 1. Check if old localStorage data exists
const oldData = localStorage.getItem('userPrefs');

// 2. Use createPersistedState which handles platform detection
const prefsAtom = createPersistedState();
const prefAtom = prefsAtom('userPrefs', oldData ? JSON.parse(oldData) : defaults);

// 3. Data is now stored using the correct platform adapter
```

## Testing

### Mock State for Tests

```typescript
import { useAtomValue, useSetAtom } from 'jotai/react';

describe('UserProfile', () => {
  it('displays user information', () => {
    const mockUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com'
    };

    const userAtom = atom(mockUser);

    const { getByText } = render(
      <Provider initialValues={[[userAtom, mockUser]]}>
        <UserProfile />
      </Provider>
    );

    expect(getByText('Test User')).toBeTruthy();
  });
});
```

### Storage Layer
- **MMKV Storage**: [`../storages/mmkv/README.md`](../storages/mmkv/README.md) - Mobile storage implementation
- **localStorage**: [`../storages/localStorage/README.md`](../storages/localStorage/README.md) - Web storage implementation
- **Storage Adapters**: [`../storages/README.md`](../storages/README.md) - Storage layer overview

### Feature Examples
- **App Settings**: [`../features/appSettings/README.md`](../features/appSettings/README.md) - Uses persisted state
- **Theme System**: [`../features/theme/README.md`](../features/theme/README.md) - Uses persisted state

## Troubleshooting

### State Not Persisting

**Check:**
- Platform is correctly detected
- Storage permissions are granted
- Data is JSON serializable
- Key name is consistent

**Debug:**
```typescript
import { Platform } from 'react-native';

console.log('Current platform:', Platform.OS);
// Should log: 'ios', 'android', or 'web'

const atom = createPersistedState();
// Verify factory is created correctly
```

### Lost Data After App Restart

**Possible Causes:**
- App was uninstalled (storage cleared by OS)
- Storage quota exceeded
- Serialization failed
- Invalid/corrupted data

**Prevention:**
```typescript
// Always provide sensible defaults
const stateAtom = createPersistedState();
const myAtom = stateAtom('key', {
  // These defaults are used if storage fails
  status: 'default',
  data: null
});
```

### Different Data on Different Platforms

**Cause:** MMKV and localStorage are separate storage systems

**Solution:** Design state to be platform-agnostic or handle platform-specific state separately

## Version Compatibility
- Jotai: 2.0+
- React Native: 0.60+
- Expo: SDK 40+
- react-native-mmkv: 2.0+
