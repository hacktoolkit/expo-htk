# LocalStorage Adapter

## Overview
Web-based storage adapter using the browser's native `localStorage` API. This adapter provides the storage interface for web platforms and Expo web builds, ensuring data persists across browser sessions.

## Location
`storages/localStorage/`

## Purpose
Provides a storage backend for persisted state management (Jotai atoms) in web environments with:
- Browser native localStorage API
- Synchronous read/write operations
- ~5-10MB storage capacity per domain
- Simple key-value interface
- Automatic JSON serialization handling

## Installation Requirements

No additional installation required - `localStorage` is built into all modern browsers.

For Expo web support, ensure:
```bash
npx expo install expo-web
# or
npm install expo
```typescript

## Core Functionality

### Storage Interface
Implements platform-agnostic storage operations:

```typescript
interface StorageAdapter {
  getItem(key: string): string null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clearAll(): void;

}
```typescript

## API Usage

### Setting Values
```typescript
import { storage } from '@htk/storages/localStorage';

// Store a value
storage.setItem('userPreference', JSON.stringify({ theme: 'dark' }));

// Retrieve it
const saved = storage.getItem('userPreference');
const data = saved ? JSON.parse(saved) : null;
```typescript

### Integration with Jotai
```typescript
import { atomWithStorage } from 'jotai/utils';
import { localStorage } from '@htk/storages/localStorage';

// Create a persisted atom (web only)
const userThemeAtom = atomWithStorage(
  'userTheme',
  'light',
  localStorage
  );

// Use in components
function ThemeComponent() {
  const [theme, setTheme] = useAtom(userThemeAtom);
  // Theme is automatically persisted to browser localStorage

}
```typescript

### Clearing Storage
```typescript
// Remove specific item
storage.removeItem('tempData');

// Clear all stored data
storage.clearAll();
```typescript

## Browser Compatibility

 Browser Support Notes 
-------------------------
 Chrome Yes Full support 
 Firefox Yes Full support 
 Safari Yes Full support (desktop & iOS) 
 Edge Yes Full support 
 IE 8+ Yes Full support 
 Mobile Browsers Yes ~5-10MB limit 
 Private/Incognito Limited Data clears on session end 

## Storage Limits

### Typical Capacity
- Desktop browsers: 5-10MB
- Mobile browsers: 5MB
- Tablet browsers: 5-10MB

### Exceeded Quota
```typescript
try {
  storage.setItem('largeData', JSON.stringify(bigObject));
} catch (e) {
if (e instanceof DOMException && e.name === 'QuotaExceededError') {
  console.error('Storage quota exceeded');
  // Clear old data and retry, or reduce data size

}
}
```typescript

## Platform-Specific Behavior

### Web Browser
- Full read/write access
- Synchronous operations
- ℹ Shared across all tabs of same origin
- ℹ Persists across browser sessions
- No cross-origin access

### Expo Web
- Full compatibility
- Works alongside other adapters
- ℹ Same limitations as browser localStorage

### Private/Incognito Mode
- Data persists only during session
- Cleared when browser/tab closes
- May throw QuotaExceededError with small data

## Common Patterns

### Type-Safe Storage Wrapper
```typescript
interface StorageValue<T> {
    value: T;
    version: number;
    timestamp: number;
  }

export function setTypedValue<T>(
    key: string,
    value: T,
    version: number = 1
  ): void {
  const data: StorageValue<T> = {
      value,
      version,
      timestamp: Date.now()
    };
  storage.setItem(key, JSON.stringify(data));

}
export function getTypedValue<T>(key: string): T null {
    const raw = storage.getItem(key);
    if (!raw) return null;

    try {
      const data: StorageValue<T> = JSON.parse(raw);
        return data.value;
      } catch (error) {
      console.error('Failed to parse storage value:', error);
      return null;
    }

}
```typescript

### Storage Event Listener (Multi-Tab Sync)
```typescript
// Sync state across browser tabs
export function useLocalStorageSync<T>(
    key: string,
    initialValue: T
  ) {
  const [value, setValue] = useState<T>(initialValue);

    useEffect(() => {
        // Listen for changes from other tabs
        const handleStorageChange = (e: StorageEvent) => {
          if (e.key === key && e.newValue) {
            setValue(JSON.parse(e.newValue));
          }
      };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

const updateValue = useCallback((newValue: T) => {
    setValue(newValue);
    storage.setItem(key, JSON.stringify(newValue));
  }, [key]);

return [value, updateValue] as const;

}
```typescript

### Storage with Expiration
```typescript
export function setValueWithExpiry<T>(
    key: string,
    value: T,
    expiryMs: number
  ): void {
  const data = {
    value,
    expiry: Date.now() + expiryMs
  };
storage.setItem(key, JSON.stringify(data));

}
export function getValueWithExpiry<T>(key: string): T null {
    const raw = storage.getItem(key);
    if (!raw) return null;

    const { value, expiry } = JSON.parse(raw);

    if (Date.now() > expiry) {
      storage.removeItem(key);
      return null;
    }

  return value as T;

}
```typescript

## Best Practices

 **Do:**
- Check storage quota before large writes
- Handle JSON parse errors gracefully
- Use meaningful, namespaced key names
- Validate data when retrieving
- Clean up old/unused data periodically
- Consider data privacy and security
- Use consistent serialization formats

 **Don't:**
- Store unencrypted passwords or tokens
- Store entire application state in localStorage
- Exceed storage quota without handling
- Assume data exists without checking
- Store objects without serializing
- Ignore JSON parse errors
- Store sensitive user information directly

## Data Privacy & Security

### Security Considerations
- **Not encrypted**: localStorage is plain text
- **Not secure**: Vulnerable to XSS attacks
- **Shared context**: Accessible by same-origin scripts
- **Not suitable for**: Passwords, API tokens, PII

### Safe Storage Patterns
```typescript
// DON'T: Store sensitive data directly
storage.setItem('apiToken', token); // Insecure

// DO: Use secure alternatives for sensitive data
// - sessionStorage for session-only data
// - HTTP-only cookies for auth tokens
// - Encrypted storage for sensitive data
// - Consider Auth0, Firebase Auth, etc.

// Safe usage: Non-sensitive preferences
storage.setItem('userTheme', 'dark'); // Safe
storage.setItem('language', 'en'); // Safe
```typescript

## Testing

### Mock localStorage for Tests
```typescript
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
        value: localStorageMock
      });
});

afterEach(() => {
    jest.clearAllMocks();
  });
```typescript

### Test Storage Operations
```typescript
describe('localStorage operations', () => {
    it('stores and retrieves values', () => {
        storage.setItem('key', 'value');
        expect(storage.getItem('key')).toBe('value');
      });

  it('removes items', () => {
      storage.setItem('key', 'value');
      storage.removeItem('key');
      expect(storage.getItem('key')).toBeNull();
    });

it('clears all data', () => {
    storage.setItem('key1', 'value1');
    storage.setItem('key2', 'value2');
    storage.clearAll();
    expect(storage.getItem('key1')).toBeNull();
    expect(storage.getItem('key2')).toBeNull();
  });
});
```typescript

## Migration from Other Storage

### From SessionStorage
```typescript
// Migrate from sessionStorage
for (let i = 0; i < sessionStorage.length; i++) {
  const key = sessionStorage.key(i);
  if (key) {
    const value = sessionStorage.getItem(key);
    if (value) {
      storage.setItem(key, value);
    }

}
}
```typescript

## Debugging

### View All Stored Data
```typescript
export function debugStorage(): Record<string, string> {
  const data: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      data[key] = localStorage.getItem(key) '';
    }

}return data;

}
// In browser console
console.table(debugStorage());
```typescript

### Monitor Storage Changes
```typescript
window.addEventListener('storage', (e) => {
    console.log('Storage changed:', {
        key: e.key,
        oldValue: e.oldValue,
        newValue: e.newValue,
        url: e.url
      });
});
```typescript

## Common Issues

### QuotaExceededError
**Problem**: Storage quota exceeded
**Solution**:
- Reduce data size
- Clear unnecessary old data
- Implement storage cleanup strategy
- Use compression for large objects

### Data Not Persisting
**Problem**: Data clears on page reload
**Potential causes**:
- Private/Incognito mode
- localStorage disabled in browser
- Browser storage cleared
- Quotes exceeded

### Cross-Tab Synchronization
**Problem**: Changes in one tab don't reflect in another
**Solution**: Use `storage` event listener for multi-tab sync

## Browser Developer Tools

### Chrome/Firefox DevTools
1. Open DevTools (F12)
2. Go to **Application** → **Local Storage**
3. Select your domain to view all stored data
4. Edit or delete entries directly

### Clear Storage
```typescript
// In browser console
localStorage.clear();

// Or remove specific items
localStorage.removeItem('key');
```typescript

## Troubleshooting

### Storage Not Available
```typescript
const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__localStorage_test__';
    storage.setItem(test, test);
    storage.removeItem(test);
    return true;
  } catch {
  return false;

}};
```typescript

### Handling Storage Errors
```typescript
function safeSetItem(key: string, value: string): boolean {
  try {
    storage.setItem(key, value);
    return true;
  } catch (e) {
  if (e instanceof DOMException) {
    if (e.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded');
    } else if (e.name === 'SecurityError') {
    console.error('Storage access denied (private mode?)');
  }

}return false;

}
}
```

## Alternatives & Comparisons

### When to Use localStorage
- Web applications
- Non-sensitive user preferences
- Local caching of small data
- Simple state persistence

### When NOT to Use localStorage
- Sensitive data (tokens, passwords)
- Large files or datasets
- Real-time data synchronization
- Complex state management (use Redux, Zustand, etc.)

## Browser Specifications
- [MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Web Storage Standard](https://html.spec.whatwg.org/multipage/webstorage.html)
