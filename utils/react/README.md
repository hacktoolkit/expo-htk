# React Utilities

## Overview
Helper utilities and patterns for React development, specifically focused on simplifying Context API setup and management. Provides a factory function that generates provider components and hooks with minimal boilerplate.

## Location
`utils/react/`

## Purpose
Reduces boilerplate when working with React Context by:
- Automatically generating Provider components
- Creating typed hooks for context access
- Providing dispatch and update mechanisms
- Handling context error states
- Supporting partial state updates with useReducer pattern

## Core Function: contextBuilder

Generates a complete context system for managing shared state across React components.

```typescript
function contextBuilder<T>(
    defaultValue: T
  ): [IProvider<T>, IuseContext<T>, IuseContextDispatch<T>, IuseUpdate<T>]
```

**Returns Tuple:**
1. `Provider` - Context provider component
2. `useContext` - Hook to access current context value
3. `useDispatch` - Hook to access dispatch function
4. `useUpdate` - Convenience hook for updating state

## Basic Usage

### Setup Context
```typescript
import { contextBuilder } from '@htk/utils/react';

// Define state shape
type ThemeContextValue = {
  isDarkMode: boolean;
  primaryColor: string;
  fontSize: number;
};

const defaultTheme: ThemeContextValue = {
  isDarkMode: false,
  primaryColor: '#007AFF',
  fontSize: 16
};

// Create context system
const [ThemeProvider, useTheme, useThemeDispatch, useUpdateTheme] =
contextBuilder(defaultTheme);

// Export for use
export { ThemeProvider, useTheme, useThemeDispatch, useUpdateTheme };
```

### Use Provider
```typescript
import { ThemeProvider } from '@/context/theme';

export function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );

}
```

### Access Context
```typescript
import { useTheme, useUpdateTheme } from '@/context/theme';

function ThemeToggle() {
  const theme = useTheme();
  const updateTheme = useUpdateTheme();

  const toggleDarkMode = () => {
    updateTheme({
        isDarkMode: !theme.isDarkMode
      });
};

return (
  <View style={{
      backgroundColor: theme.isDarkMode ? '#000' : '#fff'
    }}>
<Button
  title={`Dark Mode: ${theme.isDarkMode ? 'ON' : 'OFF'}`}
  onPress={toggleDarkMode}
/>
  </View>
  );

}
```

## Advanced Patterns

### Multiple Context Values
```typescript
type AppContextValue = {
  user: User null;
  isLoading: boolean;
  error: string null;
  preferences: UserPreferences;
  isOnline: boolean;
};

const defaultAppContext: AppContextValue = {
  user: null,
  isLoading: false,
  error: null,
  preferences: {
    language: 'en',
    notifications: true
  },
isOnline: true
};

const [AppProvider, useApp, useAppDispatch, useUpdateApp] =
contextBuilder(defaultAppContext);
```

### Context with Dispatch Hook
```typescript
import { useAppDispatch } from '@/context/app';

function UserSettings() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    // Full control over dispatch with custom actions
    dispatch({
        type: 'RESET' // Resets to default value
      });
};

return (
  <Button title="Logout" onPress={handleLogout} />
  );

}
```

### Combined Update Patterns
```typescript
import { useApp, useUpdateApp } from '@/context/app';

function UserProfile() {
  const { user, preferences } = useApp();
  const updateApp = useUpdateApp();

  // Update single property
  const updateLanguage = (lang: string) => {
    updateApp({
        preferences: {
          ...preferences,
          language: lang
        }
    });
};

// Update multiple properties
const onUserDataFetched = (userData: User) => {
  updateApp({
      user: userData,
      isLoading: false,
      error: null
    });
};

const onLoadingStart = () => {
  updateApp({ isLoading: true });
};

const onError = (error: string) => {
  updateApp({
      error,
      isLoading: false
    });
};

return (
  <View>
    <Text>{user?.name}</Text>
  </View>
  );

}
```

## Real-World Examples

### Authentication Context
```typescript
import { contextBuilder } from '@htk/utils/react';

type AuthContextValue = {
  isAuthenticated: boolean;
  user: User null;
  token: string null;
  isLoading: boolean;
};

const [AuthProvider, useAuth, useAuthDispatch, useUpdateAuth] = contextBuilder<AuthContextValue>({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false
    });

// Custom hook for login
function useLogin() {
  const updateAuth = useUpdateAuth();

  return async (email: string, password: string) => {
    updateAuth({ isLoading: true });

    try {
      const response = await loginAPI(email, password);

      updateAuth({
          isAuthenticated: true,
          user: response.user,
          token: response.token,
          isLoading: false
        });
  } catch (error) {
  updateAuth({
      isLoading: false
    });
throw error;

}};

}
```

### Notification Center
```typescript
type NotificationContextValue = {
  notifications: Notification[];
  unreadCount: number;
};

const [NotificationProvider, useNotifications, , useUpdateNotifications] =
contextBuilder({
    notifications: [],
    unreadCount: 0
  });

function useAddNotification() {
  const { notifications, unreadCount } = useNotifications();
  const updateNotifications = useUpdateNotifications();

  return (notification: Notification) => {
    updateNotifications({
        notifications: [...notifications, notification],
        unreadCount: unreadCount + 1
      });
};

}
function useClearNotifications() {
  const updateNotifications = useUpdateNotifications();

  return () => {
    updateNotifications({
        notifications: [],
        unreadCount: 0
      });
};

}
```

### Form State Management
```typescript
type FormContextValue = {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
};

const [FormProvider, useFormState, , useUpdateFormState] = contextBuilder({
    values: {},
    errors: {},
    touched: {},
    isSubmitting: false
  });

function useFormField(fieldName: string) {
  const { values, errors, touched } = useFormState();
  const updateForm = useUpdateFormState();

  return {
    value: values[fieldName] ?? '',
    error: touched[fieldName] ? errors[fieldName] : null,
    setValue: (value: any) => {
      updateForm({
          values: {
            ...values,
            [fieldName]: value
          },
        touched: {
          ...touched,
          [fieldName]: true
        }
    });

}};

}
```

## API Reference

### Provider Component
```typescript
<Provider value?: Partial<T>>
  {children: ReactNode}
</Provider>
```

**Props:**
- `value` (optional): Partial state to override defaults
- `children`: React components to wrap

**Example:**
```typescript
<ThemeProvider value={{ isDarkMode: true }}>
  <App />
</ThemeProvider>
```

### useContext Hook
```typescript
const state = useContext(): T
```

**Returns:** Complete context state object

**Throws:** Error if used outside Provider

**Example:**
```typescript
const { isDarkMode } = useTheme();
```

### useDispatch Hook
```typescript
const dispatch = useDispatch(): Dispatch<ContextAction<T>>
```

**Returns:** Dispatch function

**Dispatch Actions:**
- `{ type: 'UPDATE', payload: Partial<T> }` - Merge partial state
- `{ type: 'RESET' }` - Reset to default value

**Throws:** Error if used outside Provider

### useUpdate Hook
```typescript
const update = useUpdate(): (payload: Partial<T>) => void
```

**Returns:** Update function that dispatches UPDATE action

**Most Convenient:** Use this for simple state updates

## Type Safety

### Full TypeScript Support
```typescript
const [Provider, useContext, useDispatch, useUpdate] = contextBuilder({
    count: 0,
    name: 'app'
  });

function Component() {
  const { count, name } = useContext(); // Fully typed
  const update = useUpdate();

  update({ count: 1 }); // Valid
  update({ name: 'new-app' }); // Valid
  update({ invalid: true }); // TypeScript error

}
```

## Advanced Patterns

### Computed Context Values
```typescript
const [Provider, useAuth, , useUpdateAuth] = contextBuilder({
    firstName: '',
    lastName: '',
    email: ''
  });

// Custom hook for derived values
function useFullName() {
  const { firstName, lastName } = useAuth();
  return `${firstName} ${lastName}`.trim();

}
function useInitials() {
  const { firstName, lastName } = useAuth();
  return `${firstName[0]}${lastName[0]}`.toUpperCase();

}
```

### Context Composition
```typescript
function ComposedProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );

}
```

### Custom Hooks wrapping Context
```typescript
function useThemeMode() {
  const { isDarkMode } = useTheme();
  const updateTheme = useUpdateTheme();

  return {
    isDark: isDarkMode,
    toggle: () => updateTheme({ isDarkMode: !isDarkMode }),
    setMode: (dark: boolean) => updateTheme({ isDarkMode: dark })
  };

}
// Usage
function Component() {
  const theme = useThemeMode();

  return (
    <Button
      title={theme.isDark ? '' : ''}
      onPress={theme.toggle}
    />
  );

}
```

## React Context vs Alternatives

 Tool Best For Complexity 
---------------------------
 contextBuilder Simple to medium app state Low 
 Redux Large, complex state High 
 Zustand Medium state, simple API Low 
 Jotai Atomic state Medium 
 Recoil Large React app state High 

## Performance Considerations

### Avoid Unnecessary Re-renders
```typescript
// Only context value changes trigger re-render
const contextValue = useMemo(() => ({ ...state }), [state]);

// Provider already uses useMemo internally
```

### Memoize Consumer Components
```typescript
const ConsumerComponent = React.memo(({ value }: { value: T }) => {
    return <Text>{value.name}</Text>;
  });
```

### Separate Contexts by Update Frequency
```typescript
// Slow-changing
const [ThemeProvider, useTheme] = contextBuilder(defaultTheme);

// Fast-changing (separate for better performance)
const [AnimationProvider, useAnimation] = contextBuilder(defaultAnimation);
```

## Best Practices

 **Do:**
- Use multiple contexts for different concerns
- Memoize custom hooks that use context
- Provide only necessary context data
- Use useUpdate for simple state changes
- Create custom hooks wrapping context usage
- Document context shape clearly
- Use default values appropriately

 **Don't:**
- Put everything in one large context
- Ignore performance with large state objects
- Use context for very high-frequency updates
- Forget to wrap with Provider
- Hardcode context creation without factory
- Update entire context when only part changes

## Testing

### Testing Components Using Context
```typescript
describe('ThemeToggle', () => {
    it('toggles dark mode', () => {
        const { getByRole } = render(
          <ThemeProvider>
            <ThemeToggle />
          </ThemeProvider>
    );

  const button = getByRole('button');
  fireEvent.press(button);

  expect(button).toHaveTextContent('ON');
});
});
```

### Mocking Context in Tests
```typescript
const mockContext = {
  isDarkMode: true,
  primaryColor: '#000'
};

const MockProvider = ({ children }: { children: ReactNode }) => (
  <ThemeProvider value={mockContext}>
    {children}
  </ThemeProvider>
  );
```

## Troubleshooting

### "Context must be used within Provider" Error
**Cause:** Hook called outside Provider component

**Solution:**
```typescript
// Wrong
function App() {
  const context = useTheme(); // Error!

}
// Correct
function App() {
  return (
    <ThemeProvider>
      <Child />
    </ThemeProvider>
  );

}
function Child() {
  const context = useTheme(); // OK

}
```

### State Not Updating
**Cause:** May be passing immutable update

**Solution:**
```typescript
// Create new object
updateTheme({
    preferences: {
      ...preferences,
      language: 'en'
    }
});
```

### Unnecessary Re-renders
**Cause:** Context consumers re-render when context changes

**Solution:**
- Memoize consumer components
- Split context by update frequency
- Use useCallback for stable callbacks

## Advanced Techniques

### Reset Context State
```typescript
function useReset() {
  const dispatch = useAuthDispatch();

  return () => {
    dispatch({ type: 'RESET' });
  };

}
```

### Context Middleware Pattern
```typescript
function createMiddlewareContext<T>(defaultValue: T) {
    const [Provider, useContext, useDispatch, useUpdate] = contextBuilder(defaultValue);

    const useWithMiddleware = (middleware: (action: any) => any) => {
      const dispatch = useDispatch();

      return (action: any) => {
        const processed = middleware(action);
        dispatch(processed);
      };
  };

return [Provider, useContext, useDispatch, useUpdate, useWithMiddleware] as const;

}
```
