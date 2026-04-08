# Components

## Overview
Reusable React Native components for Expo applications. Each component is self-contained, thoroughly documented, and follows strict TypeScript conventions.

## Location
`components/`

## Purpose
Provides:
- Modular, reusable UI components
- Context-based state management for dialogs
- Type-safe component interfaces
- Theme-integrated styling
- Comprehensive documentation
- Best practices implementation

## Component Categories

### Dialogs
Dialog components for user interactions and confirmations.

**Location:** [`Dialogs/README.md`](Dialogs/README.md)

**Components:**
- **Confirm** - Confirmation dialog for user approval
- **Root** - Container component
- **Title** - Dialog title
- **Buttons** - Layout strategies (horizontal/vertical)

**Usage:**
```typescript
import { Confirm, useConfirm } from '@htk/components/Dialogs';

<Confirm>
  <App />
</Confirm>

const { confirm } = useConfirm();
confirm({
    title: 'Confirm?',
    buttons: [
      { label: 'Cancel', onPress: () => {} },
      { label: 'OK', onPress: handleConfirm }
    ]
});
```

## Architecture

```typescript
components/
├── Dialogs/ # Dialog components
│ ├── Confirm/ # Confirmation dialog
│ │ ├── index.tsx # Main export
│ │ ├── context.ts # State management
│ │ ├── Root.tsx # Container
│ │ ├── Title.tsx # Title component
│ │ ├── HorizontalButtons.tsx
│ │ ├── VerticalButtons.tsx
│ │ └── README.md # Documentation
│ └── README.md # Dialogs overview
└── README.md # This file
```

## Development Guidelines

### Folder Structure
Each component should have its own folder:

 **Good:**
```typescript
components/Button/
├── index.tsx
├── Button.tsx
├── ButtonStyles.ts
└── README.md
```

 **Bad:**
```typescript
components/Button.tsx
```

### TypeScript Requirements

1. **Interfaces for Props**
 ```typescript
export interface ButtonProps {
  /**
  * Button label text
  */
  label: string;

  /**
  * Called when button pressed
  */
  onPress?: () => void;
}
```

2. **Export Interfaces**
 ```typescript
// Good
export interface ComponentProps { }
export function Component(props: ComponentProps) { }

// Bad
interface Props { }
export function Component(props: Props) { }
```

3. **File Extension**
 - Use `.tsx` for components with JSX
 - Use `.ts` for TypeScript without JSX

### Documentation Requirements

1. **Component JSDoc**
 ```typescript
/**
* Button Component
*
* A customizable button with multiple variants and states.
*
* @example
*
```tsx
  * <Button
  * label="Press me"
  * onPress={() => console.log('Pressed')}
  * />
  * ```typescript
*/
export function Button(props: ButtonProps) { }
```

2. **Prop JSDoc**
 ```typescript
export interface ButtonProps {
  /**
  * Text displayed on button.
  * @default 'Button'
  */
  label: string;

  /**
  * Button variants.
  * @default 'primary'
  */
  variant?: 'primary' 'secondary' 'outline';

  /**
  * Called when button is pressed.
  */
  onPress?: () => void;
}
```

3. **README.md in Component Folder**
 Each component folder should include comprehensive documentation.

## Best Practices

 **Do:**
- Follow folder structure rules
- Export prop interfaces
- Provide extensive JSDoc
- Use TypeScript types
- Include README files
- Test components thoroughly
- Use react-native-ui-lib for styling
- Support theme integration
- Memoize when appropriate

 **Don't:**
- Mix multiple components in one file
- Use `type Props` instead of interfaces
- Skip documentation
- Hard-code colors or styles
- Use any types
- Create components without tests
- Ignore accessibility
- Forget to handle edge cases

## Theme Integration

All components should integrate with the theme system:

```typescript
import { Colors, View, Text } from 'react-native-ui-lib';

export function ThemedComponent(props: Props) {
  return (
    <View
      style={{
      backgroundColor: Colors.$backgroundDefault,
      padding: 16
      }}
>
<Text style={{ color: Colors.$textDefault }}>
  Theme-aware component
</Text>
    </View>
);
}
```

## Accessibility

Components should support:
- Screen readers
- Keyboard navigation
- Touch targets (minimum 44x44pt)
- High contrast mode
- Semantic HTML/accessibility labels

## Testing

Each component should have tests:

```typescript
import { render } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
    it('renders with label', () => {
        const { getByText } = render(<Button label="Test" />);
      expect(getByText('Test')).toBeTruthy();
    });

it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <Button label="Test" onPress={onPress} />
  );

fireEvent.press(getByRole('button'));
expect(onPress).toHaveBeenCalled();
});
});
```

## Component Checklist

When creating a new component:

- [ ] Create component folder with descriptive name
- [ ] Create `index.tsx` with main component
- [ ] Create `README.md` with documentation
- [ ] Export `<ComponentName>Props` interface
- [ ] Add JSDoc to component
- [ ] Add JSDoc to all props
- [ ] Include usage examples
- [ ] Test component thoroughly
- [ ] Integrate with theme system
- [ ] Consider accessibility
- [ ] Handle edge cases
- [ ] Type all arguments and returns

## Dependencies

### Required
- `react-native-ui-lib` - Styling and UI components
- `react-native` - React Native framework
- `expo` - Expo framework (for Expo projects)

### Optional
- `@react-navigation/native` - Navigation integration

## Related Documentation

### Child Components
- **Dialogs**: [`Dialogs/README.md`](Dialogs/README.md) - Dialog components

### Features Using Components
- **App Settings**: [`../features/appSettings/README.md`](../features/appSettings/README.md) - Settings UI
- **Theme System**: [`../features/theme/README.md`](../features/theme/README.md) - Theme integration

### Development
- **Utils**: [`../utils/README.md`](../utils/README.md) - Utility functions
- **Types**: [`../types/README.md`](../types/README.md) - Shared types

## Common Component Patterns

### Context-Based State
```typescript
import React from 'react';

export const MyContext = React.createContext<State>(defaultState);

  export interface MyComponentProps {
    children: ReactNode;
  }

export function MyProvider(props: MyComponentProps) {
  const [state, setState] = React.useState(defaultState);

  return (
    <MyContext.Provider value={state}>
      {props.children}
    </MyContext.Provider>
);
}

export function useMyComponent() {
  const context = React.useContext(MyContext);
  if (!context) {
    throw new Error('useMyComponent must be used within MyProvider');
  }
return context;
}
```

### Compound Components
```typescript
export function Container(props: ContainerProps) {
  return <View>{props.children}</View>;
}

export function Header(props: HeaderProps) {
  return <View>{props.children}</View>;
}

export function Content(props: ContentProps) {
  return <View>{props.children}</View>;
}

// Usage:
<Container>
  <Container.Header>Title</Container.Header>
  <Container.Content>Content</Container.Content>
  </Container>
```

## Version Compatibility
- React Native: 0.60+
- Expo: SDK 40+
- TypeScript: 4.0+
- react-native-ui-lib: Latest
