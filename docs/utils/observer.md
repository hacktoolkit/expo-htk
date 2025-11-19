# Observer Pattern Utilities

## Overview
Implementation of the classic Observer design pattern with strong TypeScript support. Provides two variants: a basic event observer for application-wide events and an entity-scoped observer for tracking changes to specific entities.

## Location
`utils/observer/`

## Purpose
Enables publish-subscribe event handling throughout the application:
- Decouple event producers from consumers
- React to state changes and events
- Manage complex asynchronous interactions
- Implement reactive patterns without adding dependencies

## Files Included

 File Purpose 
---------------
 `index.ts` Observer and EntityObserver classes 

## Core Classes

### Observer
Generic observer for event-driven communication with global event scope.

```typescript
class Observer<
Data extends Record<string, any>,
Event extends string = string
>
```

**Type Parameters:**
- `Data`: Shape of data passed to observers
- `Event`: Union of event names (string literal)

### EntityObserver
Specialized observer for tracking changes to specific entities or resources.

```typescript
class EntityObserver<
Data extends Record<string, any>,
Event extends string = string
>
```

**Type Parameters:**
- `Data`: Shape of data passed to observers
- `Event`: Union of event names
- Includes `entity` parameter for scoped tracking

## Basic Observer Usage

### Setup
```typescript
import { Observer } from '@htk/utils/observer';

type UserData = { userId: string; name: string; email: string };
type UserEvent = 'updated' 'deleted' 'created';

const userObserver = new Observer<UserData, UserEvent>();
```

### Subscribe to Events
```typescript
// Subscribe to specific event
const unsubscribe = userObserver.subscribe('updated', (data, event) => {
    console.log(`User updated: ${data.name}`);
  });

// Unsubscribe when done
unsubscribe();

// Or manually unsubscribe
userObserver.unsubscribe('updated', callback);
```

### Publish Events
```typescript
userObserver.notify('updated', {
    userId: '123',
    name: 'John Doe',
    email: 'john@example.com'
  });
```

### Listen to All Events
```typescript
// Subscribe to all events on the observer
userObserver.subscribe('all', (data, event) => {
    console.log(`Event "${event}" occurred:`, data);
  });
```

## Entity Observer Usage

### Setup
```typescript
import { EntityObserver } from '@htk/utils/observer';

type DocumentData = { content: string; version: number };
type DocumentEvent = 'saved' 'deleted' 'shared';

const documentObserver = new EntityObserver<DocumentData, DocumentEvent>();
```

### Subscribe to Entity Events
```typescript
// Listen for changes to specific document
documentObserver.subscribe('doc-123', 'saved', (data) => {
    console.log('Document doc-123 was saved');
  });

// Listen for all events on specific entity
documentObserver.subscribe('doc-456', 'all', (data, event) => {
    console.log(`Document doc-456 had event: ${event}`);
  });

// Auto-unsubscribe
const unsubscribe = documentObserver.subscribe('doc-789', 'deleted', () => {
    console.log('Document deleted');
  });
```

### Publish Entity Events
```typescript
documentObserver.notify('doc-123', 'saved', {
    content: 'Updated content',
    version: 2
  });
```

## Real-World Examples

### User Authentication Observer
```typescript
import { Observer } from '@htk/utils/observer';

type AuthData = {
  userId: string;
  token: string;
  expiresAt: number;
};

type AuthEvent = 'loggedIn' 'loggedOut' 'tokenRefreshed' 'sessionExpired';

class AuthManager {
  private authObserver = new Observer<AuthData, AuthEvent>();

    async login(username: string, password: string) {
      const response = await api.login(username, password);

      this.authObserver.notify('loggedIn', {
          userId: response.userId,
          token: response.token,
          expiresAt: response.expiresAt
        });
  }

logout() {
  this.authObserver.notify('loggedOut', {
      userId: '',
      token: '',
      expiresAt: 0
    });
}

onAuthStateChanged(callback: (data: AuthData) => void) {
  this.authObserver.subscribe('all', (data) => callback(data));
}
}
```

### Real-Time Document Collaboration
```typescript
import { EntityObserver } from '@htk/utils/observer';

type DocumentEvent = 'updated' 'locked' 'unlocked' 'deleted';

type DocumentData = {
  documentId: string;
  lastModified: number;
  lockedBy?: string;
};

class DocumentManager {
  private docObserver = new EntityObserver<DocumentData, DocumentEvent>();

    // User A edits document
    editDocument(docId: string, content: string) {
      this.saveToServer(docId, content);

      // Notify other users about the edit
      this.docObserver.notify(docId, 'updated', {
          documentId: docId,
          lastModified: Date.now()
        });
  }

// User B listens for edits on a specific document
watchDocument(docId: string, callback: () => void) {
  return this.docObserver.subscribe(docId, 'updated', callback);
}

// Lock document for editing
lockDocument(docId: string, userId: string) {
  this.docObserver.notify(docId, 'locked', {
      documentId: docId,
      lockedBy: userId,
      lastModified: Date.now()
    });
}
}
```

### Form Validation Observer
```typescript
import { Observer } from '@htk/utils/observer';

type ValidationData = {
  field: string;
  isValid: boolean;
  errors: string[];
};

type ValidationEvent = 'fieldValidated' 'formValid' 'formInvalid';

class FormValidator {
  private validationObserver = new Observer<ValidationData, ValidationEvent>();

    validateField(field: string, value: string) {
      const errors = this.getErrors(field, value);
      const isValid = errors.length === 0;

      this.validationObserver.notify('fieldValidated', {
          field,
          isValid,
          errors
        });
  }

onFieldValidated(callback: (data: ValidationData) => void) {
  return this.validationObserver.subscribe('fieldValidated', (data) => {
      callback(data);
    });
}

onFormStatusChange(callback: (data: ValidationData) => void) {
  return this.validationObserver.subscribe('all', (data) => {
      callback(data);
    });
}
}
```

### Multi-Entity Cache Invalidation
```typescript
import { EntityObserver } from '@htk/utils/observer';

type CacheData = {
  entityId: string;
  timestamp: number;
};

type CacheEvent = 'invalidated' 'updated';

class CacheManager {
  private cacheObserver = new EntityObserver<CacheData, CacheEvent>();

    // When an entity is updated on server
    invalidateEntity(entityId: string) {
      this.cacheObserver.notify(entityId, 'invalidated', {
          entityId,
          timestamp: Date.now()
        });
  }

// UI components can listen for cache changes
watchCache(entityId: string, callback: () => void) {
  return this.cacheObserver.subscribe(entityId, 'invalidated', callback);
}

// Bulk invalidation
invalidateAll(entityType: string) {
  Object.keys(this.cacheObserver.observers).forEach(entityId => {
      if (entityId.startsWith(entityType)) {
        this.invalidateEntity(entityId);
      }
  });
}
}
```

## React Integration

### Custom Hook for Observer
```typescript
import { useEffect, useRef } from 'react';
import { Observer } from '@htk/utils/observer';

function useObserver<
Data extends Record<string, any>,
Event extends string
>(
  observer: Observer<Data, Event>,
    event: Event,
    callback: (data: Data) => void
  ) {
  const callbackRef = useRef(callback);

  useEffect(() => {
      callbackRef.current = callback;
    }, [callback]);

useEffect(() => {
    const handleNotify = (data: Data) => {
      callbackRef.current(data);
    };

  return observer.subscribe(event, handleNotify);
}, [observer, event]);
}
```

### Using in Components
```typescript
function UserProfile() {
  const [user, setUser] = useState<User null>(null);

    useObserver(userObserver, 'updated', (data) => {
        setUser(data);
      });

  return (
    <View>
      <Text>{user?.name}</Text>
    </View>
);
}
```

## API Reference

### Observer Methods

 Method Signature Returns 
----------------------------
 `subscribe` `(event: Event, callback: Callback) => () => void` Unsubscribe function 
 `unsubscribe` `(event: Event, callback: Callback) => void` void 
 `notify` `(event: Event, data: Data) => void` void 

### EntityObserver Methods

 Method Signature Returns 
----------------------------
 `subscribe` `(entity: string, event: Event, callback: Callback) => () => void` Unsubscribe function 
 `unsubscribe` `(entity: string, event: Event, callback: Callback) => void` void 
 `notify` `(entity: string, event: Event, data: Data) => void` void 

## Type Safety

### Strong Typing with Union Types
```typescript
type UserEvent = 'created' 'updated' 'deleted';

const observer = new Observer<UserData, UserEvent>();

  // Type-safe - only valid events
  observer.subscribe('updated', callback);

  // TypeScript error - invalid event
  observer.subscribe('invalid', callback);
```

### Data Validation
```typescript
type ChangeData = {
  fieldName: string;
  oldValue: unknown;
  newValue: unknown;
};

type ChangeEvent = 'propertyChanged';

const observer = new Observer<ChangeData, ChangeEvent>();

  observer.subscribe('propertyChanged', (data) => {
      // data is guaranteed to match ChangeData shape
      console.log(`${data.fieldName}: ${data.oldValue} → ${data.newValue}`);
    });
```

## Performance Considerations

- **Subscription Management**: Unsubscribe callbacks returned from `subscribe()`
- **Memory Leaks**: Always unsubscribe in cleanup functions
- **Event Frequency**: Be mindful of high-frequency notifications
- **Callback Overhead**: Heavy computations should be debounced

### Preventing Memory Leaks
```typescript
function MyComponent() {
  useEffect(() => {
      // Store unsubscribe function
      const unsubscribe = observer.subscribe('event', handleEvent);

      // Clean up on unmount
      return () => unsubscribe();
    }, []);
}
```

## Pattern Comparison

### Observer vs Other Patterns
 Pattern Use Case Complexity 
------------------------------
 Observer Event-driven, decoupled communication Low 
 Redux/Zustand Complex centralized state Medium 
 Context API Theme, auth, global data Low 
 Pub/Sub (Mediator) Message-based systems Medium 
 Event Emitter Node.js style events Low 

## Best Practices

 **Do:**
- Always unsubscribe from observers
- Use meaningful event names
- Keep data payloads small
- Combine with React hooks
- Document observer contracts
- Use TypeScript for type safety
- Clean up in component unmount

 **Don't:**
- Share observer instances carelessly
- Pass large objects as event data
- Forget to unsubscribe
- Create circular dependencies
- Use for high-frequency updates (1000+ per sec)
- Mix multiple observer instances without clear ownership

## Related Documentation
- **String Utilities**: [`../string/README.md`](../string/README.md)
- **Utils**: [`../README.md`](../README.md) - All utility functions

## Testing Examples

```typescript
describe('Observer', () => {
    let observer: Observer<TestData, TestEvent>;

      beforeEach(() => {
          observer = new Observer();
        });

    it('calls subscriber when event is notified', () => {
        const callback = jest.fn();
        observer.subscribe('test', callback);

        observer.notify('test', { value: 'hello' });

        expect(callback).toHaveBeenCalledWith(
          { value: 'hello' },
          'test'
        );
    });

it('unsubscribes callback', () => {
    const callback = jest.fn();
    const unsubscribe = observer.subscribe('test', callback);

    unsubscribe();
    observer.notify('test', {});

    expect(callback).not.toHaveBeenCalled();
  });

it('calls all event subscribers', () => {
    const allCallback = jest.fn();
    observer.subscribe('all', allCallback);

    observer.notify('custom', { data: 'test' });

    expect(allCallback).toHaveBeenCalled();
  });
});

describe('EntityObserver', () => {
    let entityObserver: EntityObserver<TestData, TestEvent>;

      beforeEach(() => {
          entityObserver = new EntityObserver();
        });

    it('subscribes to entity-specific events', () => {
        const callback = jest.fn();
        entityObserver.subscribe('entity-1', 'test', callback);

        entityObserver.notify('entity-1', 'test', { value: 'test' });

        expect(callback).toHaveBeenCalled();
      });

  it('does not call other entity subscribers', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      entityObserver.subscribe('entity-1', 'test', callback1);
      entityObserver.subscribe('entity-2', 'test', callback2);

      entityObserver.notify('entity-1', 'test', {});

      expect(callback1).toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
    });
});
```

## Troubleshooting

### Callbacks Not Being Called
- Verify event name matches subscription
- Check that you're using the correct observer instance
- Ensure `notify()` is being called after subscription

### Memory Leaks
- Always store and call unsubscribe function
- Use React effect cleanup
- Check for circular subscriptions

### TypeScript Errors
- Verify Event type is a union of string literals
- Check Data type includes all properties being used
- Ensure generic parameters match subscriptions
