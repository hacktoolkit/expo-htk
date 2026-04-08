# MMKV Storage Adapter

## Overview
High-performance storage adapter using MMKV (Memory-Mapped Key-Value) for React Native applications. MMKV provides extremely fast read/write operations and is significantly more efficient than AsyncStorage or other storage solutions.

## Location
`storages/mmkv/`

## Purpose
Provides a storage backend for persisted state management (Jotai atoms) with:
- Fast synchronous and asynchronous operations
- Minimal memory footprint
- Automatic encryption (optional)
- Thread-safe operations
- Ideal for storing user settings, preferences, and cache

## Why MMKV?

 Feature MMKV AsyncStorage SQLite 
-------------------------------------
 Performance Fastest Slow Medium 
 Memory Usage Minimal High Medium 
 Encryption Built-in No Yes 
 Synchronous Yes No No 
 Size Limit Configurable Limited Large 

## Installation Requirements

Before using MMKV storage, ensure the dependency is installed:

```bash
npm install react-native-mmkv
# or
yarn add react-native-mmkv
# or for Expo
expo install react-native-mmkv
```typescript

## Files Included

 File Purpose 
---------------
 `state.ts` State storage implementation and MMKV instance setup 

## Core Functionality

### MMKV Instance
```typescript
import { MMKVLoader } from 'react-native-mmkv';

// Configured MMKV instance with optional encryption
const storage = new MMKVLoader()
.setProcessingMode(MMKVMode.SINGLE_PROCESS)
.build();
```typescript

### Storage Interface
Implements platform-agnostic storage operations:

```typescript
interface StorageAdapter {
  getItem(key: string): string null Promise<string null>;
  setItem(key: string, value: string): void Promise<void>;
  removeItem(key: string): void Promise<void>;
  clearAll(): void Promise<void>;
}
```typescript

## API Usage

### Setting Values
```typescript
import { storage } from '@htk/storages/mmkv';

// Store a value
storage.setItem('userPreference', JSON.stringify({ theme: 'dark' }));

// Retrieve it
const saved = storage.getItem('userPreference');
const data = saved ? JSON.parse(saved) : null;
```typescript

### Integration with Jotai
```typescript
import { atomWithStorage } from 'jotai/utils';
import { mmkvStorage } from '@htk/storages/mmkv';

// Create a persisted atom
const userThemeAtom = atomWithStorage(
  'userTheme',
  'light',
  mmkvStorage
);

// Use in components
function ThemeComponent() {
  const [theme, setTheme] = useAtom(userThemeAtom);
  // Theme is automatically persisted to MMKV
}
```typescript

### Clearing Storage
```typescript
// Remove specific item
storage.removeItem('tempData');

// Clear all stored data
storage.clearAll();
```typescript

## Performance Characteristics

### Read Performance
- **Initial read**: ~1-5ms (regardless of data size)
- **Subsequent reads**: <1ms (memory-mapped)
- **No serialization overhead** for native reads

### Write Performance
- **Write operation**: 5-20ms typical
- **Asynchronous writes**: Non-blocking
- **Batch operations**: Optimized for multiple writes

### Memory Footprint
- **Base overhead**: ~2MB for MMKV instance
- **Per-item cost**: Minimal (memory-mapped)
- **Total size**: Configurable, default 64MB

## Advanced Configuration

### Custom MMKV Instance
```typescript
import { MMKVLoader, MMKVMode } from 'react-native-mmkv';

const customStorage = new MMKVLoader()
.setProcessingMode(MMKVMode.SINGLE_PROCESS)
.setEncryptionKey('your-encryption-key') // Enable encryption
.build();
```typescript

### With Encryption
```typescript
// Production setup with encryption
const storage = new MMKVLoader()
.setEncryptionKey(getSecureEncryptionKey())
.build();

// Secure sensitive data
storage.setItem('apiToken', secureToken);
storage.setItem('password', encryptedPassword);
```typescript

## Common Patterns

### Type-Safe Storage Wrapper
```typescript
interface StorageValue<T> {
    value: T;
    timestamp: number;
  }

export function setTypedValue<T>(
    key: string,
    value: T
  ): void {
  const data: StorageValue<T> = {
      value,
      timestamp: Date.now()
    };
  storage.setItem(key, JSON.stringify(data));
}

export function getTypedValue<T>(key: string): T null {
    const raw = storage.getItem(key);
    if (!raw) return null;

    const data: StorageValue<T> = JSON.parse(raw);
      return data.value;
    }
```typescript

### Persisted State Hook
```typescript
import { useCallback } from 'react';

function useStoredValue<T>(key: string, initialValue: T) {
    const [value, setValue] = useState<T>(() => {
          const stored = storage.getItem(key);
          return stored ? JSON.parse(stored) : initialValue;
        });

    const updateValue = useCallback((newValue: T ((prev: T) => T)) => {
        setValue(prev => {
            const updated = typeof newValue === 'function'
            ? newValue(prev)
            : newValue;
            storage.setItem(key, JSON.stringify(updated));
            return updated;
          });
    }, [key]);

return [value, updateValue] as const;
}
```typescript

## Platform Support

### iOS
- Full support
- Encryption available
- iCloud sync optional
- Performance optimized

### Android
- Full support
- Encryption available
- Multi-process mode available
- Content protection options

### Web
- Limited support (may fall back to localStorage)
- No encryption in web build
- ℹ For web, use localStorage adapter instead

## Data Persistence

### Storage Location

**iOS:**
```
~/Library/Caches/com.yourapp/mmkv
```typescript

**Android:**
```
/data/data/com.yourapp/mmkv
```typescript

### Backup & Restore
```typescript
// Backup all data
function backupStorage() {
  const allData = getAllStoredItems();
  return JSON.stringify(allData);
}

// Restore from backup
function restoreStorage(backup: string) {
  const data = JSON.parse(backup);
  Object.entries(data).forEach(([key, value]) => {
      storage.setItem(key, value as string);
    });
}
```typescript

## Error Handling

```typescript
try {
  const value = storage.getItem('important');
  if (value) {
    processData(JSON.parse(value));
  }
} catch (error) {
console.error('Storage access failed:', error);
// Fall back to default value
return defaultValue;
}
```typescript

## Migration from Other Storage

### From AsyncStorage
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage as mmkvStorage } from '@htk/storages/mmkv';

async function migrateFromAsyncStorage() {
  const keys = await AsyncStorage.getAllKeys();

  for (const key of keys) {
    const value = await AsyncStorage.getItem(key);
    if (value) {
      mmkvStorage.setItem(key, value);
    }
}
}
```typescript

## Testing

### Mock MMKV for Tests
```typescript
jest.mock('react-native-mmkv', () => ({
      MMKVLoader: jest.fn(() => ({
            setProcessingMode: jest.fn().mockReturnThis(),
            build: jest.fn(() => ({
                  getItem: jest.fn(),
                  setItem: jest.fn(),
                  removeItem: jest.fn(),
                  clearAll: jest.fn(),
                })),
        })),
}));
```

## Best Practices

 **Do:**
- Use MMKV for frequently accessed data
- Serialize complex objects before storing
- Handle JSON parse errors gracefully
- Keep key names consistent
- Use encryption for sensitive data
- Batch related updates together

 **Don't:**
- Store extremely large objects (>100KB)
- Use synchronous access in tight loops
- Store unencrypted sensitive information
- Assume data survives app uninstall
- Forget to stringify objects before storing

## Related Documentation
- **Storages**: [`../README.md`](../README.md) - Storage adapter overview
- **States**: [`../../states/README.md`](../../states/README.md) - State management
- **Persisted State**: [`../../states/persisted.ts`](../../states/persisted.ts) - Jotai integration

## Troubleshooting

### Data Not Persisting
- Ensure storage is properly initialized
- Check file system permissions
- Verify MMKV module is linked correctly

### Performance Issues
- Don't store files > 100MB
- Use batch operations for multiple updates
- Consider using different MMKV instances for different data domains

### Encryption Problems
- Ensure encryption key is consistent across sessions
- Store encryption key securely (not hardcoded)
- Use platform-specific secure storage for key management

## Version Compatibility
- React Native: 0.60+
- Expo: SDK 40+
- MMKV: 2.0+
