# Storage Adapters

## Overview
Platform-agnostic storage layer providing consistent interfaces for different storage backends. Automatically selects the optimal storage for each platform (MMKV for mobile, localStorage for web).

## Location
`storages/`

## Purpose
Provides:
- Unified storage interface across platforms
- Platform-specific implementations
- Automatic platform detection
- Type-safe storage operations

## Storage Adapters

### MMKV Storage
High-performance storage for mobile platforms (iOS/Android).

**Location:** [`mmkv/README.md`](mmkv/README.md)

**Best For:**
- Mobile applications
- Frequent read/write operations
- Large data volumes
- Sensitive data (encryption support)

**Features:**
- Fastest performance
- Built-in encryption
- Synchronous access
- Memory-mapped files

**Quick Usage:**
```typescript
import { storage } from '@htk/storages/mmkv';

storage.setItem('key', JSON.stringify(value));
const value = JSON.parse(storage.getItem('key') '{}');
```

### LocalStorage Adapter
Browser-native storage for web platforms.

**Location:** [`localStorage/README.md`](localStorage/README.md)

**Best For:**
- Web applications
- Expo web builds
- Non-sensitive preferences
- Cross-tab synchronization

**Features:**
- Browser native
- Cross-tab support
- Simple API
- Developer tools integration

**Quick Usage:**
```typescript
import { storage } from '@htk/storages/localStorage';

storage.setItem('key', JSON.stringify(value));
const value = JSON.parse(storage.getItem('key') '{}');
```

## Architecture

```typescript
storages/
├── mmkv/ # MMKV storage adapter
│ ├── state.ts # MMKV implementation
│ └── README.md # Documentation
├── localStorage/ # LocalStorage adapter
│ ├── state.ts # LocalStorage implementation
│ └── README.md # Documentation
└── README.md # This file
```

## Storage Interface

All adapters implement a common interface:

```typescript
interface StorageAdapter {
  getItem(key: string): string null Promise<string null>;
  setItem(key: string, value: string): void Promise<void>;
  removeItem(key: string): void Promise<void>;
  clearAll(): void Promise<void>;

}
```

## Platform Selection

The storage system automatically selects appropriate storage:

```typescript
Platform Detection
↓
Mobile (iOS/Android) → MMKV
↓
Web → localStorage
```

## Common Patterns

### Basic Storage Usage
```typescript
import { storage } from '@htk/storages/mmkv';

// Store data
const data = { name: 'John', age: 30 };
storage.setItem('user', JSON.stringify(data));

// Retrieve data
const stored = storage.getItem('user');
const user = stored ? JSON.parse(stored) : null;

// Remove data
storage.removeItem('user');

// Clear all
storage.clearAll();
```

### Type-Safe Storage
```typescript
function useStoredValue<T>(key: string, initial: T) {
    const [value, setValue] = useState<T>(() => {
          const stored = storage.getItem(key);
          return stored ? JSON.parse(stored) : initial;
        });

    const updateValue = useCallback((newValue: T) => {
        setValue(newValue);
        storage.setItem(key, JSON.stringify(newValue));
      }, [key]);

  return [value, updateValue] as const;

}
```

### Storage with Expiration
```typescript
function setWithExpiry<T>(
    key: string,
    value: T,
    ttlMs: number
  ) {
  const data = {
    value,
    expiry: Date.now() + ttlMs
  };
storage.setItem(key, JSON.stringify(data));

}
function getWithExpiry<T>(key: string): T null {
    const stored = storage.getItem(key);
    if (!stored) return null;

    const { value, expiry } = JSON.parse(stored);

    if (Date.now() > expiry) {
      storage.removeItem(key);
      return null;
    }

  return value;

}
```

### Backup and Restore
```typescript
function backupStorage() {
  const backup: Record<string, string> = {};

  // Manually collect all keys (implementation varies by adapter)
  // For MMKV: iterate stored keys
  // For localStorage: use localStorage iteration

  return JSON.stringify(backup);

}
function restoreStorage(backup: string) {
  const data = JSON.parse(backup);

  Object.entries(data).forEach(([key, value]) => {
      storage.setItem(key, value as string);
    });

}
```

## Comparison

 Feature MMKV LocalStorage 
-----------------------------
 Performance ⭐⭐⭐ Fastest ⭐⭐ Moderate 
 Mobile Support Yes Limited 
 Web Support No Yes 
 Encryption Built-in No 
 Storage Limit 64MB (configurable) 5-10MB 
 Synchronous Yes Yes 
 API Simplicity ⭐⭐⭐ Simple ⭐⭐⭐ Simple 

## Selection Guide

### Use MMKV When:
- Building mobile app (React Native)
- Need high performance
- Storing sensitive data
- Dealing with large data volumes
- Using Expo mobile builds

### Use LocalStorage When:
- Building web app
- Using Expo web builds
- Simple data storage
- Cross-tab synchronization needed
- Target browser support

## Migration Between Adapters

### From localStorage to MMKV
```typescript
// Read from localStorage
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key) {
    const value = localStorage.getItem(key);
    if (value) {
      mmkvStorage.setItem(key, value);
    }

}
}
// Clear localStorage
localStorage.clear();
```

## Best Practices

 **Do:**
- Serialize objects before storing
- Use consistent key naming
- Validate retrieved data
- Handle missing keys gracefully
- Keep storage data serializable
- Use storage for persistent user preferences

 **Don't:**
- Store unencrypted sensitive data
- Assume data exists without checking
- Store very large objects (>100MB)
- Use storage for temporary runtime data
- Forget to deserialize JSON
- Ignore storage quota errors

## Error Handling

### Storage Not Available
```typescript
function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    storage.setItem(test, test);
    storage.removeItem(test);
    return true;
  } catch {
  return false;

}
}
```

### Quota Exceeded
```typescript
try {
  storage.setItem('large_data', largeValue);
} catch (error: any) {
if (error.name === 'QuotaExceededError') {
  // Clear old data and retry
  cleanupOldData();

}
}
```

## Testing Storage

### Mock Storage for Tests
```typescript
const mockStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clearAll: jest.fn()
};

beforeEach(() => {
    jest.clearAllMocks();
  });
```

## Security Considerations

### Sensitive Data
```typescript
// Don't store unencrypted
storage.setItem('password', password);

// Do encrypt or use alternatives
// Consider: secure enclaves, keychain, etc.
```

### MMKV Encryption
```typescript
import { MMKVLoader } from 'react-native-mmkv';

const storage = new MMKVLoader()
.setEncryptionKey('your-encryption-key')
.build();
```

### Storage Adapters
- **MMKV**: [`mmkv/README.md`](mmkv/README.md) - Mobile storage
- **LocalStorage**: [`localStorage/README.md`](localStorage/README.md) - Web storage

### Integration
- **App Settings**: [`../features/appSettings/README.md`](../features/appSettings/README.md) - Settings system

## Troubleshooting

### Data Not Persisting
- Check storage permissions
- Verify data is serializable
- Check storage quota
- Ensure storage is initialized

### Storage Errors
- Verify adapter for current platform
- Check error messages in console
- Ensure key is string
- Validate value is serializable

### Performance Issues
- Don't store extremely large objects
- Batch update operations
- Consider splitting large data
- Use appropriate adapter for platform

## Version Compatibility
- React Native: 0.60+
- Expo: SDK 40+
- react-native-mmkv: 2.0+
